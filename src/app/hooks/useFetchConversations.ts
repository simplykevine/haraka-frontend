// hooks/useConversations.ts
import { useState, useEffect, useCallback } from "react";
import { fetchConversationsWithRuns, createConversation as apiCreateConversation } from "../utils/fetchConversation";
import { Conversation } from "../utils/types/chat";

export function useConversations(userId?: number, token?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fix: Add early return if userId/token is undefined
  useEffect(() => {
    if (!userId || !token) return; // 👈 TypeScript now knows userId is number below
    
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchConversationsWithRuns(userId!, token!); // ✅ Now safe
        if (!cancelled) {
          setConversations(data);
          if (data.length > 0 && activeConversationId === null) {
            setActiveConversationId(data[0].conversation_id);
          }
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId, token]);

  const startNewConversation = useCallback(async (): Promise<number | null> => {
    // ✅ Fix: Check userId/token before using
    if (!userId || !token) {
      setError("User not authenticated");
      return null;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiCreateConversation(userId, token); // ✅ Now safe
      const newConv: Conversation = {
        conversation_id: data.conversation_id,
        title: data.title || `Chat ${new Date().toLocaleTimeString()}`,
        user: data.user,
        runs: [],
        created_at: new Date().toISOString(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.conversation_id);
      return newConv.conversation_id;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  const selectConversation = useCallback((id: number) => {
    setActiveConversationId(id);
  }, []);

  const activeRuns = conversations.find(c => c.conversation_id === activeConversationId)?.runs || [];

  return {
    conversations,
    activeConversationId,
    activeRuns,
    startNewConversation,
    selectConversation,
    loading,
    error,
    setConversations,
  };
}