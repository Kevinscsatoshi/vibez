"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const displayName = (formData.get("displayName") as string)?.trim();
  const avatarPresetId = formData.get("avatarPresetId") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const gender = formData.get("gender") as string;
  const persona = (formData.get("persona") as string | null)?.trim() || null;

  if (!displayName || displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      avatar_url: avatarUrl || "",
      avatar_source: "preset",
      avatar_preset_id: avatarPresetId || null,
      gender: gender || null,
      persona: persona,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error("Failed to save profile: " + error.message);
  }

  redirect("/");
}
