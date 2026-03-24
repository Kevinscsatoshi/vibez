"use client";

import { useState } from "react";
import { AvatarGender, getAvatarsByGender, PresetAvatar } from "@/lib/avatars";

interface AvatarPickerProps {
  onSelect: (avatar: PresetAvatar) => void;
  selected?: string;
}

export function AvatarPicker({ onSelect, selected }: AvatarPickerProps) {
  const [gender, setGender] = useState<AvatarGender | null>(null);
  const avatars = gender ? getAvatarsByGender(gender) : [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Choose your avatar style
      </p>

      {/* Gender selection */}
      <div className="flex gap-3">
        <button
          onClick={() => setGender("male")}
          className={`flex-1 border py-2.5 text-sm font-medium rounded-xl transition-colors ${
            gender === "male"
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground/30"
          }`}
        >
          Male
        </button>
        <button
          onClick={() => setGender("female")}
          className={`flex-1 border py-2.5 text-sm font-medium rounded-xl transition-colors ${
            gender === "female"
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground/30"
          }`}
        >
          Female
        </button>
      </div>

      {/* Avatar grid */}
      {gender && (
        <div className="grid grid-cols-5 gap-3">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onSelect(avatar)}
              className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all ${
                selected === avatar.id
                  ? "border-foreground scale-105 shadow-sm"
                  : "border-border hover:border-foreground/30 hover:scale-105"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar.url}
                alt={avatar.label}
                className="w-full h-full object-cover"
              />
              {selected === avatar.id && (
                <div className="absolute inset-0 bg-foreground/10 flex items-end justify-center pb-1">
                  <span className="text-[10px] font-medium bg-foreground text-background px-1.5 py-0.5 rounded-full">
                    Selected
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
