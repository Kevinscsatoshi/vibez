"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { Profile } from "@/types/database";

export function UserNav() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-border animate-pulse shrink-0" />
    );
  }

  if (!profile) {
    return (
      <Link
        href="/signin"
        className="font-bitcount shrink-0 bg-foreground text-background px-3 sm:px-4 py-1.5 text-xs sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap rounded-md"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile/me"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar_url || "https://api.dicebear.com/9.x/notionists/svg?seed=default&backgroundColor=b6e3f4"}
          alt={profile.display_name}
          className="h-8 w-8 rounded-full shrink-0"
        />
        <span className="font-bitcount text-sm hidden sm:inline truncate max-w-[120px]">
          {profile.display_name}
        </span>
      </Link>
      <button
        onClick={handleSignOut}
        className="font-bitcount text-xs text-muted hover:text-foreground transition-colors shrink-0"
      >
        Sign out
      </button>
    </div>
  );
}
