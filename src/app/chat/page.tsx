'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "../sharedComponents/Sidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "../sharedComponents/ChatInput";
import { RunFile, RunLike } from "../utils/types/chat";
import { Conversation, InputFile } from "../utils/types/runs";
import { useConversationsWithRuns } from "../hooks/useConversationWithRuns";
import { useRuns } from "../hooks/useFetchPostRuns";
import { Hand, Sparkles } from "lucide-react";
import { useRouter } from 'next/navigation';

const PRE_PROMPTS = [
  "Forecast the prices of maize in the next 2 months for Kenya",
  "what if we subsidize maize production in Kenya",
  "Simulate a 30% US tariff on Kenyan maize exports. Estimate impact on: exports, domestic prices, farmer income, trade balance, and market substitution.",
  "Assume a geopolitical conflict disrupts fertilizer exports from the Middle East and increases global shipping costs by 20%. Model the impact on Kenya's maize production, input costs, retail maize prices, and food inflation. Identify supply-chain vulnerabilities and estimate time lag effects.",
  "If Tanzania increases maize production by 15% due to favorable rainfall, how would this affect Kenyan maize exports, cross-border trade flows, and domestic producer prices?",
  "Simulate a temporary 6-month maize import ban from Tanzania or Uganda. Estimate impact on domestic supply gap, price volatility, and food security indicators. Would strategic reserves absorb the shock?",
  "what will the current war hapening between Iran, Israel and USA affect Kenya's economy in terms of exports and exports currentlyterms of exports and imports",
];

const getMimeType = (fileType: string): string => {
  switch (fileType) {
    case 'pdf': return 'application/pdf';
    case 'image': return 'image/jpeg';
    case 'csv': return 'text/csv';
    case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'word': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'text': return 'text/plain';
    default: return 'application/octet-stream';
  }
};

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [showGreeting, setShowGreeting] = useState(true);
  const [runLimitError, setRunLimitError] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const router = useRouter();
  const justCreatedConversationRef = useRef(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const storedRole = localStorage.getItem('role');
    if (storedToken && id && (storedRole === 'User' || storedRole === 'Admin')) {
      setToken(storedToken);
      setUserId(parseInt(id, 10));
      setRole(storedRole);
    } else {
      router.push('/signin');
    }
  }, [router]);

  const user = token && userId ? { id: userId, token } : undefined;

  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    fetchConvos,
    setConversations,
  } = useConversationsWithRuns(token);

  const handleRunUpdate = useCallback((updatedRun: RunLike) => {
    if (!selectedConversationId) return;
    setConversations(prev => prev.map(conv => {
      if (conv.conversation_id === selectedConversationId) {
        const currentRuns = conv.runs || [];
        const existingRunIndex = currentRuns.findIndex(r => r.id === updatedRun.id);
        const newRuns = [...currentRuns];
        if (existingRunIndex >= 0) {
          newRuns[existingRunIndex] = { ...newRuns[existingRunIndex], ...updatedRun };
        } else {
          newRuns.push(updatedRun);
        }
        return { ...conv, runs: newRuns };
      }
      return conv;
    }));
  }, [selectedConversationId, setConversations]);

  const { runs, sendMessage, setRuns, clearRuns } = useRuns(
    selectedConversationId,
    user,
    handleRunUpdate
  );

  useEffect(() => {
    if (runs.length > 0) {
      setShowGreeting(false);
    }
  }, [runs]);

  useEffect(() => {
    if (selectedConversationId === null) {
      setRuns([]);
      setShowGreeting(true);
      return;
    }

    if (justCreatedConversationRef.current) {
      justCreatedConversationRef.current = false;
      return;
    }

    const selectedConversation = conversations.find(
      (c) => c.conversation_id === selectedConversationId
    );

    if (selectedConversation) {
      const hasOptimisticRuns = runs.some(r => r._optimistic);
      if (hasOptimisticRuns) return;

      const mappedRuns = (selectedConversation.runs || [])
        .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
        .map(run => {
          const files: RunFile[] = (run as any).input_files?.map((inputFile: InputFile) => {
            const fileName = inputFile.file.split('/').pop() || 'file';
            const mockFile = new File([], fileName, {
              type: getMimeType(inputFile.file_type) || 'application/octet-stream',
            });
            return { file: mockFile, previewUrl: inputFile.file };
          }) || [];

          return {
            id: String(run.id),
            user_input: run.user_input,
            final_output: run.final_output,
            output_artifacts: run.output_artifacts || [],
            status: run.status?.toLowerCase() || "completed",
            started_at: run.started_at,
            files,
            _optimistic: false,
            error: run.status?.toLowerCase() === 'failed' && run.final_output
              ? run.final_output
              : undefined,
          };
        });

      setRuns(mappedRuns);
      setShowGreeting(mappedRuns.length === 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, conversations, setRuns]);

  const handleSendMessage = useCallback(async ({
    conversationId,
    userInput,
    files,
    filePreviews,
  }: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }): Promise<RunLike> => {
    let finalConversationId = conversationId;

    try {
      if (!finalConversationId) {
        const createRes = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ user_id: userId, title: "New Chat" }),
        });

        const convData: Conversation = await createRes.json();

        if (!createRes.ok) {
          throw new Error(
            (convData as any)?.error ||
            (convData as any)?.message ||
            "Failed to create conversation"
          );
        }

        finalConversationId = String(convData.conversation_id);
        justCreatedConversationRef.current = true;
        setConversations((prev) => [{ ...convData, runs: [] }, ...prev]);
        setSelectedConversationId(convData.conversation_id);
        setRuns([]);
      }

      setShowGreeting(false);

      const result = await sendMessage({ userInput, files, filePreviews });

      if (!conversationId && finalConversationId) {
        const cleanInput = userInput.trim();
        if (cleanInput) {
          const words = cleanInput.split(/\s+/);
          const title = words.length > 5
            ? words.slice(0, 5).join(' ') + '...'
            : cleanInput;
          await fetch(`/api/conversations/${finalConversationId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ title }),
          });
          setConversations(prev => prev.map(c =>
            c.conversation_id === Number(finalConversationId)
              ? { ...c, title }
              : c
          ));
        }
      }

      setRunLimitError(false);
      return result;
    } catch (error) {
      let errorMsg = "Failed to send the message";
      let isRunLimit = false;

      if (error instanceof Error) {
        if (error.message.includes("Run limit")) {
          errorMsg = "You have reached the maximum number of runs for this conversation. Try to open another conversation.";
          isRunLimit = true;
        } else {
          errorMsg = error.message;
        }
      }

      setConversationError(errorMsg);
      setRunLimitError(isRunLimit);
      throw error instanceof Error ? error : new Error(errorMsg);
    }
  }, [token, userId, sendMessage, setConversations, setSelectedConversationId, setRuns]);

  const handleSendSuggestion = useCallback(async (prompt: string) => {
    await handleSendMessage({
      conversationId: selectedConversationId !== null
        ? String(selectedConversationId)
        : undefined,
      userInput: prompt,
    });
  }, [handleSendMessage, selectedConversationId]);

  if (!user || (role !== 'User' && role !== 'Admin')) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="text-center"></div>
      </div>
    );
  }

  async function handleAddChat() {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ user_id: userId, title: "New Chat" }),
    });

    let data: Conversation | null = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      let errorMsg = "Failed to create conversation";
      if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        typeof (data as any).error === "string"
      ) {
        errorMsg = (data as any).error.includes("Daily conversation limit")
          ? "You have run out of conversations for today. Try again tomorrow."
          : (data as any).error;
      }
      setConversationError(errorMsg);
      return;
    }

    setConversations((prev) => [{ ...data!, runs: [] }, ...prev]);
    setSelectedConversationId(data!.conversation_id);
    setRuns([]);
    setShowGreeting(true);
  }

  async function handleRenameConversation(id: number, title: string) {
    const res = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setConversations(prev => prev.map(c =>
        c.conversation_id === id ? { ...c, title } : c
      ));
    }
  }

  async function handleDeleteConversation(id: number) {
    const res = await fetch(`/api/conversations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      const updated = conversations.filter(c => c.conversation_id !== id);
      setConversations(updated);
      if (selectedConversationId === id) {
        if (updated.length > 0) {
          setSelectedConversationId(updated[0].conversation_id);
          clearRuns();
        } else {
          setSelectedConversationId(null);
          setRuns([]);
          setShowGreeting(true);
        }
      }
      await fetchConvos();
    }
  }

  return (
    <div className="flex h-screen text-white">
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
        onAddChat={handleAddChat}
        onLogout={() => { localStorage.clear(); router.push('/signin'); }}
        isMobile={false}
        showSidebar={true}
        setShowSidebar={() => {}}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        conversationError={conversationError}
        setConversationError={setConversationError}
      />

      <div className="flex-1 flex flex-col h-screen bg-transparent">
        <div className="flex flex-col gap-2 px-4 pt-4 pb-2 overflow-y-auto flex-1">

          {showGreeting ? (
            <div className="flex flex-col items-center justify-center h-full gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <h1 className="text-5xl font-bold text-white">Hello there!</h1>
                  <Hand className="animate-waving text-cyan-400" size={64} strokeWidth={1.5} />
                </div>
                <p className="text-gray-300 text-2xl 2xl:text-5xl">
                  How may I help you today?
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-3xl">
                <p className="text-center text-gray-100 text-lg mb-1 flex items-center justify-center gap-2">
                  <Sparkles size={14} className="text-cyan-400" />
                  Try one of these suggestions
                </p>
                {PRE_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendSuggestion(prompt)}
                    className="w-full text-left px-5 py-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/70 hover:border-cyan-500/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="text-cyan-400" size={12} />
                      </div>
                      <span className="text-gray-300 text-lg group-hover:text-white transition-colors">
                        {prompt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ChatMessages
              runs={runs}
              onRetry={async (run) =>
                await handleSendMessage({
                  conversationId: selectedConversationId !== null
                    ? String(selectedConversationId)
                    : undefined,
                  userInput: run.user_input,
                  files: run.files?.map((f: RunFile) => f.file) || [],
                  filePreviews: run.files,
                })
              }
              userId={user.id}
              runLimitError={runLimitError}
              onSendSuggestion={handleSendSuggestion}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          conversationId={selectedConversationId !== null
            ? String(selectedConversationId)
            : undefined}
          user={user}
          sendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}