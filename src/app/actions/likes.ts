"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { isUuid } from "@/lib/is-uuid";

export async function toggleLike(projectId: string) {
  if (!isUuid(projectId)) {
    return { error: "invalid_project_id" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  // Check if already liked
  const { data: existing } = await supabase
    .from("project_likes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .single();

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from("project_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("project_id", projectId);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Single-like mode: unlike all previous likes, then like this project.
    const { error: clearError } = await supabase
      .from("project_likes")
      .delete()
      .eq("user_id", user.id);

    if (clearError) {
      return { error: clearError.message };
    }

    const { error } = await supabase
      .from("project_likes")
      .insert({ user_id: user.id, project_id: projectId });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/profile/${user.id}`);
  revalidatePath("/profile/me");
  revalidatePath(`/project/${projectId}`);
  return { liked: !existing };
}
