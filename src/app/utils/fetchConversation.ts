// utils/fetchConversation.ts
import { Conversation } from "./types/chat";

export async function fetchConversationsWithRuns(userId: number, token: string): Promise<Conversation[]> {
  // ✅ Add runtime check
  if (!userId || !token) {
    throw new Error("userId and token are required");
  }
  
  const res = await fetch(`/api/conversations/with_runs/?user_id=${userId}`, {
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to fetch conversations");
  }
  return await res.json();
}

export async function createConversation(userId: number, token: string) {
  // ✅ Add runtime check
  if (!userId || !token) {
    throw new Error("userId and token are required");
  }
  
  const res = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify({ user: userId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to create conversation");
  }
  return await res.json();
}