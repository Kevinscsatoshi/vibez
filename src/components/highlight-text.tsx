import React from "react";

// Keywords to auto-detect and bold
const KEYWORDS = [
  // Tech / AI tools & frameworks
  "Claude", "GPT-4", "GPT-4o", "ChatGPT", "OpenAI", "Anthropic", "LLM", "NLP", "RAG",
  "Next\\.js", "React", "Node\\.js", "Supabase", "Vercel", "Tailwind CSS", "TypeScript",
  "JavaScript", "Python", "Stripe", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Firebase",
  // Protocols & patterns
  "API", "SDK", "CLI", "OAuth", "JWT", "REST", "GraphQL", "WebSocket", "SSR", "SSG",
  // Business terms
  "MVP", "SaaS", "B2B", "B2C", "open-source", "open source",
  // File formats
  "PDF", "JSON", "CSV", "HTML", "CSS", "SQL", "SVG", "Markdown",
];

// Impact verbs
const IMPACT_VERBS = [
  "shipped", "launched", "deployed", "automated", "scaled",
  "reduced", "increased", "improved", "built", "created",
  "generated", "optimized",
];

function buildRegex(): RegExp {
  // Exact keyword matches (longer first to avoid partial matches)
  const sortedKeywords = [...KEYWORDS].sort((a, b) => b.length - a.length);
  const keywordPattern = sortedKeywords.map((k) => `\\b${k}\\b`).join("|");

  // Impact verbs
  const verbPattern = IMPACT_VERBS.map((v) => `\\b${v}\\b`).join("|");

  // Metrics pattern: number + unit (e.g., "2,400 users", "3x retention", "10 seconds")
  const metricsPattern = `\\b\\d[\\d,]*(?:\\.\\d+)?(?:x|%|\\+)?\\s*(?:users?|stars?|downloads?|revenue|MRR|ARR|DAU|MAU|forks?|retention|conversion|improvement|seconds?|minutes?|hours?|days?|pages?|requests?)\\b`;

  // Standalone percentages/multipliers (e.g., "85%", "3x", "100+")
  const numberPattern = `\\b\\d{2,}[\\d,]*(?:\\+|%|x)\\b`;

  return new RegExp(
    `(${keywordPattern}|${verbPattern}|${metricsPattern}|${numberPattern})`,
    "gi"
  );
}

const HIGHLIGHT_REGEX = buildRegex();

function highlightText(text: string): React.ReactNode[] {
  if (!text) return [text];

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  // Use matchAll for clean, non-duplicating iteration
  const matches = text.matchAll(new RegExp(HIGHLIGHT_REGEX.source, "gi"));

  for (const match of matches) {
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;

    // Add text before match
    if (matchStart > lastIndex) {
      result.push(
        <span key={`t-${lastIndex}`}>{text.slice(lastIndex, matchStart)}</span>
      );
    }

    // Add highlighted match
    result.push(
      <span key={`h-${matchStart}`} className="font-semibold text-foreground">
        {match[0]}
      </span>
    );

    lastIndex = matchEnd;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return result.length > 0 ? result : [<span key="full">{text}</span>];
}

export function HighlightText({ text }: { text: string }) {
  return <>{highlightText(text)}</>;
}
