"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/profile/me");
  }

  const displayName = (formData.get("displayName") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;
  const githubUsername = (formData.get("githubUsername") as string)?.trim() || null;
  const avatarPresetId = formData.get("avatarPresetId") as string | null;
  const avatarUrl = formData.get("avatarUrl") as string | null;
  const gender = formData.get("gender") as string | null;

  if (!displayName || displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters");
  }

  const updates: Record<string, unknown> = {
    display_name: displayName,
    bio,
    github_username: githubUsername,
    github_url: githubUsername ? `https://github.com/${githubUsername}` : null,
  };

  if (avatarPresetId && avatarUrl) {
    updates.avatar_url = avatarUrl;
    updates.avatar_source = "preset";
    updates.avatar_preset_id = avatarPresetId;
    updates.gender = gender || null;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    throw new Error("Failed to update profile: " + error.message);
  }

  revalidatePath("/profile/me");
  revalidatePath(`/profile/${user.id}`);
}
