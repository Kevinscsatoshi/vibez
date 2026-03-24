"use client";

import { useUiPreferences } from "@/components/providers/ui-preferences-provider";

export function FooterTagline() {
  const { t } = useUiPreferences();
  return <p>{t("footer.tagline")}</p>;
}
