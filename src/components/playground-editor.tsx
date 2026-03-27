"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { ArrowsOutSimple, ArrowsInSimple, Terminal, X, ChatCircle, PaperPlaneRight, Robot } from "@phosphor-icons/react";
import type { Snippet } from "@/types/database";

type Tab = "html" | "css" | "js";

interface ConsoleEntry {
  level: "log" | "warn" | "error" | "info";
  args: string;
  id: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface PlaygroundEditorProps {
  snippet?: Snippet | null;
  onSave?: (data: { title: string; html: string; css: string; js: string }) => Promise<void>;
  onFork?: () => Promise<void>;
  readOnly?: boolean;
  isAuthor?: boolean;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
}

const DEFAULT_HTML = `<canvas id="canvas"></canvas>
<div class="overlay">
  <h1>VibeZ Playground</h1>
  <p>Move your mouse to create particles</p>
  <div class="controls">
    <button id="color-btn">Change Color</button>
    <button id="gravity-btn">Toggle Gravity</button>
    <button id="clear-btn">Clear</button>
  </div>
  <div id="stats"></div>
</div>`;

const DEFAULT_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  overflow: hidden;
  background: #0a0a1a;
  font-family: system-ui, -apple-system, sans-serif;
}

canvas {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
}

.overlay {
  position: fixed;
  top: 0; left: 0; right: 0;
  padding: 1.5rem;
  text-align: center;
  pointer-events: none;
  z-index: 10;
}

h1 {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}

p {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.controls {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  pointer-events: auto;
}

button {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.4rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.75rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

button:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
}

#stats {
  color: rgba(255,255,255,0.4);
  font-size: 0.65rem;
  margin-top: 0.5rem;
  font-family: monospace;
}`;

const DEFAULT_JS = `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const MAX_PARTICLES = 150;
const palettes = [
  ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff'],
  ['#00f5d4','#00bbf9','#9b5de5','#f15bb5','#fee440'],
  ['#ef476f','#ffd166','#06d6a0','#118ab2','#073b4c'],
];
let paletteIdx = 0;
let colors = palettes[0];
let particles = [];
let gravity = false;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.008;
    this.size = Math.random() * 3 + 1.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    if (gravity) this.vy += 0.06;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.vx *= 0.98;
    this.vy *= 0.98;
  }
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
  }
}

function addParticles(x, y, count) {
  const room = MAX_PARTICLES - particles.length;
  const n = Math.min(count, room);
  for (let i = 0; i < n; i++) particles.push(new Particle(x, y));
}

canvas.addEventListener('mousemove', (e) => {
  addParticles(e.clientX, e.clientY, 2);
});

canvas.addEventListener('click', (e) => {
  addParticles(e.clientX, e.clientY, 20);
});

document.getElementById('color-btn').onclick = () => {
  paletteIdx = (paletteIdx + 1) % palettes.length;
  colors = palettes[paletteIdx];
  console.log('Palette changed to:', colors);
};

document.getElementById('gravity-btn').onclick = () => {
  gravity = !gravity;
  console.log('Gravity:', gravity ? 'ON' : 'OFF');
};

document.getElementById('clear-btn').onclick = () => {
  particles = [];
  console.log('Cleared all particles');
};

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function animate() {
  ctx.fillStyle = 'rgba(10, 10, 26, 0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  ctx.globalAlpha = 1;
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  ctx.globalAlpha = 1;
  document.getElementById('stats').textContent =
    'particles: ' + particles.length;
  requestAnimationFrame(animate);
}

animate();
console.log('Particle playground ready! Move your mouse.');`;

// Script injected into iframe to capture console output
const CONSOLE_CAPTURE_SCRIPT = `
<script>
(function() {
  var orig = { log: console.log, warn: console.warn, error: console.error, info: console.info };
  function send(level, args) {
    try {
      var str = Array.from(args).map(function(a) {
        if (typeof a === 'object') { try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); } }
        return String(a);
      }).join(' ');
      window.parent.postMessage({ type: '__vibez_console__', level: level, args: str }, '*');
    } catch(e) {}
    orig[level].apply(console, args);
  }
  console.log = function() { send('log', arguments); };
  console.warn = function() { send('warn', arguments); };
  console.error = function() { send('error', arguments); };
  console.info = function() { send('info', arguments); };
  window.onerror = function(msg, src, line, col) {
    send('error', [msg + ' (line ' + line + ')']);
  };
})();
<\/script>`;

export function PlaygroundEditor({
  snippet,
  onSave,
  onFork,
  readOnly = false,
  isAuthor = false,
  initialHtml,
  initialCss,
  initialJs,
}: PlaygroundEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [html, setHtml] = useState(initialHtml ?? snippet?.html ?? DEFAULT_HTML);
  const [css, setCss] = useState(initialCss ?? snippet?.css ?? DEFAULT_CSS);
  const [js, setJs] = useState(initialJs ?? snippet?.js ?? DEFAULT_JS);
  const [title, setTitle] = useState(snippet?.title ?? "Untitled");
  const [saving, setSaving] = useState(false);
  const [forking, setForking] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatProvider, setChatProvider] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const consoleIdRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fullIframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildSrcDoc = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
${html}
${CONSOLE_CAPTURE_SCRIPT}
<script>${js}<\/script>
</body>
</html>`;
  }, [html, css, js]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "__vibez_console__") {
        setConsoleEntries((prev) => [
          ...prev.slice(-200), // keep last 200 entries
          { level: e.data.level, args: e.data.args, id: ++consoleIdRef.current },
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Auto-update preview with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const doc = buildSrcDoc();
      if (iframeRef.current) iframeRef.current.srcdoc = doc;
      if (fullIframeRef.current) fullIframeRef.current.srcdoc = doc;
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

  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    setChatError(null);
    const userMsg: ChatMessage = { role: "user", content: msg };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatLoading(true);
    try {
      const currentCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, code: currentCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChatError(data.message || data.error || "Request failed");
        return;
      }
      if (data.provider) setChatProvider(data.provider);
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Network error");
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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

  const CONSOLE_LEVEL_COLORS: Record<string, string> = {
    log: "text-[#d4d4d4]",
    info: "text-blue-400",
    warn: "text-yellow-400",
    error: "text-red-400",
  };

  return (
    <>
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

          {/* Console toggle */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1.5 rounded transition-colors ${showConsole ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
            title="Toggle Console"
          >
            <Terminal size={16} weight="bold" />
          </button>

          {/* AI Chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-1.5 rounded transition-colors ${showChat ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}
            title="AI Assistant"
          >
            <ChatCircle size={16} weight="bold" />
          </button>

          {/* Fullscreen preview toggle */}
          <button
            onClick={() => setFullPreview(true)}
            className="p-1.5 rounded text-muted hover:text-foreground transition-colors"
            title="Fullscreen Preview"
          >
            <ArrowsOutSimple size={16} weight="bold" />
          </button>

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

        {/* Editor + Preview + Chat split */}
        <div className="flex flex-row flex-1 min-h-0">
          {/* Editor + Preview column */}
          <div className={`flex flex-col lg:flex-row min-h-0 min-w-0 ${showChat ? "flex-[3]" : "flex-1"}`}>
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

          {/* Preview + Console */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="bg-tag-bg px-3 py-1.5 text-xs font-medium text-muted border-b border-border shrink-0 flex items-center justify-between">
              <span>Preview</span>
              {consoleEntries.length > 0 && !showConsole && (
                <button
                  onClick={() => setShowConsole(true)}
                  className="text-[10px] text-muted hover:text-foreground"
                >
                  {consoleEntries.length} log{consoleEntries.length !== 1 ? "s" : ""}
                </button>
              )}
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={buildSrcDoc()}
              sandbox="allow-scripts"
              className={`w-full bg-white ${showConsole ? "flex-[3]" : "flex-1"}`}
              title="Preview"
            />

            {/* Console Panel */}
            {showConsole && (
              <div className="flex-1 min-h-0 flex flex-col border-t border-border bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-3 py-1 border-b border-[#333] shrink-0">
                  <span className="text-[10px] font-medium text-[#888] uppercase tracking-wider">Console</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConsoleEntries([])}
                      className="text-[10px] text-[#888] hover:text-[#ccc] transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowConsole(false)}
                      className="text-[#888] hover:text-[#ccc] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5">
                  {consoleEntries.length === 0 ? (
                    <p className="text-[#555] italic">Console output will appear here...</p>
                  ) : (
                    consoleEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`px-2 py-0.5 rounded ${
                          entry.level === "error" ? "bg-red-500/10" : entry.level === "warn" ? "bg-yellow-500/10" : ""
                        } ${CONSOLE_LEVEL_COLORS[entry.level] ?? "text-[#d4d4d4]"}`}
                      >
                        <span className="text-[#555] mr-2">{entry.level === "log" ? ">" : entry.level === "warn" ? "!" : entry.level === "error" ? "x" : "i"}</span>
                        {entry.args}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* AI Chat Panel */}
          {showChat && (
            <div className="flex-1 min-w-0 max-w-sm flex flex-col border-l border-border bg-surface">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
                <div className="flex items-center gap-1.5">
                  <Robot size={14} className="text-accent" />
                  <span className="text-xs font-medium">AI Assistant</span>
                  {chatProvider && (
                    <span className="text-[10px] text-muted bg-tag-bg px-1.5 py-0.5 rounded-full">
                      {chatProvider}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Robot size={32} className="mx-auto text-muted mb-2" />
                    <p className="text-sm text-muted font-medium">Hi! I can help you code.</p>
                    <p className="text-xs text-muted mt-1">Ask me to explain, debug, or improve your code.</p>
                    <div className="mt-3 space-y-1.5">
                      {["Add a dark mode toggle", "Make it responsive", "Add animations"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => { setChatInput(suggestion); }}
                          className="block w-full text-left text-xs border border-border rounded-lg px-3 py-2 hover:bg-tag-bg transition-colors text-muted"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-tag-bg text-foreground border border-border"
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-tag-bg border border-border rounded-xl px-3 py-2 text-xs text-muted">
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                      </span>
                    </div>
                  </div>
                )}
                {chatError && (
                  <div className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
                    {chatError}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                    placeholder="Ask AI for help..."
                    className="flex-1 bg-transparent text-sm px-2 py-1.5 focus:outline-none placeholder:text-muted"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-1.5 rounded text-accent hover:bg-accent/10 transition-colors disabled:opacity-40"
                    title="Send"
                  >
                    <PaperPlaneRight size={16} weight="fill" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen preview overlay */}
      {fullPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f0f0] dark:bg-[#2a2a2a] border-b border-border shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-muted font-mono truncate text-center">
                vibez://preview/{title.toLowerCase().replace(/\s+/g, "-")}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (fullIframeRef.current) {
                    const doc = fullIframeRef.current.srcdoc;
                    fullIframeRef.current.srcdoc = "";
                    requestAnimationFrame(() => {
                      if (fullIframeRef.current) fullIframeRef.current.srcdoc = doc;
                    });
                  }
                }}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Refresh"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-muted">
                  <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => setFullPreview(false)}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Exit fullscreen"
              >
                <ArrowsInSimple size={14} className="text-muted" />
              </button>
            </div>
          </div>
          <iframe
            ref={fullIframeRef}
            srcDoc={buildSrcDoc()}
            sandbox="allow-scripts"
            className="flex-1 w-full bg-white"
            title="Fullscreen Preview"
          />
        </div>
      )}
    </>
  );
}
