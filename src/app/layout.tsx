import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { getAllProjects } from "@/lib/sample-data";
import { UiPreferencesProvider } from "@/components/providers/ui-preferences-provider";
import { FooterTagline } from "@/components/footer-tagline";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vibeZ — The Builder Network for AI Builders",
  description:
    "See what AI builders are actually shipping. Prompts, stacks, metrics, and the full build story.",
  openGraph: {
    title: "vibeZ — The Builder Network for AI Builders",
    description:
      "See what AI builders are actually shipping. Prompts, stacks, metrics, and the full build story.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      </head>
      <body className="min-h-full flex flex-col">
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
