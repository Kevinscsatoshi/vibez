export const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type ThemeMode = "light" | "dark";

export type I18nKey =
  | "nav.browse"
  | "nav.create"
  | "nav.workspace"
  | "nav.playground"
  | "search.placeholder"
  | "search.noResults"
  | "search.viewAll"
  | "auth.signIn"
  | "auth.signOut"
  | "home.hero.title"
  | "home.hero.subtitle"
  | "home.hero.browseRecipes"
  | "home.hero.shareRecipe"
  | "home.popular"
  | "home.startHere"
  | "home.startHere.subtitle"
  | "home.browseByGoal"
  | "home.latest"
  | "home.whyVibez"
  | "footer.tagline"
  | "ui.language"
  | "ui.theme"
  | "ui.light"
  | "ui.dark"
  | "recipe.difficulty.beginner"
  | "recipe.difficulty.intermediate"
  | "recipe.difficulty.advanced"
  | "recipe.coding.none"
  | "recipe.coding.minimal"
  | "recipe.coding.moderate"
  | "recipe.coding.heavy"
  | "recipe.save"
  | "recipe.saved"
  | "recipe.remix"
  | "recipe.completed"
  | "recipe.buildersCompleted";

type Dictionary = Record<I18nKey, string>;

const en: Dictionary = {
  "nav.browse": "Browse",
  "nav.create": "Create",
  "nav.workspace": "Workspace",
  "nav.playground": "Playground",
  "search.placeholder": "Search recipes\u2026",
  "search.noResults": "No recipes found for \u201c{query}\u201d",
  "search.viewAll": "View all {count} results \u2192",
  "auth.signIn": "Sign in",
  "auth.signOut": "Sign out",
  "home.hero.title": "Build anything with AI.\nFollow the recipe.",
  "home.hero.subtitle": "Step-by-step recipes for building real products with AI tools. No coding experience required.",
  "home.hero.browseRecipes": "Browse Recipes",
  "home.hero.shareRecipe": "Share a Recipe",
  "home.popular": "Popular Right Now",
  "home.startHere": "New to AI building? Start here.",
  "home.startHere.subtitle": "Beginner-friendly recipes you can complete today",
  "home.browseByGoal": "Browse by what you want to build",
  "home.latest": "Latest Recipes",
  "home.whyVibez": "Why VibeZ?",
  "footer.tagline": "VibeZ \u2014 The recipe book for AI building",
  "ui.language": "Language",
  "ui.theme": "Theme",
  "ui.light": "Light",
  "ui.dark": "Dark",
  "recipe.difficulty.beginner": "Beginner",
  "recipe.difficulty.intermediate": "Intermediate",
  "recipe.difficulty.advanced": "Advanced",
  "recipe.coding.none": "No code",
  "recipe.coding.minimal": "Minimal code",
  "recipe.coding.moderate": "Some code",
  "recipe.coding.heavy": "Code-heavy",
  "recipe.save": "Save",
  "recipe.saved": "Saved",
  "recipe.remix": "Remix",
  "recipe.completed": "Completed",
  "recipe.buildersCompleted": "{count} builders completed this",
};

const zh: Dictionary = {
  "nav.browse": "\u6d4f\u89c8",
  "nav.create": "\u521b\u5efa",
  "nav.workspace": "\u5de5\u4f5c\u533a",
  "nav.playground": "\u6e38\u4e50\u573a",
  "search.placeholder": "\u641c\u7d22\u98df\u8c31\u2026",
  "search.noResults": "\u672a\u627e\u5230\u201c{query}\u201d\u76f8\u5173\u98df\u8c31",
  "search.viewAll": "\u67e5\u770b\u5168\u90e8 {count} \u6761\u7ed3\u679c \u2192",
  "auth.signIn": "\u767b\u5f55",
  "auth.signOut": "\u9000\u51fa",
  "home.hero.title": "\u7528 AI \u6784\u5efa\u4efb\u4f55\u4e1c\u897f\u3002\n\u8ddf\u7740\u98df\u8c31\u505a\u3002",
  "home.hero.subtitle": "\u4e00\u6b65\u6b65\u6559\u4f60\u7528 AI \u5de5\u5177\u6784\u5efa\u771f\u5b9e\u4ea7\u54c1\u3002\u65e0\u9700\u7f16\u7a0b\u7ecf\u9a8c\u3002",
  "home.hero.browseRecipes": "\u6d4f\u89c8\u98df\u8c31",
  "home.hero.shareRecipe": "\u5206\u4eab\u98df\u8c31",
  "home.popular": "\u5f53\u524d\u70ed\u95e8",
  "home.startHere": "\u65b0\u624b\uff1f\u4ece\u8fd9\u91cc\u5f00\u59cb",
  "home.startHere.subtitle": "\u9002\u5408\u521d\u5b66\u8005\u7684\u98df\u8c31",
  "home.browseByGoal": "\u6309\u76ee\u6807\u6d4f\u89c8",
  "home.latest": "\u6700\u65b0\u98df\u8c31",
  "home.whyVibez": "\u4e3a\u4ec0\u4e48\u9009 VibeZ\uff1f",
  "footer.tagline": "VibeZ \u2014 AI \u6784\u5efa\u7684\u98df\u8c31\u4e66",
  "ui.language": "\u8bed\u8a00",
  "ui.theme": "\u4e3b\u9898",
  "ui.light": "\u6d45\u8272",
  "ui.dark": "\u6df1\u8272",
  "recipe.difficulty.beginner": "\u521d\u7ea7",
  "recipe.difficulty.intermediate": "\u4e2d\u7ea7",
  "recipe.difficulty.advanced": "\u9ad8\u7ea7",
  "recipe.coding.none": "\u65e0\u9700\u7f16\u7a0b",
  "recipe.coding.minimal": "\u5c11\u91cf\u7f16\u7a0b",
  "recipe.coding.moderate": "\u90e8\u5206\u7f16\u7a0b",
  "recipe.coding.heavy": "\u5927\u91cf\u7f16\u7a0b",
  "recipe.save": "\u6536\u85cf",
  "recipe.saved": "\u5df2\u6536\u85cf",
  "recipe.remix": "\u6539\u7f16",
  "recipe.completed": "\u5df2\u5b8c\u6210",
  "recipe.buildersCompleted": "{count} \u4f4d\u6784\u5efa\u8005\u5df2\u5b8c\u6210",
};

const ja: Dictionary = {
  "nav.browse": "\u63a2\u7d22",
  "nav.create": "\u4f5c\u6210",
  "nav.workspace": "\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9",
  "nav.playground": "\u30d7\u30ec\u30a4\u30b0\u30e9\u30a6\u30f3\u30c9",
  "search.placeholder": "\u30ec\u30b7\u30d4\u3092\u691c\u7d22\u2026",
  "search.noResults": "\u300c{query}\u300d\u306e\u30ec\u30b7\u30d4\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f",
  "search.viewAll": "{count} \u4ef6\u306e\u7d50\u679c\u3092\u3059\u3079\u3066\u8868\u793a \u2192",
  "auth.signIn": "\u30b5\u30a4\u30f3\u30a4\u30f3",
  "auth.signOut": "\u30b5\u30a4\u30f3\u30a2\u30a6\u30c8",
  "home.hero.title": "AI\u3067\u4f55\u3067\u3082\u4f5c\u308d\u3046\u3002\n\u30ec\u30b7\u30d4\u306b\u5f93\u3046\u3060\u3051\u3002",
  "home.hero.subtitle": "AI\u30c4\u30fc\u30eb\u3067\u672c\u7269\u306e\u88fd\u54c1\u3092\u4f5c\u308b\u30b9\u30c6\u30c3\u30d7\u30d0\u30a4\u30b9\u30c6\u30c3\u30d7\u30ec\u30b7\u30d4\u3002\u30b3\u30fc\u30c7\u30a3\u30f3\u30b0\u7d4c\u9a13\u4e0d\u8981\u3002",
  "home.hero.browseRecipes": "\u30ec\u30b7\u30d4\u3092\u63a2\u3059",
  "home.hero.shareRecipe": "\u30ec\u30b7\u30d4\u3092\u5171\u6709",
  "home.popular": "\u4eba\u6c17\u306e\u30ec\u30b7\u30d4",
  "home.startHere": "AI\u69cb\u7bc9\u304c\u521d\u3081\u3066\uff1f\u3053\u3053\u304b\u3089",
  "home.startHere.subtitle": "\u4eca\u65e5\u5b8c\u6210\u3067\u304d\u308b\u521d\u5fc3\u8005\u5411\u3051\u30ec\u30b7\u30d4",
  "home.browseByGoal": "\u4f5c\u308a\u305f\u3044\u3082\u306e\u3067\u63a2\u3059",
  "home.latest": "\u6700\u65b0\u30ec\u30b7\u30d4",
  "home.whyVibez": "\u306a\u305c VibeZ\uff1f",
  "footer.tagline": "VibeZ \u2014 AI\u69cb\u7bc9\u306e\u30ec\u30b7\u30d4\u30d6\u30c3\u30af",
  "ui.language": "\u8a00\u8a9e",
  "ui.theme": "\u30c6\u30fc\u30de",
  "ui.light": "\u30e9\u30a4\u30c8",
  "ui.dark": "\u30c0\u30fc\u30af",
  "recipe.difficulty.beginner": "\u521d\u7d1a",
  "recipe.difficulty.intermediate": "\u4e2d\u7d1a",
  "recipe.difficulty.advanced": "\u4e0a\u7d1a",
  "recipe.coding.none": "\u30b3\u30fc\u30c9\u4e0d\u8981",
  "recipe.coding.minimal": "\u5c11\u3057\u306e\u30b3\u30fc\u30c9",
  "recipe.coding.moderate": "\u90e8\u5206\u7684\u306a\u30b3\u30fc\u30c9",
  "recipe.coding.heavy": "\u30b3\u30fc\u30c9\u91cd\u8996",
  "recipe.save": "\u4fdd\u5b58",
  "recipe.saved": "\u4fdd\u5b58\u6e08\u307f",
  "recipe.remix": "\u30ea\u30df\u30c3\u30af\u30b9",
  "recipe.completed": "\u5b8c\u4e86",
  "recipe.buildersCompleted": "{count}\u4eba\u304c\u5b8c\u4e86",
};

const ko: Dictionary = {
  "nav.browse": "\ud0d0\uc0c9",
  "nav.create": "\ub9cc\ub4e4\uae30",
  "nav.workspace": "\uc6cc\ud06c\uc2a4\ud398\uc774\uc2a4",
  "nav.playground": "\ud50c\ub808\uc774\uadf8\ub77c\uc6b4\ub4dc",
  "search.placeholder": "\ub808\uc2dc\ud53c \uac80\uc0c9\u2026",
  "search.noResults": "\u201c{query}\u201d\uc5d0 \ub300\ud55c \ub808\uc2dc\ud53c\uac00 \uc5c6\uc2b5\ub2c8\ub2e4",
  "search.viewAll": "\ucd1d {count}\uac1c \uacb0\uacfc \ubcf4\uae30 \u2192",
  "auth.signIn": "\ub85c\uadf8\uc778",
  "auth.signOut": "\ub85c\uadf8\uc544\uc6c3",
  "home.hero.title": "AI\ub85c \ubb50\ub4e0\uc9c0 \ub9cc\ub4e4\uc5b4 \ubcf4\uc138\uc694.\n\ub808\uc2dc\ud53c\ub97c \ub530\ub77c\ud558\uc138\uc694.",
  "home.hero.subtitle": "AI \ub3c4\uad6c\ub85c \uc2e4\uc81c \uc81c\ud488\uc744 \ub9cc\ub4dc\ub294 \ub2e8\uacc4\ubcc4 \ub808\uc2dc\ud53c. \ucf54\ub529 \uacbd\ud5d8 \ubd88\ud544\uc694.",
  "home.hero.browseRecipes": "\ub808\uc2dc\ud53c \ud0d0\uc0c9",
  "home.hero.shareRecipe": "\ub808\uc2dc\ud53c \uacf5\uc720",
  "home.popular": "\uc9c0\uae08 \uc778\uae30",
  "home.startHere": "AI \ube4c\ub4dc\uac00 \ucc98\uc74c\uc774\ub77c\uba74? \uc5ec\uae30\uc11c \uc2dc\uc791",
  "home.startHere.subtitle": "\uc624\ub298 \uc644\ub8cc\ud560 \uc218 \uc788\ub294 \ucd08\ubcf4\uc790 \ub808\uc2dc\ud53c",
  "home.browseByGoal": "\ub9cc\ub4e4\uace0 \uc2f6\uc740 \uac83\uc73c\ub85c \ud0d0\uc0c9",
  "home.latest": "\ucd5c\uc2e0 \ub808\uc2dc\ud53c",
  "home.whyVibez": "\uc65c VibeZ?",
  "footer.tagline": "VibeZ \u2014 AI \ube4c\ub4dc\uc758 \ub808\uc2dc\ud53c \ubd81",
  "ui.language": "\uc5b8\uc5b4",
  "ui.theme": "\ud14c\ub9c8",
  "ui.light": "\ub77c\uc774\ud2b8",
  "ui.dark": "\ub2e4\ud06c",
  "recipe.difficulty.beginner": "\ucd08\uae09",
  "recipe.difficulty.intermediate": "\uc911\uae09",
  "recipe.difficulty.advanced": "\uace0\uae09",
  "recipe.coding.none": "\ucf54\ub4dc \ubd88\ud544\uc694",
  "recipe.coding.minimal": "\ucd5c\uc18c \ucf54\ub4dc",
  "recipe.coding.moderate": "\uc57d\uac04\uc758 \ucf54\ub4dc",
  "recipe.coding.heavy": "\ucf54\ub4dc \uc911\uc2ec",
  "recipe.save": "\uc800\uc7a5",
  "recipe.saved": "\uc800\uc7a5\ub428",
  "recipe.remix": "\ub9ac\ubbf9\uc2a4",
  "recipe.completed": "\uc644\ub8cc",
  "recipe.buildersCompleted": "{count}\uba85 \uc644\ub8cc",
};

const es: Dictionary = {
  "nav.browse": "Explorar",
  "nav.create": "Crear",
  "nav.workspace": "Espacio",
  "nav.playground": "Playground",
  "search.placeholder": "Buscar recetas\u2026",
  "search.noResults": "No se encontraron recetas para \u201c{query}\u201d",
  "search.viewAll": "Ver los {count} resultados \u2192",
  "auth.signIn": "Iniciar sesi\u00f3n",
  "auth.signOut": "Cerrar sesi\u00f3n",
  "home.hero.title": "Construye lo que quieras con IA.\nSigue la receta.",
  "home.hero.subtitle": "Recetas paso a paso para crear productos reales con herramientas de IA. Sin experiencia en programaci\u00f3n.",
  "home.hero.browseRecipes": "Explorar recetas",
  "home.hero.shareRecipe": "Compartir receta",
  "home.popular": "Popular ahora",
  "home.startHere": "\u00bfNuevo en AI? Empieza aqu\u00ed.",
  "home.startHere.subtitle": "Recetas para principiantes que puedes completar hoy",
  "home.browseByGoal": "Explora por lo que quieres construir",
  "home.latest": "\u00daltimas recetas",
  "home.whyVibez": "\u00bfPor qu\u00e9 VibeZ?",
  "footer.tagline": "VibeZ \u2014 El libro de recetas para construir con IA",
  "ui.language": "Idioma",
  "ui.theme": "Tema",
  "ui.light": "Claro",
  "ui.dark": "Oscuro",
  "recipe.difficulty.beginner": "Principiante",
  "recipe.difficulty.intermediate": "Intermedio",
  "recipe.difficulty.advanced": "Avanzado",
  "recipe.coding.none": "Sin c\u00f3digo",
  "recipe.coding.minimal": "C\u00f3digo m\u00ednimo",
  "recipe.coding.moderate": "Algo de c\u00f3digo",
  "recipe.coding.heavy": "Mucho c\u00f3digo",
  "recipe.save": "Guardar",
  "recipe.saved": "Guardado",
  "recipe.remix": "Remix",
  "recipe.completed": "Completado",
  "recipe.buildersCompleted": "{count} constructores completaron esto",
};

const fr: Dictionary = {
  "nav.browse": "Explorer",
  "nav.create": "Cr\u00e9er",
  "nav.workspace": "Espace",
  "nav.playground": "Playground",
  "search.placeholder": "Rechercher des recettes\u2026",
  "search.noResults": "Aucune recette trouv\u00e9e pour \u00ab {query} \u00bb",
  "search.viewAll": "Voir les {count} r\u00e9sultats \u2192",
  "auth.signIn": "Se connecter",
  "auth.signOut": "Se d\u00e9connecter",
  "home.hero.title": "Construisez n\u2019importe quoi avec l\u2019IA.\nSuivez la recette.",
  "home.hero.subtitle": "Des recettes \u00e9tape par \u00e9tape pour cr\u00e9er de vrais produits avec des outils IA. Aucune exp\u00e9rience en code requise.",
  "home.hero.browseRecipes": "Explorer les recettes",
  "home.hero.shareRecipe": "Partager une recette",
  "home.popular": "Populaire en ce moment",
  "home.startHere": "Nouveau en IA ? Commencez ici.",
  "home.startHere.subtitle": "Recettes pour d\u00e9butants \u00e0 compl\u00e9ter aujourd\u2019hui",
  "home.browseByGoal": "Parcourir par objectif",
  "home.latest": "Derni\u00e8res recettes",
  "home.whyVibez": "Pourquoi VibeZ ?",
  "footer.tagline": "VibeZ \u2014 Le livre de recettes pour construire avec l\u2019IA",
  "ui.language": "Langue",
  "ui.theme": "Th\u00e8me",
  "ui.light": "Clair",
  "ui.dark": "Sombre",
  "recipe.difficulty.beginner": "D\u00e9butant",
  "recipe.difficulty.intermediate": "Interm\u00e9diaire",
  "recipe.difficulty.advanced": "Avanc\u00e9",
  "recipe.coding.none": "Sans code",
  "recipe.coding.minimal": "Code minimal",
  "recipe.coding.moderate": "Un peu de code",
  "recipe.coding.heavy": "Beaucoup de code",
  "recipe.save": "Sauvegarder",
  "recipe.saved": "Sauvegard\u00e9",
  "recipe.remix": "Remix",
  "recipe.completed": "Termin\u00e9",
  "recipe.buildersCompleted": "{count} constructeurs ont termin\u00e9",
};

const de: Dictionary = {
  "nav.browse": "Entdecken",
  "nav.create": "Erstellen",
  "nav.workspace": "Arbeitsbereich",
  "nav.playground": "Playground",
  "search.placeholder": "Rezepte suchen\u2026",
  "search.noResults": "Keine Rezepte f\u00fcr \u201e{query}\u201c gefunden",
  "search.viewAll": "Alle {count} Ergebnisse anzeigen \u2192",
  "auth.signIn": "Anmelden",
  "auth.signOut": "Abmelden",
  "home.hero.title": "Baue alles mit KI.\nFolge dem Rezept.",
  "home.hero.subtitle": "Schritt-f\u00fcr-Schritt-Rezepte zum Erstellen realer Produkte mit KI-Tools. Keine Programmiererfahrung erforderlich.",
  "home.hero.browseRecipes": "Rezepte entdecken",
  "home.hero.shareRecipe": "Rezept teilen",
  "home.popular": "Gerade beliebt",
  "home.startHere": "Neu bei KI? Hier starten.",
  "home.startHere.subtitle": "Anf\u00e4ngerfreundliche Rezepte f\u00fcr heute",
  "home.browseByGoal": "Nach Ziel durchsuchen",
  "home.latest": "Neueste Rezepte",
  "home.whyVibez": "Warum VibeZ?",
  "footer.tagline": "VibeZ \u2014 Das Rezeptbuch f\u00fcr KI-Projekte",
  "ui.language": "Sprache",
  "ui.theme": "Thema",
  "ui.light": "Hell",
  "ui.dark": "Dunkel",
  "recipe.difficulty.beginner": "Anf\u00e4nger",
  "recipe.difficulty.intermediate": "Fortgeschritten",
  "recipe.difficulty.advanced": "Experte",
  "recipe.coding.none": "Kein Code",
  "recipe.coding.minimal": "Minimaler Code",
  "recipe.coding.moderate": "Etwas Code",
  "recipe.coding.heavy": "Viel Code",
  "recipe.save": "Speichern",
  "recipe.saved": "Gespeichert",
  "recipe.remix": "Remix",
  "recipe.completed": "Abgeschlossen",
  "recipe.buildersCompleted": "{count} Builder abgeschlossen",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zh: "\u4e2d\u6587",
  ja: "\u65e5\u672c\u8a9e",
  ko: "\ud55c\uad6d\uc5b4",
  es: "Espa\u00f1ol",
  fr: "Fran\u00e7ais",
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
