import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are TaxBridge AI, an expert tax assistant specializing in cross-border taxation for freelance creators, digital nomads, and independent professionals in Southeast Asia (Indonesia, Singapore, Malaysia, Thailand, Vietnam, Philippines).

Your expertise:
- Income tax for freelancers across multiple jurisdictions
- GST/VAT rules (especially Singapore GST, Indonesia VAT, Thailand VAT)
- Tax residency rules for digital nomads
- Withholding tax on international payments
- Filing deadlines, quarterly estimates, and tax treaties
- Currency conversion for tax purposes

Style: concise, practical, friendly. Use plain English. When a number depends on user data you don't have, give a clear example and explain the rule. Always note that you provide guidance, not legal advice, when discussing specific filings. Keep answers under 180 words unless the user asks for more detail.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: { messages?: ChatMessage[]; context?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const userMessages = Array.isArray(body.messages) ? body.messages : [];
        if (userMessages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const systemContent = body.context
          ? `${SYSTEM_PROMPT}\n\nUser context: ${body.context}`
          : SYSTEM_PROMPT;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            stream: true,
            messages: [{ role: "system", content: systemContent }, ...userMessages].slice(-20),
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const errText = await upstream.text().catch(() => "");
          return new Response(
            JSON.stringify({
              error:
                upstream.status === 429
                  ? "AI is busy. Please try again in a moment."
                  : upstream.status === 402
                  ? "AI credits exhausted. Add credits in workspace settings."
                  : errText || "AI gateway error",
            }),
            { status: upstream.status, headers: { "Content-Type": "application/json" } },
          );
        }

        // Pipe SSE through, transforming OpenAI-format chunks into plain text tokens
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        const reader = upstream.body.getReader();

        const stream = new ReadableStream({
          async start(controller) {
            let buffer = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith("data:")) continue;
                  const payload = trimmed.slice(5).trim();
                  if (!payload || payload === "[DONE]") continue;
                  try {
                    const json = JSON.parse(payload);
                    const delta = json?.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta.length > 0) {
                      controller.enqueue(encoder.encode(delta));
                    }
                  } catch {
                    // skip malformed chunk
                  }
                }
              }
            } catch (err) {
              controller.error(err);
              return;
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
