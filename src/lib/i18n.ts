export const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type ThemeMode = "light" | "dark";

export type I18nKey =
  | "nav.discover"
  | "nav.publish"
  | "nav.playground"
  | "search.placeholder"
  | "search.noResults"
  | "search.viewAll"
  | "auth.signIn"
  | "auth.signOut"
  | "home.featured"
  | "home.trending"
  | "home.latest"
  | "footer.tagline"
  | "ui.language"
  | "ui.theme"
  | "ui.light"
  | "ui.dark";

type Dictionary = Record<I18nKey, string>;

const en: Dictionary = {
  "nav.discover": "Discover",
  "nav.publish": "Publish",
  "nav.playground": "Playground",
  "search.placeholder": "Search…",
  "search.noResults": "No projects found for “{query}”",
  "search.viewAll": "View all {count} results →",
  "auth.signIn": "Sign in",
  "auth.signOut": "Sign out",
  "home.featured": "Featured Projects",
  "home.trending": "Trending",
  "home.latest": "Latest Builds",
  "footer.tagline": "vibeZ — Built for builders who ship with AI",
  "ui.language": "Language",
  "ui.theme": "Theme",
  "ui.light": "Light",
  "ui.dark": "Dark",
};

const zh: Dictionary = {
  "nav.discover": "发现",
  "nav.publish": "发布",
  "nav.playground": "游乐场",
  "search.placeholder": "搜索…",
  "search.noResults": "未找到“{query}”相关项目",
  "search.viewAll": "查看全部 {count} 条结果 →",
  "auth.signIn": "登录",
  "auth.signOut": "退出",
  "home.featured": "精选项目",
  "home.trending": "热门趋势",
  "home.latest": "最新构建",
  "footer.tagline": "vibeZ — 为真正交付 AI 产品的创作者而建",
  "ui.language": "语言",
  "ui.theme": "主题",
  "ui.light": "浅色",
  "ui.dark": "深色",
};

const ja: Dictionary = {
  "nav.discover": "発見",
  "nav.publish": "公開",
  "nav.playground": "プレイグラウンド",
  "search.placeholder": "検索…",
  "search.noResults": "「{query}」のプロジェクトは見つかりませんでした",
  "search.viewAll": "{count} 件の結果をすべて表示 →",
  "auth.signIn": "サインイン",
  "auth.signOut": "サインアウト",
  "home.featured": "注目プロジェクト",
  "home.trending": "トレンド",
  "home.latest": "最新ビルド",
  "footer.tagline": "vibeZ — AI を使って出荷するビルダーのために",
  "ui.language": "言語",
  "ui.theme": "テーマ",
  "ui.light": "ライト",
  "ui.dark": "ダーク",
};

const ko: Dictionary = {
  "nav.discover": "탐색",
  "nav.publish": "게시",
  "nav.playground": "플레이그라운드",
  "search.placeholder": "검색…",
  "search.noResults": "“{query}”에 대한 프로젝트가 없습니다",
  "search.viewAll": "총 {count}개 결과 보기 →",
  "auth.signIn": "로그인",
  "auth.signOut": "로그아웃",
  "home.featured": "추천 프로젝트",
  "home.trending": "트렌딩",
  "home.latest": "최신 빌드",
  "footer.tagline": "vibeZ — AI로 실제 제품을 만드는 빌더를 위한 네트워크",
  "ui.language": "언어",
  "ui.theme": "테마",
  "ui.light": "라이트",
  "ui.dark": "다크",
};

const es: Dictionary = {
  "nav.discover": "Descubrir",
  "nav.publish": "Publicar",
  "nav.playground": "Playground",
  "search.placeholder": "Buscar…",
  "search.noResults": "No se encontraron proyectos para “{query}”",
  "search.viewAll": "Ver los {count} resultados →",
  "auth.signIn": "Iniciar sesión",
  "auth.signOut": "Cerrar sesión",
  "home.featured": "Proyectos destacados",
  "home.trending": "Tendencias",
  "home.latest": "Últimos builds",
  "footer.tagline": "vibeZ — Creado para builders que lanzan con IA",
  "ui.language": "Idioma",
  "ui.theme": "Tema",
  "ui.light": "Claro",
  "ui.dark": "Oscuro",
};

const fr: Dictionary = {
  "nav.discover": "Découvrir",
  "nav.publish": "Publier",
  "nav.playground": "Playground",
  "search.placeholder": "Rechercher…",
  "search.noResults": "Aucun projet trouvé pour « {query} »",
  "search.viewAll": "Voir les {count} résultats →",
  "auth.signIn": "Se connecter",
  "auth.signOut": "Se déconnecter",
  "home.featured": "Projets à la une",
  "home.trending": "Tendance",
  "home.latest": "Derniers builds",
  "footer.tagline": "vibeZ — Conçu pour les builders qui livrent avec l'IA",
  "ui.language": "Langue",
  "ui.theme": "Thème",
  "ui.light": "Clair",
  "ui.dark": "Sombre",
};

const de: Dictionary = {
  "nav.discover": "Entdecken",
  "nav.publish": "Veröffentlichen",
  "nav.playground": "Playground",
  "search.placeholder": "Suchen…",
  "search.noResults": "Keine Projekte für „{query}“ gefunden",
  "search.viewAll": "Alle {count} Ergebnisse anzeigen →",
  "auth.signIn": "Anmelden",
  "auth.signOut": "Abmelden",
  "home.featured": "Empfohlene Projekte",
  "home.trending": "Trending",
  "home.latest": "Neueste Builds",
  "footer.tagline": "vibeZ — Für Builder, die mit KI wirklich shippen",
  "ui.language": "Sprache",
  "ui.theme": "Thema",
  "ui.light": "Hell",
  "ui.dark": "Dunkel",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

const dictionaries: Record<Language, Dictionary> = { en, zh, ja, ko, es, fr, de };

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function translate(
  lang: Language,
  key: I18nKey,
  vars?: Record<string, string | number>
): string {
  const dict = dictionaries[lang] ?? en;
  const template = dict[key] ?? en[key];
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
    template
  );
}
