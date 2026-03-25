"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import type { Snippet } from "@/types/database";

type Tab = "html" | "css" | "js";

interface PlaygroundEditorProps {
  snippet?: Snippet | null;
  onSave?: (data: { title: string; html: string; css: string; js: string }) => Promise<void>;
  onFork?: () => Promise<void>;
  readOnly?: boolean;
  isAuthor?: boolean;
}

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, VibeZ!</h1>
  <p>Start building something amazing.</p>
  <button id="btn">Click me</button>
  <div id="output"></div>
</div>`;

const DEFAULT_CSS = `.container {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

button {
  background: #1a1a2e;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 1rem;
}

button:hover {
  opacity: 0.9;
}

#output {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
  min-height: 2rem;
}`;

const DEFAULT_JS = `const btn = document.getElementById('btn');
const output = document.getElementById('output');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  output.textContent = \`Clicked \${count} time\${count === 1 ? '' : 's'}!\`;
});`;

export function PlaygroundEditor({
  snippet,
  onSave,
  onFork,
  readOnly = false,
  isAuthor = false,
}: PlaygroundEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [html, setHtml] = useState(snippet?.html ?? DEFAULT_HTML);
  const [css, setCss] = useState(snippet?.css ?? DEFAULT_CSS);
  const [js, setJs] = useState(snippet?.js ?? DEFAULT_JS);
  const [title, setTitle] = useState(snippet?.title ?? "Untitled");
  const [saving, setSaving] = useState(false);
  const [forking, setForking] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildSrcDoc = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
  }, [html, css, js]);

  // Auto-update preview with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildSrcDoc();
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [html, css, js, buildSrcDoc]);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({ title, html, css, js });
    } finally {
      setSaving(false);
    }
  };

  const handleFork = async () => {
    if (!onFork) return;
    setForking(true);
    try {
      await onFork();
    } finally {
      setForking(false);
    }
  };

  const editorValue = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const editorLang = activeTab === "html" ? "html" : activeTab === "css" ? "css" : "javascript";

  const handleEditorChange = (value: string | undefined) => {
    const v = value ?? "";
    if (activeTab === "html") setHtml(v);
    else if (activeTab === "css") setCss(v);
    else setJs(v);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "js", label: "JS" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-surface shrink-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={readOnly && !isAuthor}
          className="bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-foreground/30 transition-colors max-w-[200px]"
          placeholder="Snippet title"
        />
        <div className="flex-1" />

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === tab.key
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {onFork && !isAuthor && (
          <button
            onClick={handleFork}
            disabled={forking}
            className="text-xs text-muted border border-border px-3 py-1 rounded hover:border-foreground/30 transition-colors disabled:opacity-60"
          >
            {forking ? "Forking..." : "Fork"}
          </button>
        )}
        {onSave && (isAuthor || !snippet) && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-foreground text-background px-3 py-1 rounded hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* Editor + Preview split */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Editor */}
        <div className="flex-1 min-h-0 border-b lg:border-b-0 lg:border-r border-border">
          <Editor
            height="100%"
            language={editorLang}
            value={editorValue}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              readOnly: readOnly && !isAuthor,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="bg-tag-bg px-3 py-1.5 text-xs font-medium text-muted border-b border-border shrink-0">
            Preview
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={buildSrcDoc()}
            sandbox="allow-scripts"
            className="flex-1 w-full bg-white"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
