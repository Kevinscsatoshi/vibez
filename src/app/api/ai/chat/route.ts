import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a helpful coding assistant inside the VibeZ Playground — a browser-based HTML/CSS/JS editor. Help users build, debug, and improve their web creations.

Rules:
- Keep answers concise and practical
- When providing code, give complete working snippets
- Focus on HTML, CSS, and JavaScript (vanilla, no frameworks)
- If the user shares their current code, suggest specific improvements
- Be encouraging and beginner-friendly`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function callAnthropic(messages: ChatMessage[], code: string) {
  const systemMsg = `${SYSTEM_PROMPT}\n\nThe user's current code:\n\`\`\`html\n${code}\n\`\`\``;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemMsg,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";
}

async function callOpenAI(messages: ChatMessage[], code: string) {
  const systemMsg = `${SYSTEM_PROMPT}\n\nThe user's current code:\n\`\`\`html\n${code}\n\`\`\``;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemMsg },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}

export async function POST(request: Request) {
  const hasAnthropic = Boolean(ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(OPENAI_API_KEY);

  if (!hasAnthropic && !hasOpenAI) {
    return NextResponse.json(
      { error: "no_api_key", message: "No AI API key configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env.local" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const code: string = body.code ?? "";

    if (messages.length === 0) {
      return NextResponse.json({ error: "empty_messages" }, { status: 400 });
    }

    let reply: string;
    let provider: string;

    if (hasAnthropic) {
      reply = await callAnthropic(messages, code);
      provider = "claude";
    } else {
      reply = await callOpenAI(messages, code);
      provider = "chatgpt";
    }

    return NextResponse.json({ reply, provider });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "ai_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
