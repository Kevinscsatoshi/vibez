"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function toggleSave(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_authenticated" };

  // Check if already saved
  const { data: existing } = await supabase
    .from("recipe_saves")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .single();

  if (existing) {
    // Unsave
    await supabase
      .from("recipe_saves")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);
  } else {
    // Save (no single-save restriction!)
    await supabase.from("recipe_saves").insert({
      user_id: user.id,
      recipe_id: recipeId,
    });
  }

  revalidatePath("/");
  revalidatePath("/workspace");
  revalidatePath(`/project/${recipeId}`);
  revalidatePath(`/profile/${user.id}`);

  return { saved: !existing };
}
