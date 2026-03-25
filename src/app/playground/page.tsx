import { Metadata } from "next";
import { PlaygroundClient } from "./playground-client";

export const metadata: Metadata = {
  title: "Playground — VibeZ",
  description: "Build and share HTML/CSS/JS snippets in the browser",
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
