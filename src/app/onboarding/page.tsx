"use client";

import { useState } from "react";
import { AvatarPicker } from "@/components/avatar-picker";
import { PresetAvatar } from "@/lib/avatars";

export default function OnboardingPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<PresetAvatar | null>(null);
  const [displayName, setDisplayName] = useState("");

  const canContinue = selectedAvatar && displayName.trim().length >= 2;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to vibeZ</h1>
        <p className="mt-2 text-sm text-muted">
          Set up your builder profile. Choose an avatar and display name.
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
            <div className="text-xs text-muted">Builder on vibeZ</div>
          </div>
        </div>
      )}

      {/* Continue button */}
      <button
        disabled={!canContinue}
        className={`w-full py-3 text-sm font-medium rounded-full transition-opacity ${
          canContinue
            ? "bg-foreground text-background hover:opacity-90"
            : "bg-border text-muted cursor-not-allowed"
        }`}
      >
        Complete Setup
      </button>

      <p className="mt-3 text-xs text-muted text-center">
        You can change your avatar later in your profile settings.
      </p>
    </div>
  );
}
