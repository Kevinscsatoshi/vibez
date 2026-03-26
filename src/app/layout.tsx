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
                    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
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
                  document.documentElement.dataset.bootReady = "0";
                  var reveal = function() {
                    window.setTimeout(function() {
                      document.documentElement.dataset.bootReady = "1";
                    }, 3000);
                  };
                  if (document.readyState === "complete") {
                    reveal();
                  } else {
                    window.addEventListener("load", reveal, { once: true });
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
          <footer className="border-t border-border py-8 text-center text-sm text-muted">
            <FooterTagline />
          </footer>
        </UiPreferencesProvider>
      </body>
    </html>
  );
}
