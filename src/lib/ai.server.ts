const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type GatewayMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callGateway(messages: GatewayMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app (missing API key).");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? text;
    } catch {
      /* keep raw text */
    }
    if (res.status === 429) {
      throw new Error("The AI is receiving too many requests right now. Please try again shortly.");
    }
    if (res.status === 402) {
      throw new Error(message || "AI credits are exhausted. Please add credits to continue.");
    }
    if (res.status === 403) {
      throw new Error(message || "AI access is currently blocked for this workspace.");
    }
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The AI returned an empty response. Please try again.");
  return content;
}

export function styleGuidance(opts: {
  responseLength?: string;
  writingStyle?: string;
}): string {
  const length =
    opts.responseLength === "short"
      ? "Keep the output concise and tight."
      : opts.responseLength === "long"
        ? "Provide a thorough, detailed output."
        : "Keep the output balanced in length.";
  const style = opts.writingStyle
    ? `Writing style preference: ${opts.writingStyle}.`
    : "";
  return `${length} ${style}`.trim();
}
