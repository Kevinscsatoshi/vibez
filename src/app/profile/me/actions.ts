"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { isUuid } from "@/lib/is-uuid";
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

export async function deletePublishedProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" as const };
  }
  if (!isUuid(projectId)) {
    return { error: "invalid_project_id" as const };
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("author_id", user.id)
    .maybeSingle();

  if (!project) {
    return { error: "not_found_or_forbidden" as const };
  }

  try {
    const admin = createAdminClient();

    const { data: files } = await admin
      .from("project_files")
      .select("path")
      .eq("project_id", projectId);

    const filePaths =
      (files ?? [])
        .map((row) => row.path)
        .filter((path): path is string => Boolean(path)) ?? [];

    if (filePaths.length > 0) {
      const { error: storageRemoveError } = await admin.storage
        .from("project-assets")
        .remove(filePaths);
      if (storageRemoveError) {
        return { error: `delete_assets_failed:${storageRemoveError.message}` as const };
      }
    }

    await admin.from("project_likes").delete().eq("project_id", projectId);
    await admin.from("project_sync_events").delete().eq("project_id", projectId);
    await admin.from("project_repo_links").delete().eq("project_id", projectId);
    await admin.from("project_files").delete().eq("project_id", projectId);

    const { error: deleteProjectError } = await admin
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("author_id", user.id);

    if (deleteProjectError) {
      return { error: `delete_project_failed:${deleteProjectError.message}` as const };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? (`delete_failed:${error.message}` as const)
          : ("delete_failed:unknown" as const),
    };
  }

  revalidatePath("/");
  revalidatePath("/profile/me");
  revalidatePath(`/profile/${user.id}`);
  revalidatePath(`/project/${projectId}`);

  return { ok: true as const };
}
