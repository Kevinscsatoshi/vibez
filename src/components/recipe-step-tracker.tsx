"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Confetti } from "@phosphor-icons/react";
import { CopyButton } from "./copy-button";
import { HighlightText } from "./highlight-text";
import type { RecipeStep } from "@/types/database";

interface RecipeStepTrackerProps {
  steps: RecipeStep[];
  recipeId: string;
  estimatedTime?: string | null;
}

function getStorageKey(recipeId: string) {
  return `vibez_step_progress_${recipeId}`;
}

function parseEstimatedMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  // Handle formats like "30 min", "1 hour", "1-2 hours", "~45 min"
  const cleaned = time.replace(/[~≈]/g, "").trim().toLowerCase();
  const hourMatch = cleaned.match(/(\d+)(?:\s*-\s*\d+)?\s*hours?/);
  const minMatch = cleaned.match(/(\d+)(?:\s*-\s*\d+)?\s*min/);
  if (hourMatch) return parseInt(hourMatch[1]) * 60;
  if (minMatch) return parseInt(minMatch[1]);
  return null;
}

export function RecipeStepTracker({ steps, recipeId, estimatedTime }: RecipeStepTrackerProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(recipeId));
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, [recipeId]);

  const toggleStep = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) {
        next.delete(stepIndex);
      } else {
        next.add(stepIndex);
      }
      try {
        localStorage.setItem(getStorageKey(recipeId), JSON.stringify([...next]));
      } catch {}
      // Check if all completed
      if (next.size === steps.length && !prev.has(stepIndex)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      return next;
    });
  }, [recipeId, steps.length]);

  const completedCount = completedSteps.size;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  // Time remaining estimate
  const totalMinutes = parseEstimatedMinutes(estimatedTime);
  const remainingSteps = totalSteps - completedCount;
  const remainingMinutes = totalMinutes && totalSteps > 0
    ? Math.round((totalMinutes / totalSteps) * remainingSteps)
    : null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{completedCount} of {totalSteps} steps completed</span>
          {remainingMinutes !== null && remainingSteps > 0 && (
            <span>~{remainingMinutes} min remaining</span>
          )}
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Celebration banner */}
      {showCelebration && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
          <Confetti size={20} weight="fill" className="text-green-600" />
          <span className="font-medium">All steps completed! You did it!</span>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          return (
            <div
              key={i}
              className={`border rounded-xl p-4 transition-colors ${
                isCompleted ? "border-success/30 bg-success/5" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                {/* Clickable checkbox */}
                <button
                  onClick={() => toggleStep(i)}
                  className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-success text-white"
                      : "bg-foreground text-background hover:bg-success hover:text-white"
                  }`}
                  title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  {isCompleted ? (
                    <Check size={12} weight="bold" />
                  ) : (
                    <span className="text-xs font-bold">{step.order || i + 1}</span>
                  )}
                </button>
                <h4 className={`font-medium text-sm pt-0.5 ${isCompleted ? "line-through text-muted" : ""}`}>
                  {step.title}
                </h4>
              </div>
              {step.description && (
                <p className={`text-sm leading-relaxed ml-9 mb-2 ${isCompleted ? "text-muted/60" : "text-muted"}`}>
                  <HighlightText text={step.description} />
                </p>
              )}
              {step.prompt && (
                <div className="ml-9 mb-2">
                  <p className="text-xs text-muted mb-1">Prompt to use:</p>
                  <div className="bg-[#1e1e1e] text-[#d4d4d4] p-3 text-xs font-mono leading-relaxed whitespace-pre-wrap rounded-lg relative group/prompt">
                    {step.prompt}
                    <div className="absolute top-2 right-2 opacity-0 group-hover/prompt:opacity-100 transition-opacity">
                      <CopyButton text={step.prompt} className="text-[#d4d4d4]/60 hover:text-[#d4d4d4]" size={14} />
                    </div>
                  </div>
                </div>
              )}
              {step.expected_result && (
                <div className="ml-9 text-xs text-muted">
                  <span className="text-success font-medium">Expected result:</span>{" "}
                  {step.expected_result}
                </div>
              )}
              {step.tip && (
                <div className="ml-9 mt-1 text-xs text-muted italic">
                  Tip: {step.tip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
