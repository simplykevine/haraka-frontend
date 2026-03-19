"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import UserMessage from "./components/UserMessageCard";
import AgentMessage from "./components/AgentMessageCard";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import type { ChatMessagesProps, RunLike, RunFile } from "@/app/utils/types/chat";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PRE_PROMPTS = [
  "Forecast the prices of maize in the next 2 months for Kenya",
  "what if we subsidize maize production in Kenya",
  "Simulate a 30% US tariff on Kenyan maize exports. Estimate impact on: exports, domestic prices, farmer income, trade balance, and market substitution.",
  "Assume a geopolitical conflict disrupts fertilizer exports from the Middle East and increases global shipping costs by 20%. Model the impact on Kenya's maize production, input costs, retail maize prices, and food inflation. Identify supply-chain vulnerabilities and estimate time lag effects.",
  "If Tanzania increases maize production by 15% due to favorable rainfall, how would this affect Kenyan maize exports, cross-border trade flows, and domestic producer prices?",
  "Simulate a temporary 6-month maize import ban from Tanzania or Uganda. Estimate impact on domestic supply gap, price volatility, and food security indicators. Would strategic reserves absorb the shock?",
  "what will the current war happening between Iran, Israel and USA affect Kenya's economy in terms of exports and imports",
];

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 15;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;

async function addCanvasToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  isFirstPage: boolean,
  dateLabel: string
) {
  const pxPerMm = canvas.width / CONTENT_WIDTH_MM;
  const contentHeightMm = A4_HEIGHT_MM - MARGIN_MM * 2 - 10;
  const contentHeightPx = contentHeightMm * pxPerMm;
  const totalHeightPx = canvas.height;

  let offsetPx = 0;
  let pageIndex = 0;

  while (offsetPx < totalHeightPx) {
    if (!isFirstPage || pageIndex > 0) {
      pdf.addPage();
    }

    pdf.setFillColor(11, 24, 47);
    pdf.rect(0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, "F");

    const sliceHeightPx = Math.min(contentHeightPx, totalHeightPx - offsetPx);
    const sliceHeightMm = sliceHeightPx / pxPerMm;

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeightPx;
    const ctx = sliceCanvas.getContext("2d")!;
    ctx.fillStyle = "#0B182F";
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(canvas, 0, -offsetPx);

    const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(sliceData, "JPEG", MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, sliceHeightMm);

    pdf.setFontSize(9);
    pdf.setTextColor(100, 140, 180);
    pdf.text(
      `© ${new Date().getFullYear()} Zeno AI · Confidential · ${dateLabel}`,
      MARGIN_MM,
      A4_HEIGHT_MM - 6
    );
    pdf.text(
      `Page ${pdf.getNumberOfPages()}`,
      A4_WIDTH_MM - MARGIN_MM - 12,
      A4_HEIGHT_MM - 6
    );

    offsetPx += contentHeightPx;
    pageIndex++;
  }
}

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
    if (!isGenerating || !runToDownload || !singlePrintRef.current) return;

    const capture = async () => {
      try {
        const container = singlePrintRef.current!;

        await new Promise((r) => setTimeout(r, 400));

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const dateLabel = new Date().toLocaleDateString();

        pdf.setFillColor(11, 24, 47);
        pdf.rect(0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, "F");

        pdf.setFontSize(24);
        pdf.setTextColor(159, 248, 248);
        pdf.text("Zeno AI — Research Report", A4_WIDTH_MM / 2, 38, { align: "center" });

        pdf.setFontSize(12);
        pdf.setTextColor(160, 190, 220);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, A4_WIDTH_MM / 2, 48, { align: "center" });

        pdf.setDrawColor(30, 70, 110);
        pdf.line(MARGIN_MM, 55, A4_WIDTH_MM - MARGIN_MM, 55);

        pdf.setFontSize(10);
        pdf.setTextColor(100, 160, 220);
        pdf.text("QUERY", MARGIN_MM, 64);

        pdf.setFontSize(13);
        pdf.setTextColor(220, 235, 255);
        const queryLines = pdf.splitTextToSize(runToDownload.user_input ?? "", CONTENT_WIDTH_MM);
        pdf.text(queryLines, MARGIN_MM, 72);

        pdf.setDrawColor(30, 70, 110);
        const queryBottom = 72 + queryLines.length * 7 + 8;
        pdf.line(MARGIN_MM, queryBottom, A4_WIDTH_MM - MARGIN_MM, queryBottom);

        pdf.setFontSize(9);
        pdf.setTextColor(100, 140, 180);
        pdf.text(
          `© ${new Date().getFullYear()} Zeno AI · Confidential`,
          MARGIN_MM,
          A4_HEIGHT_MM - 6
        );
        pdf.text("Page 1", A4_WIDTH_MM - MARGIN_MM - 12, A4_HEIGHT_MM - 6);

        pdf.addPage();

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#0B182F",
          logging: false,
          windowWidth: container.scrollWidth,
          windowHeight: container.scrollHeight,
          width: container.scrollWidth,
          height: container.scrollHeight,
        });

        await addCanvasToPdf(pdf, canvas, true, dateLabel);

        pdf.save(`zeno-report-${new Date().toISOString().split("T")[0]}.pdf`);
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        setIsGenerating(false);
        setRunToDownload(null);
      }
    };

    capture();
  }, [isGenerating, runToDownload]);

  const isEthiopiaForecast = (text: string): boolean =>
    text.includes("Ethiopia is the birthplace of Arabica coffee");

  const isKenyaCoffeeForecast = (text: string): boolean => {
    const patterns = [
      /Kenya.*high-altitude.*specialty-grade/,
      /Nairobi Coffee Exchange/,
      /December 2025.*January 2026/,
      /US\$395 per 50 kg/,
    ];
    return patterns.some((p) => p.test(text));
  };

  const getForecastHeader = (text: string): string | null => {
    if (isEthiopiaForecast(text)) return "Ethiopia Coffee Prices and Export Volumes";
    if (isKenyaCoffeeForecast(text)) return "Kenya Coffee Price Forecast:";
    return null;
  };

  const handlePrePromptClick = (prompt: string) => {
    if (onSendSuggestion) onSendSuggestion(prompt);
  };

  return (
    <>
      {runToDownload && (
        <div
          ref={singlePrintRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "960px",
            backgroundColor: "#0B182F",
            color: "white",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "25px",
            lineHeight: 2.1,
            padding: "56px 64px",
            boxSizing: "border-box",
            overflow: "visible",
          }}
        >
          {runToDownload.status === "completed" && runToDownload.final_output && (
            <div>
              <div
                style={{
                  color: "#9FF8F8",
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "32px",
                  paddingBottom: "14px",
                  borderBottom: "2px solid #1e4a7a",
                  letterSpacing: "0.5px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Dr. Zeno&apos;s Analysis
              </div>

              <div
                style={{
                  color: "#ddeeff",
                  fontSize: "18px",
                  lineHeight: 2.1,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1
                        style={{
                          color: "#9FF8F8",
                          fontSize: "31px",
                          fontWeight: "bold",
                          marginTop: "40px",
                          marginBottom: "16px",
                          fontFamily: "Arial, sans-serif",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          color: "#9FF8F8",
                          fontSize: "29px",
                          fontWeight: "bold",
                          marginTop: "34px",
                          marginBottom: "14px",
                          fontFamily: "Arial, sans-serif",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          color: "#aee8f8",
                          fontSize: "27px",
                          fontWeight: "bold",
                          marginTop: "28px",
                          marginBottom: "12px",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p
                        style={{
                          color: "#ddeeff",
                          fontSize: "25px",
                          lineHeight: 2.1,
                          marginBottom: "24px",
                          marginTop: "0px",
                          textAlign: "justify",
                        }}
                      >
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong
                        style={{
                          color: "#ffffff",
                          fontWeight: "bold",
                        }}
                      >
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em style={{ color: "#b0d4f1", fontStyle: "italic" }}>
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul
                        style={{
                          paddingLeft: "32px",
                          marginBottom: "24px",
                          marginTop: "12px",
                          color: "#ddeeff",
                        }}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol
                        style={{
                          paddingLeft: "32px",
                          marginBottom: "24px",
                          marginTop: "12px",
                          color: "#ddeeff",
                        }}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li
                        style={{
                          marginBottom: "12px",
                          lineHeight: 2.0,
                          fontSize: "18px",
                          color: "#ddeeff",
                        }}
                      >
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "4px solid #3a7abf",
                          paddingLeft: "20px",
                          marginLeft: "0",
                          marginBottom: "24px",
                          color: "#a0c8e8",
                          fontStyle: "italic",
                          fontSize: "18px",
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                    hr: () => (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #1e4a7a",
                          margin: "32px 0",
                        }}
                      />
                    ),
                    code: ({ children }) => (
                      <code
                        style={{
                          backgroundColor: "#0f2a45",
                          color: "#7dd3fc",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "16px",
                          fontFamily: "monospace",
                        }}
                      >
                        {children}
                      </code>
                    ),
                  }}
                >
                  {runToDownload.final_output}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {runToDownload.status === "failed" && (
            <div style={{ color: "#ff6b6b", fontStyle: "italic", fontSize: "18px" }}>
              [Response failed]
            </div>
          )}

          {runToDownload.status === "completed" &&
            Array.isArray(runToDownload.output_artifacts) &&
            runToDownload.output_artifacts
              .filter((a) => a.artifact_type !== "progress")
              .map((artifact, idx) => (
                <div
                  key={artifact.id ?? idx}
                  style={{
                    marginTop: "48px",
                    backgroundColor: "#0c1e35",
                    borderRadius: "12px",
                    padding: "28px 32px",
                    border: "1px solid #1e4a7a",
                  }}
                >
                  {artifact.title && (
                    <div
                      style={{
                        color: "#9FF8F8",
                        fontWeight: "bold",
                        fontSize: "19px",
                        marginBottom: "20px",
                        fontFamily: "Arial, sans-serif",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {artifact.title}
                    </div>
                  )}
                  <ChatArtifactRenderer
                    artifactType={artifact.artifact_type}
                    artifactData={artifact.data}
                    text={artifact.title}
                  />
                </div>
              ))}

          <div
            style={{
              marginTop: "64px",
              paddingTop: "16px",
              borderTop: "1px solid #1e4a7a",
              textAlign: "center",
              fontSize: "14px",
              color: "#4a7aaa",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            © {new Date().getFullYear()} Zeno AI · Confidential · Generated{" "}
            {new Date().toLocaleString()}
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 w-full xl:max-w-5xl lg:max-w-2xl md:max-w-xl mx-auto scrollbar-hide"
      >
        {runs.length === 0 ? (
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
            <div key={run.id}>
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
                          .filter((a) => a.artifact_type === "progress")
                          .map((a) => (a.data as { message?: string })?.message || "...")
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
                      .filter((a) => a.artifact_type !== "progress")
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
                      run.output_artifacts.filter(
                        (a) => a.artifact_type !== "progress"
                      ).length === 0) && (
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
          <div className="bg-gray-800 text-white px-6 py-4 rounded-lg flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Generating PDF — please wait...</span>
          </div>
        </div>
      )}
    </>
  );
}