import { useEffect, useRef, useState } from "react";
import { createRun, fetchRunById } from "../utils/fetchPostRuns";
import { RunLike, RunFile } from "../utils/types/chat";

export function useRuns(
  conversationId: number | null,
  user?: { id: number; token: string },
  onRunUpdate?: (updatedRun: RunLike) => void
) {
  const [runs, setRuns] = useState<RunLike[]>([]);
  const pollingRef = useRef<Map<number, number>>(new Map());
  const lastConversationId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      pollingRef.current.forEach(clearInterval);
      pollingRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (conversationId !== lastConversationId.current) {
      lastConversationId.current = conversationId;
      pollingRef.current.forEach(clearInterval);
      pollingRef.current.clear();
    }
  }, [conversationId]);

  const normalizeRun = (run: Partial<RunLike>): RunLike => ({
    id: run.id || String(Date.now()),
    user_input: run.user_input || "",
    status: (run.status || "pending").toLowerCase(),
    final_output: run.final_output === undefined ? null : run.final_output,
    output_artifacts: Array.isArray(run.output_artifacts) ? run.output_artifacts : [],
    started_at: run.started_at || new Date().toISOString(),
    error: run.error,
  });

  async function sendMessage({
    userInput,
    files = [],
    filePreviews,
  }: {
    userInput: string;
    files?: File[];
    filePreviews?: RunFile[];
  }): Promise<RunLike> {
    if (!user?.token) throw new Error("Not authenticated");

    const tempId = "temp-" + Date.now();
    const optimisticFiles = filePreviews || files.map((file) => ({ file, previewUrl: "" }));
    const displayInput = files.length > 0 ? files.map((file) => file.name).join(", ") : userInput;

    const optimisticRun: RunLike = {
      id: tempId,
      user_input: displayInput,
      status: "pending",
      final_output: null,
      output_artifacts: [],
      started_at: new Date().toISOString(),
      _optimistic: true,
      files: optimisticFiles,
    };

    setRuns((prev) => [...prev, optimisticRun]);

    try {
      const incomingRun = await createRun(
        conversationId?.toString() || null,
        userInput,
        user.token,
        files
      );

      const normalized = normalizeRun(incomingRun);

      setRuns((prevRuns) =>
        prevRuns.map((run) => {
          if (run.id === tempId) {
            return { ...normalized, files: run.files };
          }
          return run;
        })
      );

      onRunUpdate?.(normalized);

      const runId = Number(incomingRun.id);
      if (runId > 0) startPolling(runId);

      return normalized;
    } catch (err) {
      const message = (err as { message?: string }).message || String(err);
      setRuns((prevRuns) =>
        prevRuns.map((run) => {
          if (run.id === tempId) {
            return { ...run, status: "failed", error: message };
          }
          return run;
        })
      );
      throw err;
    }
  }

  const startPolling = (runId: number) => {
    if (pollingRef.current.has(runId)) return;

    const intervalId = window.setInterval(async () => {
      try {
        const updated = normalizeRun(await fetchRunById(runId, user?.token));

        setRuns((prevRuns) =>
          prevRuns.map((run) => {
            if (Number(run.id) === runId) {
              return { ...run, ...updated, files: run.files };
            }
            return run;
          })
        );

        onRunUpdate?.(updated);

        if (updated.status === "completed" || updated.status === "failed") {
          clearInterval(intervalId);
          pollingRef.current.delete(runId);
        }
      } catch {
        clearInterval(intervalId);
        pollingRef.current.delete(runId);
      }
    }, 2000);

    pollingRef.current.set(runId, intervalId);
  };

  const clearRuns = () => {
    setRuns([]);
    pollingRef.current.forEach(clearInterval);
    pollingRef.current.clear();
  };

  return { runs, sendMessage, clearRuns, setRuns };
}