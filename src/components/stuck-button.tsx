"use client";

import { useState, useEffect } from "react";
import { Lifebuoy } from "@phosphor-icons/react";

interface StuckButtonProps {
  hasFailures: boolean;
}

export function StuckButton({ hasFailures }: StuckButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stepsSection = document.getElementById("recipe-steps");
    const troubleSection = document.getElementById("troubleshooting");
    if (!stepsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when steps section is in view or has been scrolled past
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(stepsSection);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const target = document.getElementById("troubleshooting");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      // Pulse animation on the section
      target.classList.add("ring-2", "ring-accent", "ring-offset-2");
      setTimeout(() => {
        target.classList.remove("ring-2", "ring-accent", "ring-offset-2");
      }, 2000);
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-lg hover:opacity-90 transition-all animate-in fade-in slide-in-from-bottom-4"
      title={hasFailures ? "See troubleshooting tips" : "Need help?"}
    >
      <Lifebuoy size={18} weight="fill" />
      <span className="text-sm font-medium">I&apos;m stuck</span>
    </button>
  );
}
