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
  "Forecast Ethiopian coffee price in the next 2 years",
  "Forecast the prices of maize in the next 2 months for Kenya",
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    if (token && id && (role === 'User' || role === 'Admin')) {
      setToken(token);
      setUserId(parseInt(id, 10));
      setRole(role);
    } else {
      router.push('/signin');
    }
  }, [router]);

  const user = token && userId ? { id: userId, token } : undefined;
  const [conversationError, setConversationError] = useState<string | null>(null);

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

  const hasInitializedRuns = useRef(false);

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

    const selectedConversation = conversations.find(
      (conversation) => conversation.conversation_id === selectedConversationId
    );

    if (selectedConversation && selectedConversation.runs) {
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
            files: files,
            _optimistic: false,
            error: run.status?.toLowerCase() === 'failed' && run.final_output
              ? run.final_output
              : undefined,
          };
        });

      setRuns(mappedRuns);
      setShowGreeting(mappedRuns.length === 0);
      hasInitializedRuns.current = true;
    }
  }, [selectedConversationId, conversations, setRuns]);

  // ✅ FIXED: handleSendMessage defined BEFORE handleSendSuggestion
  // and BEFORE any early return — so hook order is always consistent
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
        setConversations((prev) => [convData, ...prev]);
        setSelectedConversationId(convData.conversation_id);
        setRuns([]);
      }

      setShowGreeting(false);

      const result = await sendMessage({ userInput, files, filePreviews });

      await fetchConvos();

      if (!conversationId) {
        const cleanInput = userInput.trim();
        if (cleanInput && finalConversationId) {
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
  }, [token, userId, sendMessage, fetchConvos, setConversations, setSelectedConversationId, setRuns]);

  // ✅ FIXED: Now safely after handleSendMessage and before early return
  const handleSendSuggestion = useCallback(async (prompt: string) => {
    await handleSendMessage({
      conversationId: selectedConversationId !== null
        ? String(selectedConversationId)
        : undefined,
      userInput: prompt,
    });
  }, [handleSendMessage, selectedConversationId]);

  // ✅ ALL hooks above — early return is safe here
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
        typeof data.error === "string"
      ) {
        errorMsg = data.error.includes("Daily conversation limit")
          ? "You have run out of conversations for today. Try again tomorrow."
          : data.error;
      }
      setConversationError(errorMsg);
      return;
    }

    setConversations((prev) => [data!, ...prev]);
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
    if (res.ok) await fetchConvos();
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
          hasInitializedRuns.current = false;
        } else {
          setSelectedConversationId(null);
          setRuns([]);
          setShowGreeting(true);
          hasInitializedRuns.current = false;
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

              {/* Greeting */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <h1 className="text-5xl font-bold text-white">Hello there!</h1>
                  <Hand className="animate-waving text-cyan-400" size={64} strokeWidth={1.5} />
                </div>
                <p className="text-gray-300 text-2xl 2xl:text-5xl">
                  How may I help you today?
                </p>
              </div>

              {/* ✅ Pre-prompt suggestion chips */}
              <div className="flex flex-col gap-3 w-full max-w-lg">
                <p className="text-center text-gray-400 text-sm mb-1 flex items-center justify-center gap-2">
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
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
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