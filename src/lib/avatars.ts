// Preset avatar library: 20 avatars (10 per gender)
// Uses DiceBear API for consistent, stylish generated avatars
// Users who don't have a GitHub avatar pick a gender, then choose from 10 options

export type AvatarGender = "male" | "female";

export interface PresetAvatar {
  id: string;
  gender: AvatarGender;
  url: string;
  label: string;
}

// Male avatars using "notionists" style with distinct seeds
const maleAvatars: PresetAvatar[] = [
  { id: "m1", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Liam&backgroundColor=b6e3f4", label: "Liam" },
  { id: "m2", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Noah&backgroundColor=c0aede", label: "Noah" },
  { id: "m3", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Oliver&backgroundColor=d1d4f9", label: "Oliver" },
  { id: "m4", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=James&backgroundColor=ffd5dc", label: "James" },
  { id: "m5", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Lucas&backgroundColor=ffdfbf", label: "Lucas" },
  { id: "m6", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Mason&backgroundColor=b6e3f4", label: "Mason" },
  { id: "m7", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Ethan&backgroundColor=c0aede", label: "Ethan" },
  { id: "m8", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Alexander&backgroundColor=d1d4f9", label: "Alexander" },
  { id: "m9", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Daniel&backgroundColor=ffd5dc", label: "Daniel" },
  { id: "m10", gender: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Henry&backgroundColor=ffdfbf", label: "Henry" },
];

// Female avatars using "notionists" style with distinct seeds
const femaleAvatars: PresetAvatar[] = [
  { id: "f1", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Emma&backgroundColor=ffd5dc", label: "Emma" },
  { id: "f2", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Sophia&backgroundColor=c0aede", label: "Sophia" },
  { id: "f3", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Ava&backgroundColor=b6e3f4", label: "Ava" },
  { id: "f4", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Isabella&backgroundColor=d1d4f9", label: "Isabella" },
  { id: "f5", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Mia&backgroundColor=ffdfbf", label: "Mia" },
  { id: "f6", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Charlotte&backgroundColor=ffd5dc", label: "Charlotte" },
  { id: "f7", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Amelia&backgroundColor=c0aede", label: "Amelia" },
  { id: "f8", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Harper&backgroundColor=b6e3f4", label: "Harper" },
  { id: "f9", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Evelyn&backgroundColor=d1d4f9", label: "Evelyn" },
  { id: "f10", gender: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Luna&backgroundColor=ffdfbf", label: "Luna" },
];

export const allAvatars = [...maleAvatars, ...femaleAvatars];

export function getAvatarsByGender(gender: AvatarGender): PresetAvatar[] {
  return gender === "male" ? maleAvatars : femaleAvatars;
}

export function getAvatarById(id: string): PresetAvatar | undefined {
  return allAvatars.find((a) => a.id === id);
}

export function getDefaultAvatar(gender: AvatarGender): PresetAvatar {
  return gender === "male" ? maleAvatars[0] : femaleAvatars[0];
}
