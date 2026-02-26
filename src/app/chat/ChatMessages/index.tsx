"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import UserMessage from "./components/UserMessageCard";
import AgentMessage from "./components/AgentMessageCard";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import type { ChatMessagesProps, RunLike, RunFile } from "@/app/utils/types/chat";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Sparkles } from "lucide-react";

// ✅ Pre-prompt suggestions
const PRE_PROMPTS = [
  "Forecast Ethiopian coffee price in the next 2 years",
  "Forecast the prices of maize in the next 2 months for Kenya",
];

export default function ChatMessages({
  runs: runsProp,
  onRetry,
  userId,
  runLimitError,
  onSendSuggestion,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const singlePrintRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [runToDownload, setRunToDownload] = useState<RunLike | null>(null);

  const runs = useMemo(() => Array.isArray(runsProp) ? runsProp : [], [runsProp]);

  const isNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && isNearBottom()) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNearBottom]);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [runs, scrollToBottom]);

  const generatePDF = async (run: RunLike) => {
    setRunToDownload(run);
    setIsGenerating(true);
  };

  useEffect(() => {
    if (isGenerating && runToDownload && singlePrintRef.current) {
      const capture = async () => {
        try {
          const canvas = await html2canvas(singlePrintRef.current!, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#0B182F",
            logging: false,
          });

          if (canvas.width <= 0 || canvas.height <= 0) return;

          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (isNaN(imgHeight) || imgHeight <= 0) return;

          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
          pdf.save(`zeno-message-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
          console.error("PDF generation failed:", error);
        } finally {
          setIsGenerating(false);
          setRunToDownload(null);
        }
      };

      capture();
    }
  }, [isGenerating, runToDownload]);

  // === DETECTION LOGIC ===
  const isEthiopiaForecast = (text: string): boolean => {
    return text.includes("Ethiopia is the birthplace of Arabica coffee");
  };

  const isKenyaCoffeeForecast = (text: string): boolean => {
    const patterns = [
      /Kenya.*high-altitude.*specialty-grade/,
      /Nairobi Coffee Exchange/,
      /December 2025.*January 2026/,
      /US\$395 per 50 kg/,
    ];
    return patterns.some(p => p.test(text));
  };

  const getForecastHeader = (text: string): string | null => {
    if (isEthiopiaForecast(text)) {
      return "Ethiopia Coffee Prices and Export Volumes";
    } else if (isKenyaCoffeeForecast(text)) {
      return "Kenya Coffee Price Forecast: ";
    }
    return null;
  };

  // ✅ Handle pre-prompt click
  const handlePrePromptClick = (prompt: string) => {
    if (onSendSuggestion) {
      onSendSuggestion(prompt);
    }
  };

  return (
    <>
      {runToDownload && (
        <div
          ref={singlePrintRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "210mm",
            padding: "20mm",
            backgroundColor: "#0B182F",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "12pt",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Image
              src="/images/zeno-logo-icon.png"
              alt="Zeno Logo"
              width={120}
              height={40}
              style={{ height: "40px", marginBottom: "10px", width: "auto" }}
            />
            <h1 style={{ fontSize: "18pt", fontWeight: "bold", color: "#9FF8F8" }}>
              Message Report
            </h1>
            <p style={{ fontSize: "10pt", color: "#aaa" }}>
              Generated on {new Date().toLocaleString()}
            </p>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontWeight: "bold", color: "#9FF8F8", marginBottom: "8px" }}>
              You:
            </div>
            <div style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>
              {runToDownload.user_input}
            </div>

            {runToDownload.status === "completed" && runToDownload.final_output && (
              <>
                <div style={{ fontWeight: "bold", color: "#9FF8F8", marginBottom: "8px" }}>
                  Zeno Agent:
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {runToDownload.final_output}
                </div>
              </>
            )}

            {runToDownload.status === "failed" && (
              <div style={{ color: "red", fontStyle: "italic" }}>
                [Response failed]
              </div>
            )}
          </div>
          <div style={{ marginTop: "40px", textAlign: "center", fontSize: "9pt", color: "#666" }}>
            © {new Date().getFullYear()} Zeno AI. Confidential.
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 w-full xl:max-w-5xl lg:max-w-2xl md:max-w-xl mx-auto scrollbar-hide"
      >
        {runs.length === 0 ? (
          // ✅ Show pre-prompts when chat is empty
          <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="text-cyan-400" size={32} />
                <h2 className="text-2xl font-bold text-white">Start a Conversation</h2>
              </div>
              <p className="text-gray-400 text-sm">Try one of these suggestions:</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-lg">
              {PRE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePrePromptClick(prompt)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/70 hover:border-cyan-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-cyan-400" size={12} />
                    </div>
                    <span className="text-gray-300 text-sm group-hover:text-white">
                      {prompt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          runs.map((run: RunLike) => (
            <div key={run.id} className="">
              <UserMessage
                text={run.user_input}
                files={
                  run.files
                    ? run.files.map((file) =>
                        typeof file === "object" &&
                        "file" in file &&
                        "previewUrl" in file
                          ? (file as RunFile)
                          : { file, previewUrl: "" }
                      )
                    : undefined
                }
              />

              {(run.status === "pending" || run.status === "running") && (
                <AgentMessage
                  loading
                  progressMessages={
                    Array.isArray(run.output_artifacts)
                      ? run.output_artifacts
                          .filter(a => a.artifact_type === "progress")
                          .map(a => (a.data as { message?: string })?.message || "...")
                      : []
                  }
                />
              )}

              {run.status === "completed" && (
                <>
                  {run.final_output && (
                    <>
                      {getForecastHeader(run.final_output) && (
                        <div className="mb-2 mt-4">
                          <h2 className="text-xl font-bold text-white border-emerald-700 pb-2">
                            {getForecastHeader(run.final_output)}
                          </h2>
                        </div>
                      )}
                      <AgentMessage text={run.final_output} />
                    </>
                  )}

                  {Array.isArray(run.output_artifacts) &&
                    run.output_artifacts
                      .filter(a => a.artifact_type !== "progress")
                      .map((artifact, idx) => (
                        <ChatArtifactRenderer
                          key={artifact.id ?? idx}
                          artifactType={artifact.artifact_type}
                          artifactData={artifact.data}
                          text={artifact.title}
                        />
                      ))}

                  {!run.final_output &&
                    (!Array.isArray(run.output_artifacts) ||
                      run.output_artifacts.filter(a => a.artifact_type !== "progress").length === 0) && (
                      <AgentMessage text="No response generated." />
                    )}

                  <div className="flex mt-3">
                    <FeedbackButtons
                      userId={userId ?? 0}
                      textToCopy={run.final_output || ""}
                      onDownloadReport={generatePDF}
                      runData={run}
                    />
                  </div>
                </>
              )}

              {run.status === "failed" && (
                <div className="ml-10">
                  <AgentMessage text="No response found. Please try rephrasing your question or check back later." />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg">
            Generating PDF...
          </div>
        </div>
      )}
    </>
  );
}