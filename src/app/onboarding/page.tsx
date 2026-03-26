"use client";

import { useState } from "react";
import { AvatarPicker } from "@/components/avatar-picker";
import { PresetAvatar } from "@/lib/avatars";
import { completeOnboarding } from "./actions";

export default function OnboardingPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<PresetAvatar | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [persona, setPersona] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const personas = [
    { id: "founder", label: "I want to build a product or business" },
    { id: "marketer", label: "I create content or do marketing" },
    { id: "student", label: "I'm learning about AI" },
    { id: "developer", label: "I'm a developer trying new tools" },
    { id: "explorer", label: "I'm just looking around" },
  ];

  const canContinue = selectedAvatar && displayName.trim().length >= 2;

  const handleSubmit = async () => {
    if (!canContinue || !selectedAvatar) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("displayName", displayName.trim());
    formData.set("avatarPresetId", selectedAvatar.id);
    formData.set("avatarUrl", selectedAvatar.url);
    formData.set("gender", selectedAvatar.gender);
    if (persona) formData.set("persona", persona);

    try {
      await completeOnboarding(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to VibeZ!</h1>
        <p className="mt-2 text-sm text-muted">
          Let&apos;s get you set up. Pick an avatar and a name.
        </p>
      </div>

      {/* Display name */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-muted mb-1.5">
          Display name
        </label>
        <input
          className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          maxLength={50}
        />
      </div>

      {/* Avatar picker */}
      <div className="mb-8">
        <label className="block text-xs font-medium text-muted mb-3">
          Avatar
        </label>
        <AvatarPicker
          onSelect={setSelectedAvatar}
          selected={selectedAvatar?.id}
        />
      </div>

      {/* Persona selection */}
      <div className="mb-8">
        <label className="block text-xs font-medium text-muted mb-3">
          What brings you here?
        </label>
        <div className="flex flex-col gap-2">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPersona(p.id)}
              className={`text-left px-4 py-3 text-sm rounded-xl border transition-colors ${
                persona === p.id
                  ? "border-foreground bg-foreground/5 font-medium"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {selectedAvatar && displayName && (
        <div className="mb-6 border border-border rounded-2xl p-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedAvatar.url}
            alt="Your avatar"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <div className="font-medium text-sm">{displayName}</div>
            <div className="text-xs text-muted">on VibeZ</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mb-4 text-xs text-center text-red-600 bg-red-50 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {/* Continue button */}
      <button
        disabled={!canContinue || loading}
        onClick={handleSubmit}
        className={`w-full py-3 text-sm font-medium rounded-full transition-opacity ${
          canContinue && !loading
            ? "bg-foreground text-background hover:opacity-90"
            : "bg-border text-muted cursor-not-allowed"
        }`}
      >
        {loading ? "Saving..." : "Get started"}
      </button>

      <p className="mt-3 text-xs text-muted text-center">
        You can change your avatar later in your profile settings.
      </p>
    </div>
  );
}
