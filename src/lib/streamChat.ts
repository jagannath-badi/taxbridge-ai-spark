export type ChatRole = "user" | "assistant" | "system";
export type ChatMsg = { role: ChatRole; content: string };

export async function streamChat(opts: {
  messages: ChatMsg[];
  context?: string;
  signal?: AbortSignal;
  onToken: (token: string) => void;
}): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: opts.messages, context: opts.context }),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    let msg = `AI error (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) opts.onToken(chunk);
  }
}
