import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { getAllProjects } from "@/lib/sample-data";

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
      <body className="min-h-full flex flex-col">
        <Header projects={projects} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          <p>vibeZ — Built for builders who ship with AI</p>
        </footer>
      </body>
    </html>
  );
}
