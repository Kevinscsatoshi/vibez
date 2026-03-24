"use client";

import { useState } from "react";
import { AvatarPicker } from "@/components/avatar-picker";
import { getAvatarById, PresetAvatar } from "@/lib/avatars";
import { updateProfile } from "./actions";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const existingAvatar = profile.avatar_preset_id
    ? getAvatarById(profile.avatar_preset_id) ?? null
    : null;

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || "");
  const [githubUsername, setGithubUsername] = useState(
    profile.github_username || ""
  );
  const [selectedAvatar, setSelectedAvatar] = useState<PresetAvatar | null>(
    existingAvatar
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("displayName", displayName);
    formData.set("bio", bio);
    formData.set("githubUsername", githubUsername);
    if (selectedAvatar) {
      formData.set("avatarPresetId", selectedAvatar.id);
      formData.set("avatarUrl", selectedAvatar.url);
      formData.set("gender", selectedAvatar.gender);
    }

    try {
      await updateProfile(formData);
      setMessage("Profile updated!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display name */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Display name
        </label>
        <input
          className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          maxLength={50}
          required
          minLength={2}
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Bio
        </label>
        <textarea
          className="w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl resize-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          maxLength={300}
        />
      </div>

      {/* GitHub username */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          GitHub username (optional)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">@</span>
          <input
            className="flex-1 border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="username"
            maxLength={39}
          />
        </div>
      </div>

      {/* Avatar */}
      <div>
        <label className="block text-xs font-medium text-muted mb-3">
          Avatar
        </label>
        <AvatarPicker
          onSelect={setSelectedAvatar}
          selected={selectedAvatar?.id}
        />
      </div>

      {/* Preview */}
      {(selectedAvatar || profile.avatar_url) && displayName && (
        <div className="border border-border rounded-2xl p-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedAvatar?.url || profile.avatar_url}
            alt="Your avatar"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <div className="font-medium text-sm">{displayName}</div>
            {bio && (
              <div className="text-xs text-muted mt-0.5 line-clamp-1">
                {bio}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <p className="text-xs text-center text-muted bg-tag-bg px-3 py-2 rounded-xl">
          {message}
        </p>
      )}
      {error && (
        <p className="text-xs text-center text-red-600 bg-red-50 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || displayName.trim().length < 2}
        className={`w-full py-3 text-sm font-medium rounded-full transition-opacity ${
          !loading && displayName.trim().length >= 2
            ? "bg-foreground text-background hover:opacity-90"
            : "bg-border text-muted cursor-not-allowed"
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
