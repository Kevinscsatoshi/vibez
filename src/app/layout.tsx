import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { getAllProjects } from "@/lib/sample-data";
import { UiPreferencesProvider } from "@/components/providers/ui-preferences-provider";
import { FooterTagline } from "@/components/footer-tagline";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeZ — AI recipes for everyone",
  description:
    "Step-by-step recipes anyone can follow to create real things with AI. No experience needed.",
  openGraph: {
    title: "VibeZ — AI recipes for everyone",
    description:
      "Step-by-step recipes anyone can follow to create real things with AI. No experience needed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = getAllProjects();
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem("vibez.theme");
                  var theme = storedTheme === "dark" || storedTheme === "light"
                    ? storedTheme
                    : "dark";
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                  if (theme === "dark") document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hasVisited = sessionStorage.getItem("vibez.visited");
                  if (hasVisited) {
                    document.documentElement.dataset.bootReady = "1";
                  } else {
                    document.documentElement.dataset.bootReady = "0";
                    sessionStorage.setItem("vibez.visited", "1");
                    window.__bootTimeout = window.setTimeout(function() {
                      document.documentElement.dataset.bootReady = "1";
                    }, 4000);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div id="boot-loader" aria-hidden="true">
          <div className="app-loading-wordmark">
            <span>VibeZ</span>
            <span className="app-loading-caret" />
          </div>
        </div>
        <UiPreferencesProvider>
          <Header projects={projects} />
          <main className="flex-1">{children}</main>
          <footer className="py-6 text-center text-sm text-foreground/30">
            <FooterTagline />
          </footer>
        </UiPreferencesProvider>
      </body>
    </html>
  );
}
