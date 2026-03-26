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
  | "home.persona.prefix"
  | "home.persona.business"
  | "home.persona.marketing"
  | "home.persona.learning"
  | "home.persona.developer"
  | "home.persona.exploring"
  | "home.valueProp1.title"
  | "home.valueProp1.desc"
  | "home.valueProp2.title"
  | "home.valueProp2.desc"
  | "home.valueProp3.title"
  | "home.valueProp3.desc"
  | "home.cta.prompt"
  | "home.cta.button"
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
  "home.hero.title": "Your first AI project starts here.\nJust follow the recipe.",
  "home.hero.subtitle": "Step-by-step recipes anyone can follow to create real things with AI. No experience needed.",
  "home.hero.browseRecipes": "Browse Recipes",
  "home.hero.shareRecipe": "Share Your Recipe",
  "home.popular": "Popular Right Now",
  "home.startHere": "Never used AI before? Start here.",
  "home.startHere.subtitle": "Friendly recipes you can finish in one sitting",
  "home.browseByGoal": "What do you want to create?",
  "home.latest": "Latest Recipes",
  "home.whyVibez": "How it works",
  "home.persona.prefix": "I\u2019m interested in:",
  "home.persona.business": "Building a business",
  "home.persona.marketing": "Marketing & content",
  "home.persona.learning": "Learning AI",
  "home.persona.developer": "Developer tools",
  "home.persona.exploring": "Just looking around",
  "home.valueProp1.title": "Step by step",
  "home.valueProp1.desc": "No guesswork. Each recipe walks you through exactly what to do, one step at a time.",
  "home.valueProp2.title": "Learn from others",
  "home.valueProp2.desc": "See how others did it \u2014 what tripped them up and how they solved it.",
  "home.valueProp3.title": "Make it your own",
  "home.valueProp3.desc": "Take any recipe, swap the tools, tweak the prompts, and share your version.",
  "home.cta.prompt": "Tried something cool with AI? Tell us how you did it.",
  "home.cta.button": "Share Your Recipe",
  "footer.tagline": "VibeZ \u2014 AI recipes for everyone",
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
  "recipe.buildersCompleted": "{count} people tried this",
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
  "home.hero.title": "\u4f60\u7684\u7b2c\u4e00\u4e2a AI \u9879\u76ee\u4ece\u8fd9\u91cc\u5f00\u59cb\u3002\n\u8ddf\u7740\u98df\u8c31\u505a\u5c31\u597d\u3002",
  "home.hero.subtitle": "\u4efb\u4f55\u4eba\u90fd\u80fd\u8ddf\u7740\u505a\u7684 AI \u98df\u8c31\uff0c\u4e00\u6b65\u4e00\u6b65\u521b\u9020\u771f\u5b9e\u4f5c\u54c1\u3002\u65e0\u9700\u4efb\u4f55\u7ecf\u9a8c\u3002",
  "home.hero.browseRecipes": "\u6d4f\u89c8\u98df\u8c31",
  "home.hero.shareRecipe": "\u5206\u4eab\u4f60\u7684\u98df\u8c31",
  "home.popular": "\u5f53\u524d\u70ed\u95e8",
  "home.startHere": "\u4ece\u6ca1\u7528\u8fc7 AI\uff1f\u4ece\u8fd9\u91cc\u5f00\u59cb\u3002",
  "home.startHere.subtitle": "\u4e00\u6b21\u5c31\u80fd\u5b8c\u6210\u7684\u53cb\u597d\u98df\u8c31",
  "home.browseByGoal": "\u4f60\u60f3\u521b\u9020\u4ec0\u4e48\uff1f",
  "home.latest": "\u6700\u65b0\u98df\u8c31",
  "home.whyVibez": "\u5982\u4f55\u4f7f\u7528",
  "home.persona.prefix": "\u6211\u5bf9\u8fd9\u4e9b\u611f\u5174\u8da3\uff1a",
  "home.persona.business": "\u521b\u5efa\u4e1a\u52a1",
  "home.persona.marketing": "\u8425\u9500\u4e0e\u5185\u5bb9",
  "home.persona.learning": "\u5b66\u4e60 AI",
  "home.persona.developer": "\u5f00\u53d1\u8005\u5de5\u5177",
  "home.persona.exploring": "\u968f\u4fbf\u770b\u770b",
  "home.valueProp1.title": "\u4e00\u6b65\u4e00\u6b65",
  "home.valueProp1.desc": "\u65e0\u9700\u731c\u6d4b\u3002\u6bcf\u4e2a\u98df\u8c31\u90fd\u4f1a\u4e00\u6b65\u4e00\u6b65\u544a\u8bc9\u4f60\u8be5\u505a\u4ec0\u4e48\u3002",
  "home.valueProp2.title": "\u5411\u4ed6\u4eba\u5b66\u4e60",
  "home.valueProp2.desc": "\u770b\u770b\u522b\u4eba\u662f\u600e\u4e48\u505a\u7684\u2014\u2014\u4ed6\u4eec\u9047\u5230\u4e86\u4ec0\u4e48\u95ee\u9898\uff0c\u53c8\u662f\u5982\u4f55\u89e3\u51b3\u7684\u3002",
  "home.valueProp3.title": "\u53d8\u6210\u4f60\u81ea\u5df1\u7684",
  "home.valueProp3.desc": "\u62ff\u8d70\u4efb\u4f55\u98df\u8c31\uff0c\u6362\u6362\u5de5\u5177\uff0c\u6539\u6539\u63d0\u793a\u8bcd\uff0c\u5206\u4eab\u4f60\u7684\u7248\u672c\u3002",
  "home.cta.prompt": "\u7528 AI \u505a\u4e86\u4ec0\u4e48\u6709\u8da3\u7684\u4e8b\uff1f\u544a\u8bc9\u6211\u4eec\u4f60\u662f\u600e\u4e48\u505a\u7684\u3002",
  "home.cta.button": "\u5206\u4eab\u4f60\u7684\u98df\u8c31",
  "footer.tagline": "VibeZ \u2014 \u4eba\u4eba\u90fd\u80fd\u7528\u7684 AI \u98df\u8c31",
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
  "recipe.buildersCompleted": "{count} \u4eba\u5c1d\u8bd5\u8fc7",
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
  "home.hero.title": "\u306f\u3058\u3081\u3066\u306e AI \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306f\u3053\u3053\u304b\u3089\u3002\n\u30ec\u30b7\u30d4\u306b\u5f93\u3046\u3060\u3051\u3002",
  "home.hero.subtitle": "\u8ab0\u3067\u3082\u3067\u304d\u308b AI \u30ec\u30b7\u30d4\u3002\u30b9\u30c6\u30c3\u30d7\u3054\u3068\u306b\u672c\u7269\u3092\u4f5c\u308d\u3046\u3002\u7d4c\u9a13\u4e0d\u8981\u3002",
  "home.hero.browseRecipes": "\u30ec\u30b7\u30d4\u3092\u63a2\u3059",
  "home.hero.shareRecipe": "\u30ec\u30b7\u30d4\u3092\u5171\u6709\u3059\u308b",
  "home.popular": "\u4eba\u6c17\u306e\u30ec\u30b7\u30d4",
  "home.startHere": "AI \u304c\u521d\u3081\u3066\uff1f\u3053\u3053\u304b\u3089\u59cb\u3081\u3088\u3046\u3002",
  "home.startHere.subtitle": "\u4e00\u5ea6\u3067\u5b8c\u6210\u3067\u304d\u308b\u3084\u3055\u3057\u3044\u30ec\u30b7\u30d4",
  "home.browseByGoal": "\u4f55\u3092\u4f5c\u308a\u305f\u3044\uff1f",
  "home.latest": "\u6700\u65b0\u30ec\u30b7\u30d4",
  "home.whyVibez": "\u4f7f\u3044\u65b9",
  "home.persona.prefix": "\u8208\u5473\u304c\u3042\u308b\u306e\u306f\uff1a",
  "home.persona.business": "\u30d3\u30b8\u30cd\u30b9\u3092\u4f5c\u308b",
  "home.persona.marketing": "\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0\u30fb\u30b3\u30f3\u30c6\u30f3\u30c4",
  "home.persona.learning": "AI \u3092\u5b66\u3076",
  "home.persona.developer": "\u958b\u767a\u8005\u30c4\u30fc\u30eb",
  "home.persona.exploring": "\u3061\u3087\u3063\u3068\u898b\u3066\u308b\u3060\u3051",
  "home.valueProp1.title": "\u30b9\u30c6\u30c3\u30d7\u30d0\u30a4\u30b9\u30c6\u30c3\u30d7",
  "home.valueProp1.desc": "\u8ff7\u308f\u305a\u9032\u3081\u308b\u3002\u5404\u30ec\u30b7\u30d4\u304c\u4e00\u6b69\u305a\u3064\u3084\u308b\u3079\u304d\u3053\u3068\u3092\u6559\u3048\u3066\u304f\u308c\u307e\u3059\u3002",
  "home.valueProp2.title": "\u307f\u3093\u306a\u304b\u3089\u5b66\u3076",
  "home.valueProp2.desc": "\u4ed6\u306e\u4eba\u306e\u4f53\u9a13\u3092\u898b\u3066\u307f\u3088\u3046\u2014\u2014\u3064\u307e\u305a\u3044\u305f\u70b9\u3068\u89e3\u6c7a\u65b9\u6cd5\u3002",
  "home.valueProp3.title": "\u81ea\u5206\u6d41\u306b\u30a2\u30ec\u30f3\u30b8",
  "home.valueProp3.desc": "\u30ec\u30b7\u30d4\u3092\u53d6\u3063\u3066\u3001\u30c4\u30fc\u30eb\u3092\u5909\u3048\u3066\u3001\u30d7\u30ed\u30f3\u30d7\u30c8\u3092\u8abf\u6574\u3057\u3066\u3001\u3042\u306a\u305f\u306e\u30d0\u30fc\u30b8\u30e7\u30f3\u3092\u5171\u6709\u3057\u3088\u3046\u3002",
  "home.cta.prompt": "AI \u3067\u9762\u767d\u3044\u3082\u306e\u3092\u4f5c\u3063\u305f\uff1f\u3069\u3046\u3084\u3063\u305f\u304b\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002",
  "home.cta.button": "\u30ec\u30b7\u30d4\u3092\u5171\u6709\u3059\u308b",
  "footer.tagline": "VibeZ \u2014 \u307f\u3093\u306a\u306e\u305f\u3081\u306e AI \u30ec\u30b7\u30d4",
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
  "recipe.buildersCompleted": "{count}\u4eba\u304c\u8a66\u3057\u307e\u3057\u305f",
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
  "home.hero.title": "\uccab \ubc88\uc9f8 AI \ud504\ub85c\uc81d\ud2b8\ub97c \uc2dc\uc791\ud558\uc138\uc694.\n\ub808\uc2dc\ud53c\ub97c \ub530\ub77c\ud558\uae30\ub9cc \ud558\uba74 \ub3fc\uc694.",
  "home.hero.subtitle": "\ub204\uad6c\ub098 \ub530\ub77c\ud560 \uc218 \uc788\ub294 AI \ub808\uc2dc\ud53c\ub85c \uc9c4\uc9dc \uc791\ud488\uc744 \ub9cc\ub4e4\uc5b4 \ubcf4\uc138\uc694. \uacbd\ud5d8 \ubd88\ud544\uc694.",
  "home.hero.browseRecipes": "\ub808\uc2dc\ud53c \ud0d0\uc0c9",
  "home.hero.shareRecipe": "\ub808\uc2dc\ud53c \uacf5\uc720\ud558\uae30",
  "home.popular": "\uc9c0\uae08 \uc778\uae30",
  "home.startHere": "AI\uac00 \ucc98\uc74c\uc774\ub77c\uba74? \uc5ec\uae30\uc11c \uc2dc\uc791\ud558\uc138\uc694.",
  "home.startHere.subtitle": "\ud55c \ubc88\uc5d0 \ub05d\ub0bc \uc218 \uc788\ub294 \uce5c\uc808\ud55c \ub808\uc2dc\ud53c",
  "home.browseByGoal": "\ubb34\uc5c7\uc744 \ub9cc\ub4e4\uace0 \uc2f6\uc73c\uc138\uc694?",
  "home.latest": "\ucd5c\uc2e0 \ub808\uc2dc\ud53c",
  "home.whyVibez": "\uc774\uc6a9 \ubc29\ubc95",
  "home.persona.prefix": "\uad00\uc2ec \uc788\ub294 \ubd84\uc57c:",
  "home.persona.business": "\ube44\uc988\ub2c8\uc2a4 \ub9cc\ub4e4\uae30",
  "home.persona.marketing": "\ub9c8\ucf00\ud305 & \ucf58\ud150\uce20",
  "home.persona.learning": "AI \ubc30\uc6b0\uae30",
  "home.persona.developer": "\uac1c\ubc1c\uc790 \ub3c4\uad6c",
  "home.persona.exploring": "\uadf8\ub0e5 \ub458\ub7ec\ubcf4\ub294 \uc911",
  "home.valueProp1.title": "\ub2e8\uacc4\ubcc4\ub85c",
  "home.valueProp1.desc": "\ucd94\uce21\ud560 \ud544\uc694 \uc5c6\uc774, \uac01 \ub808\uc2dc\ud53c\uac00 \ud55c \ub2e8\uacc4\uc529 \uc548\ub0b4\ud574 \uc904\uac8c\uc694.",
  "home.valueProp2.title": "\ub2e4\ub978 \uc0ac\ub78c\ub4e4\ud55c\ud14c \ubc30\uc6b0\uae30",
  "home.valueProp2.desc": "\ub2e4\ub978 \uc0ac\ub78c\ub4e4\uc774 \uc5b4\ub5bb\uac8c \ud588\ub294\uc9c0 \u2014 \uc5b4\ub514\uc11c \ub9c9\ud614\uace0 \uc5b4\ub5bb\uac8c \ud574\uacb0\ud588\ub294\uc9c0 \ubcf4\uc138\uc694.",
  "home.valueProp3.title": "\ub098\ub9cc\uc758 \ubc84\uc804\uc73c\ub85c",
  "home.valueProp3.desc": "\ub808\uc2dc\ud53c\ub97c \uac00\uc838\uc640\uc11c \ub3c4\uad6c\ub97c \ubc14\uafb8\uace0, \ud504\ub86c\ud504\ud2b8\ub97c \uc218\uc815\ud558\uace0, \ub098\ub9cc\uc758 \ubc84\uc804\uc744 \uacf5\uc720\ud558\uc138\uc694.",
  "home.cta.prompt": "AI\ub85c \uba4b\uc9c4 \uac78 \ub9cc\ub4e4\uc5c8\ub098\uc694? \uc5b4\ub5bb\uac8c \ud588\ub294\uc9c0 \uc54c\ub824\uc8fc\uc138\uc694.",
  "home.cta.button": "\ub808\uc2dc\ud53c \uacf5\uc720\ud558\uae30",
  "footer.tagline": "VibeZ \u2014 \ubaa8\ub450\ub97c \uc704\ud55c AI \ub808\uc2dc\ud53c",
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
  "recipe.buildersCompleted": "{count}\uba85\uc774 \uc2dc\ub3c4\ud588\uc5b4\uc694",
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
  "home.hero.title": "Tu primer proyecto con IA empieza aqu\u00ed.\nSolo sigue la receta.",
  "home.hero.subtitle": "Recetas paso a paso que cualquiera puede seguir para crear cosas reales con IA. Sin experiencia necesaria.",
  "home.hero.browseRecipes": "Explorar recetas",
  "home.hero.shareRecipe": "Comparte tu receta",
  "home.popular": "Popular ahora",
  "home.startHere": "\u00bfNunca usaste IA? Empieza aqu\u00ed.",
  "home.startHere.subtitle": "Recetas amigables que puedes terminar de una sola vez",
  "home.browseByGoal": "\u00bfQu\u00e9 quieres crear?",
  "home.latest": "\u00daltimas recetas",
  "home.whyVibez": "C\u00f3mo funciona",
  "home.persona.prefix": "Me interesa:",
  "home.persona.business": "Crear un negocio",
  "home.persona.marketing": "Marketing y contenido",
  "home.persona.learning": "Aprender IA",
  "home.persona.developer": "Herramientas para devs",
  "home.persona.exploring": "Solo estoy mirando",
  "home.valueProp1.title": "Paso a paso",
  "home.valueProp1.desc": "Sin adivinanzas. Cada receta te gu\u00eda exactamente qu\u00e9 hacer, un paso a la vez.",
  "home.valueProp2.title": "Aprende de otros",
  "home.valueProp2.desc": "Mira c\u00f3mo lo hicieron otros \u2014 d\u00f3nde se trabaron y c\u00f3mo lo resolvieron.",
  "home.valueProp3.title": "Hazla tuya",
  "home.valueProp3.desc": "Toma cualquier receta, cambia las herramientas, ajusta los prompts y comparte tu versi\u00f3n.",
  "home.cta.prompt": "\u00bfHiciste algo genial con IA? Cu\u00e9ntanos c\u00f3mo lo hiciste.",
  "home.cta.button": "Comparte tu receta",
  "footer.tagline": "VibeZ \u2014 Recetas de IA para todos",
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
  "recipe.buildersCompleted": "{count} personas lo intentaron",
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
  "home.hero.title": "Votre premier projet IA commence ici.\nSuivez simplement la recette.",
  "home.hero.subtitle": "Des recettes \u00e9tape par \u00e9tape que tout le monde peut suivre pour cr\u00e9er de vraies choses avec l\u2019IA. Aucune exp\u00e9rience requise.",
  "home.hero.browseRecipes": "Explorer les recettes",
  "home.hero.shareRecipe": "Partagez votre recette",
  "home.popular": "Populaire en ce moment",
  "home.startHere": "Jamais utilis\u00e9 l\u2019IA ? Commencez ici.",
  "home.startHere.subtitle": "Des recettes simples \u00e0 terminer en une seule fois",
  "home.browseByGoal": "Que voulez-vous cr\u00e9er ?",
  "home.latest": "Derni\u00e8res recettes",
  "home.whyVibez": "Comment \u00e7a marche",
  "home.persona.prefix": "\u00c7a m\u2019int\u00e9resse :",
  "home.persona.business": "Cr\u00e9er une entreprise",
  "home.persona.marketing": "Marketing & contenu",
  "home.persona.learning": "Apprendre l\u2019IA",
  "home.persona.developer": "Outils d\u00e9veloppeur",
  "home.persona.exploring": "Je regarde juste",
  "home.valueProp1.title": "\u00c9tape par \u00e9tape",
  "home.valueProp1.desc": "Pas de devinettes. Chaque recette vous guide exactement, une \u00e9tape \u00e0 la fois.",
  "home.valueProp2.title": "Apprenez des autres",
  "home.valueProp2.desc": "Voyez comment les autres ont fait \u2014 o\u00f9 ils ont bloqu\u00e9 et comment ils ont r\u00e9solu.",
  "home.valueProp3.title": "Faites-la v\u00f4tre",
  "home.valueProp3.desc": "Prenez une recette, changez les outils, ajustez les prompts et partagez votre version.",
  "home.cta.prompt": "Fait quelque chose de cool avec l\u2019IA ? Dites-nous comment.",
  "home.cta.button": "Partagez votre recette",
  "footer.tagline": "VibeZ \u2014 Des recettes IA pour tout le monde",
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
  "recipe.buildersCompleted": "{count} personnes ont essay\u00e9",
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
  "home.hero.title": "Dein erstes KI-Projekt startet hier.\nFolge einfach dem Rezept.",
  "home.hero.subtitle": "Schritt-f\u00fcr-Schritt-Rezepte, denen jeder folgen kann, um echte Dinge mit KI zu erstellen. Keine Erfahrung n\u00f6tig.",
  "home.hero.browseRecipes": "Rezepte entdecken",
  "home.hero.shareRecipe": "Teile dein Rezept",
  "home.popular": "Gerade beliebt",
  "home.startHere": "Noch nie KI benutzt? Hier starten.",
  "home.startHere.subtitle": "Freundliche Rezepte, die du in einem Rutsch schaffst",
  "home.browseByGoal": "Was m\u00f6chtest du erstellen?",
  "home.latest": "Neueste Rezepte",
  "home.whyVibez": "So funktioniert\u2019s",
  "home.persona.prefix": "Mich interessiert:",
  "home.persona.business": "Ein Business aufbauen",
  "home.persona.marketing": "Marketing & Inhalte",
  "home.persona.learning": "KI lernen",
  "home.persona.developer": "Entwickler-Tools",
  "home.persona.exploring": "Einfach mal schauen",
  "home.valueProp1.title": "Schritt f\u00fcr Schritt",
  "home.valueProp1.desc": "Kein Raten. Jedes Rezept zeigt dir genau, was zu tun ist \u2014 ein Schritt nach dem anderen.",
  "home.valueProp2.title": "Von anderen lernen",
  "home.valueProp2.desc": "Schau, wie andere es gemacht haben \u2014 wo sie h\u00e4ngen blieben und wie sie es gel\u00f6st haben.",
  "home.valueProp3.title": "Mach es zu deinem",
  "home.valueProp3.desc": "Nimm ein Rezept, tausche die Tools, passe die Prompts an und teile deine Version.",
  "home.cta.prompt": "Etwas Cooles mit KI gemacht? Erz\u00e4hl uns, wie du es gemacht hast.",
  "home.cta.button": "Teile dein Rezept",
  "footer.tagline": "VibeZ \u2014 KI-Rezepte f\u00fcr alle",
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
  "recipe.buildersCompleted": "{count} Leute haben es versucht",
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
