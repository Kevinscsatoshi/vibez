import { Project, Profile } from "@/types/database";

const authors: Profile[] = [
  {
    id: "user-1",
    github_username: "sarahbuilds",
    display_name: "Sarah Chen",
    avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=Sophia&backgroundColor=c0aede",
    avatar_source: "preset",
    avatar_preset_id: "f2",
    gender: "female",
    bio: "Full-stack dev building AI tools. Previously at Stripe.",
    github_url: "https://github.com/sarahbuilds",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "user-2",
    github_username: "marcusai",
    display_name: "Marcus Rivera",
    avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=Noah&backgroundColor=c0aede",
    avatar_source: "preset",
    avatar_preset_id: "m2",
    gender: "male",
    bio: "Indie hacker. Shipping AI micro-SaaS products.",
    github_url: "https://github.com/marcusai",
    created_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "user-3",
    github_username: "emmadev",
    display_name: "Emma Tanaka",
    avatar_url: "https://api.dicebear.com/9.x/notionists/svg?seed=Emma&backgroundColor=ffd5dc",
    avatar_source: "preset",
    avatar_preset_id: "f1",
    gender: "female",
    bio: "AI product designer turned builder.",
    github_url: "https://github.com/emmadev",
    created_at: "2026-02-10T00:00:00Z",
  },
  {
    id: "user-admin",
    github_username: "Kevinscsatoshi",
    display_name: "Kevin Gu",
    avatar_url: "https://avatars.githubusercontent.com/u/100052163?v=4",
    avatar_source: "github",
    avatar_preset_id: null,
    gender: "male",
    bio: "Builder & founder. Shipping AI-powered tools at the intersection of finance, geopolitics, and prediction markets.",
    github_url: "https://github.com/Kevinscsatoshi",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const sampleProjects: Project[] = [
  {
    id: "proj-1",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
    author_id: "user-1",
    title: "AI Resume Roaster",
    one_liner: "Upload your resume, get brutally honest AI feedback in 10 seconds",
    what_i_built:
      "A web app that lets users upload their resume (PDF) and get structured, actionable feedback from Claude. It scores the resume on 5 dimensions and gives specific rewrite suggestions.",
    why_i_built:
      "I was helping friends review resumes and realized the feedback loop is slow and inconsistent. I wanted to automate the obvious stuff so humans can focus on the strategic advice.",
    prompts: [
      {
        label: "Core resume analysis prompt",
        prompt:
          'You are a senior tech recruiter with 15 years of experience. Analyze this resume and provide:\n1. Overall score (1-10)\n2. Top 3 strengths\n3. Top 3 weaknesses\n4. Specific rewrite suggestions for each bullet point that is weak\n5. Missing sections or skills\n\nBe direct and specific. No generic advice.\n\nResume text:\n"""\n{resume_text}\n"""',
        model: "Claude 3.5 Sonnet",
      },
      {
        label: "Score breakdown prompt",
        prompt:
          "Based on your analysis, score this resume on these dimensions (1-10 each):\n- Clarity\n- Impact (quantified achievements)\n- Relevance (for tech roles)\n- Formatting\n- ATS compatibility\n\nReturn as JSON.",
        model: "Claude 3.5 Sonnet",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic text extraction + single prompt analysis",
        result:
          "Worked but feedback was too generic. Users said 'I could get this from ChatGPT.'",
      },
      {
        version: "v2",
        what_changed:
          "Added structured scoring, bullet-by-bullet rewriting, and comparison to job descriptions",
        result:
          "Much more specific. Users started sharing results on Twitter. 3x retention improvement.",
      },
      {
        version: "v3",
        what_changed: "Added PDF parsing with pdf.js, multi-page support, and export-to-PDF for the feedback report",
        result: "Conversion from free to paid jumped from 2% to 8%.",
      },
    ],
    failures:
      "Tried using GPT-4 initially but the latency was 15-20 seconds per analysis. Users bounced. Switched to Claude 3.5 Sonnet and got it under 5 seconds. Also tried OCR for scanned resumes but the accuracy was terrible \u2014 dropped it and required text-based PDFs only.",
    stack_tags: ["Next.js", "Claude API", "Vercel", "pdf.js", "Tailwind CSS", "Stripe"],
    screenshots: [],
    demo_html_url: null,
    demo_link: "https://resumeroaster.ai",
    video_url: null,
    metrics: [
      { name: "Users", value: "2,400", timeframe: "first 3 weeks" },
      { name: "Paid conversions", value: "8%", timeframe: "after v3" },
      { name: "MRR", value: "$480", timeframe: "month 1" },
    ],
    lessons:
      "Latency is the #1 UX killer for AI apps. Users will forgive mediocre output if it's fast, but they won't wait 20 seconds for perfect output. Also, structured scoring (not just paragraphs of text) makes AI feedback feel 10x more credible.",
    github_repo_url: "https://github.com/sarahbuilds/resume-roaster",
    github_repo_name: "resume-roaster",
    github_repo_description: "AI-powered resume analysis and feedback tool",
    github_repo_language: "TypeScript",
    github_repo_stars: 342,
    github_repo_updated_at: "2026-03-18T00:00:00Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 5,
    view_count: 1820,
    status: "published",
    featured: true,
    author: authors[0],
  },
  {
    id: "proj-2",
    created_at: "2026-03-05T10:00:00Z",
    updated_at: "2026-03-19T10:00:00Z",
    author_id: "user-2",
    title: "Cursor + Supabase SaaS Boilerplate",
    one_liner:
      "A full SaaS starter kit built entirely with Cursor in 3 days",
    what_i_built:
      "A production-ready SaaS boilerplate with auth, billing, dashboard, and admin panel. The entire thing was built using Cursor with Claude as the AI pair programmer. Includes Stripe integration, role-based access, and email notifications.",
    why_i_built:
      "Every time I start a new micro-SaaS I spend 2 weeks on boilerplate. I wanted a reusable starting point that I actually built with AI, to prove the workflow is viable for real products.",
    prompts: [
      {
        label: "Architecture planning",
        prompt:
          "I'm building a SaaS boilerplate with Next.js 14 App Router and Supabase. I need:\n- Auth (GitHub + email)\n- Stripe billing (subscriptions)\n- Role-based access (admin/member)\n- Dashboard with usage metrics\n- Admin panel\n\nDesign the database schema, API routes, and folder structure. Be specific about Supabase RLS policies.",
        model: "Claude 3.5 Sonnet (via Cursor)",
      },
      {
        label: "Stripe webhook handler",
        prompt:
          "Write a Next.js API route that handles Stripe webhooks for: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted. Update the Supabase subscriptions table accordingly. Include signature verification.",
        model: "Claude 3.5 Sonnet (via Cursor)",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Initial scaffold with auth and basic dashboard",
        result: "Working in 1 day. Auth flow was solid but dashboard was ugly.",
      },
      {
        version: "v2",
        what_changed: "Added Stripe billing, subscription management, and webhook handling",
        result:
          "Took another day. Had to debug webhook signature verification \u2014 Cursor got it wrong twice before getting it right.",
      },
      {
        version: "v3",
        what_changed: "Admin panel, role-based access, polished UI",
        result: "Shipped on day 3. Published on GitHub, got 200+ stars in first week.",
      },
    ],
    failures:
      "Cursor-generated RLS policies were wrong on the first try \u2014 they allowed users to read other users' data. Had to manually audit every policy. Lesson: never trust AI-generated auth/security code without manual review.",
    stack_tags: [
      "Next.js",
      "Supabase",
      "Cursor",
      "Stripe",
      "Tailwind CSS",
      "Vercel",
    ],
    screenshots: [],
    demo_html_url: null,
    demo_link: null,
    video_url: null,
    metrics: [
      { name: "GitHub stars", value: "580", timeframe: "3 weeks" },
      { name: "Forks", value: "89", timeframe: "3 weeks" },
      { name: "Products built on it", value: "4", timeframe: "that I know of" },
    ],
    lessons:
      "AI is incredible for boilerplate code but dangerous for security-critical code. Always manually review auth, RLS policies, and payment logic. The 3-day build time is real, but you need 1-2 more days of manual security review.",
    github_repo_url: "https://github.com/marcusai/saas-starter-ai",
    github_repo_name: "saas-starter-ai",
    github_repo_description:
      "Production SaaS boilerplate built with Cursor + Claude + Supabase",
    github_repo_language: "TypeScript",
    github_repo_stars: 580,
    github_repo_updated_at: "2026-03-17T00:00:00Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 12,
    view_count: 3200,
    status: "published",
    featured: true,
    author: authors[1],
  },
  {
    id: "proj-3",
    created_at: "2026-03-10T10:00:00Z",
    updated_at: "2026-03-22T10:00:00Z",
    author_id: "user-3",
    title: "AI Meeting Summarizer Slack Bot",
    one_liner: "Paste a meeting transcript, get a structured summary in Slack in 30 seconds",
    what_i_built:
      "A Slack bot that takes meeting transcripts (from Zoom, Google Meet, or pasted text) and produces structured summaries with action items, decisions, and follow-ups. Each summary is formatted as a Slack canvas.",
    why_i_built:
      "My team was drowning in meetings and nobody read the notes. I wanted to make meeting summaries so easy that there's no excuse not to have them.",
    prompts: [
      {
        label: "Meeting summary prompt",
        prompt:
          "Summarize this meeting transcript into:\n\n## Key Decisions\n- [list decisions made]\n\n## Action Items\n- [ ] [owner]: [action] (due: [date if mentioned])\n\n## Discussion Summary\n[2-3 paragraph summary of main topics]\n\n## Open Questions\n- [unresolved questions]\n\nBe concise. Use the participants' actual names. If no date was mentioned for an action item, mark it as 'TBD'.\n\nTranscript:\n{transcript}",
        model: "Claude 3.5 Haiku",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic Slack slash command + single prompt",
        result: "Worked but the summaries were too long. People didn't read them.",
      },
      {
        version: "v2",
        what_changed: "Added structured formatting, action item extraction, and a 'TL;DR' section at the top",
        result: "Adoption jumped. Team started using it for every meeting.",
      },
    ],
    failures:
      "Tried to auto-detect who said what from the transcript but speaker attribution was unreliable with Zoom's default transcription. Dropped auto-attribution and asked users to use labeled transcripts instead.",
    stack_tags: ["Slack API", "Claude API", "Node.js", "Vercel Functions"],
    screenshots: [],
    demo_html_url: null,
    demo_link: null,
    video_url: null,
    metrics: [
      { name: "Weekly active users", value: "45", timeframe: "internal team" },
      { name: "Summaries generated", value: "300+", timeframe: "2 months" },
      { name: "Time saved per meeting", value: "~15 min", timeframe: "estimated" },
    ],
    lessons:
      "For internal tools, adoption is everything. The tool has to be where people already work (Slack), not in a separate app. Also, Haiku is fast enough and cheap enough for this use case \u2014 Sonnet was overkill.",
    github_repo_url: "https://github.com/emmadev/meeting-bot",
    github_repo_name: "meeting-bot",
    github_repo_description: "Slack bot for AI-powered meeting summaries",
    github_repo_language: "TypeScript",
    github_repo_stars: 156,
    github_repo_updated_at: "2026-03-20T00:00:00Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 3,
    view_count: 890,
    status: "published",
    featured: true,
    author: authors[2],
  },
  {
    id: "proj-4",
    created_at: "2026-03-12T10:00:00Z",
    updated_at: "2026-03-21T10:00:00Z",
    author_id: "user-1",
    title: "Landing Page Generator",
    one_liner: "Describe your product, get a deployable landing page in 60 seconds",
    what_i_built:
      "A tool that takes a natural language product description and generates a complete, responsive landing page with hero, features, pricing, and CTA sections. Outputs clean HTML + Tailwind CSS that can be deployed immediately.",
    why_i_built:
      "I kept seeing founders spend days on landing pages when they should be testing ideas. Wanted to make it a 1-minute task.",
    prompts: [
      {
        label: "Landing page generation",
        prompt:
          "Generate a complete, modern landing page in a single HTML file using Tailwind CSS (via CDN). The page should include:\n- Hero section with headline, subheadline, and CTA button\n- 3 feature cards\n- Pricing section (3 tiers)\n- FAQ section\n- Footer\n\nProduct description: {description}\n\nMake it visually polished. Use a clean color scheme. Make the copy specific to this product, not generic. Return ONLY the HTML code.",
        model: "Claude 3.5 Sonnet",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic prompt that generates HTML",
        result: "Output was functional but looked generic and template-y.",
      },
      {
        version: "v2",
        what_changed: "Added style constraints, color theming, and copy quality guidelines to the prompt",
        result: "Much better output. Pages looked custom-built. Added download and preview features.",
      },
    ],
    failures:
      "Tried generating React components instead of plain HTML \u2014 too complex, too many dependencies to resolve. Plain HTML + Tailwind CDN is the sweet spot for instant-deployable output.",
    stack_tags: ["Next.js", "Claude API", "Tailwind CSS", "Vercel"],
    screenshots: [],
    demo_html_url: null,
    demo_link: "https://landinggen.dev",
    video_url: null,
    metrics: [
      { name: "Pages generated", value: "1,200+", timeframe: "2 weeks" },
      { name: "Avg. generation time", value: "45 seconds", timeframe: "" },
    ],
    lessons:
      "Constraining the output format (single HTML file, Tailwind CDN) makes AI output dramatically more reliable. The less infrastructure the output needs, the more useful it is.",
    github_repo_url: null,
    github_repo_name: null,
    github_repo_description: null,
    github_repo_language: null,
    github_repo_stars: null,
    github_repo_updated_at: null,
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 8,
    view_count: 2100,
    status: "published",
    featured: false,
    author: authors[0],
  },
  {
    id: "proj-5",
    created_at: "2026-03-14T10:00:00Z",
    updated_at: "2026-03-22T10:00:00Z",
    author_id: "user-2",
    title: "AI Code Review GitHub Action",
    one_liner: "Automated code review comments on every PR using Claude",
    what_i_built:
      "A GitHub Action that runs on every pull request, sends the diff to Claude, and posts inline review comments. It catches bugs, suggests improvements, and flags security issues.",
    why_i_built:
      "Small teams don't have time for thorough code reviews. I wanted an AI reviewer that catches the obvious stuff so humans can focus on architecture and design decisions.",
    prompts: [
      {
        label: "Code review prompt",
        prompt:
          "Review this code diff. For each issue you find, provide:\n- File and line number\n- Severity: critical / warning / suggestion\n- Description of the issue\n- Suggested fix (code snippet)\n\nFocus on:\n1. Bugs and logic errors\n2. Security vulnerabilities\n3. Performance issues\n4. Code style (only if it impacts readability)\n\nDo NOT comment on:\n- Formatting preferences\n- Naming conventions (unless misleading)\n- Minor style differences\n\nDiff:\n```\n{diff}\n```",
        model: "Claude 3.5 Sonnet",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic diff analysis + PR comment",
        result: "Too noisy. 20+ comments per PR, most were trivial style nits.",
      },
      {
        version: "v2",
        what_changed: "Added severity levels, filtered out style-only comments, added inline review comments instead of single PR comment",
        result: "Much better signal-to-noise. Team started actually reading the comments.",
      },
    ],
    failures:
      "Tried to review entire files instead of just the diff \u2014 way too expensive and slow. Also tried GPT-4 but the cost per review was $0.50-1.00. Claude Haiku brought it down to $0.02-0.05 per review.",
    stack_tags: ["GitHub Actions", "Claude API", "TypeScript", "GitHub API"],
    screenshots: [],
    demo_html_url: null,
    demo_link: null,
    video_url: null,
    metrics: [
      { name: "PRs reviewed", value: "500+", timeframe: "1 month" },
      { name: "Bugs caught pre-merge", value: "23", timeframe: "1 month" },
      { name: "Cost per review", value: "$0.03", timeframe: "average" },
    ],
    lessons:
      "The #1 lesson: AI code review must have high precision, not high recall. It's better to catch 5 real bugs than to flag 50 maybe-issues. Developers will ignore the tool if it's noisy.",
    github_repo_url: "https://github.com/marcusai/ai-code-review-action",
    github_repo_name: "ai-code-review-action",
    github_repo_description: "GitHub Action for AI-powered code review with Claude",
    github_repo_language: "TypeScript",
    github_repo_stars: 890,
    github_repo_updated_at: "2026-03-21T00:00:00Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 15,
    view_count: 4500,
    status: "published",
    featured: false,
    author: authors[1],
  },
  {
    id: "proj-6",
    created_at: "2026-03-16T10:00:00Z",
    updated_at: "2026-03-23T10:00:00Z",
    author_id: "user-3",
    title: "Prompt A/B Testing Framework",
    one_liner: "Test prompt variations with real users and track which performs better",
    what_i_built:
      "A lightweight SDK and dashboard for running A/B tests on LLM prompts. You define prompt variants, the SDK randomly assigns users, and the dashboard shows performance metrics (latency, user ratings, task completion).",
    why_i_built:
      "Everyone 'vibes' their prompts but nobody actually measures which version is better. I wanted to bring product-grade experimentation to prompt engineering.",
    prompts: [
      {
        label: "Dashboard UI generation",
        prompt:
          "Build a React dashboard component that displays A/B test results for prompt variants. Show:\n- Variant names (A vs B)\n- Sample size per variant\n- Average user rating (1-5 stars)\n- Average latency (ms)\n- Statistical significance indicator (p-value)\n- A bar chart comparing the two variants\n\nUse recharts for the chart. Use a clean, minimal design with a white background.",
        model: "Claude 3.5 Sonnet (via Cursor)",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic SDK with random assignment + logging",
        result: "Worked but the dashboard was just a JSON dump. Not usable by non-technical PMs.",
      },
      {
        version: "v2",
        what_changed: "Built visual dashboard with charts, added statistical significance calculation",
        result: "PMs could actually use it. Started getting feature requests.",
      },
    ],
    failures:
      "Tried to build automatic prompt optimization (genetic algorithms on prompts) but the search space was too large and results were unpredictable. Went back to manual A/B testing which is simpler and more trustworthy.",
    stack_tags: ["React", "Python", "FastAPI", "PostgreSQL", "Recharts"],
    screenshots: [],
    demo_html_url: null,
    demo_link: null,
    video_url: null,
    metrics: [
      { name: "Teams using it", value: "3", timeframe: "internal + 2 external" },
      { name: "Tests run", value: "47", timeframe: "2 months" },
    ],
    lessons:
      "Simple tools that solve a real workflow gap beat sophisticated tools that solve a theoretical problem. A/B testing prompts sounds boring but it's what teams actually need.",
    github_repo_url: "https://github.com/emmadev/prompt-ab",
    github_repo_name: "prompt-ab",
    github_repo_description: "A/B testing framework for LLM prompts",
    github_repo_language: "Python",
    github_repo_stars: 210,
    github_repo_updated_at: "2026-03-22T00:00:00Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 2,
    view_count: 670,
    status: "published",
    featured: false,
    author: authors[2],
  },
  {
    id: "proj-newz",
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-03-24T10:00:00Z",
    author_id: "user-admin",
    title: "NewZ — Polymarket Radar",
    one_liner: "A minimalist radar for Polymarket events. Track prediction markets through the lens of news.",
    what_i_built:
      "A web app that connects prediction market data from Polymarket with real-time news context. Users can track market movements, see which events are driving price changes, and get a news-integrated view of prediction markets. The interface is minimalist and focused — no clutter, just signal.",
    why_i_built:
      "Polymarket is great for seeing odds, but it lacks news context. I wanted a tool that answers 'why is this market moving?' by pairing market data with relevant news in real-time. Most prediction market tools are either too complex or too shallow — NewZ sits in the sweet spot.",
    prompts: [
      {
        label: "News-market correlation engine",
        prompt:
          "You are a prediction market analyst. Given a Polymarket event and a set of recent news articles, determine:\n1. Which articles are directly relevant to this market\n2. How each article might impact the probability (bullish/bearish/neutral)\n3. A one-line summary of the current news sentiment\n4. Key signals to watch\n\nMarket: {market_title}\nCurrent probability: {probability}\nArticles:\n{articles_json}\n\nReturn structured JSON.",
        model: "Claude 3.5 Sonnet",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic Polymarket API integration with market listing",
        result: "Functional but felt like a worse version of the Polymarket UI itself.",
      },
      {
        version: "v2",
        what_changed: "Added news feed integration, AI-powered relevance scoring, and a clean dark-theme UI",
        result: "Much more useful. The news-to-market pairing became the core differentiator.",
      },
      {
        version: "v3",
        what_changed: "Real-time price updates, event filtering, mobile-responsive redesign",
        result: "Production-ready. Deployed to newz.beer and started getting organic traffic.",
      },
    ],
    failures:
      "Initially tried to build a full trading interface with order placement — way too complex for an MVP. Stripped it back to read-only market monitoring with news context, which is what users actually wanted. Also experimented with auto-generated trading signals but the liability risk wasn't worth it.",
    stack_tags: ["Next.js", "TypeScript", "Vercel", "Polymarket API", "Claude API", "Tailwind CSS"],
    screenshots: [],
    demo_html_url: null,
    demo_link: "https://newz.beer",
    video_url: null,
    metrics: [
      { name: "Markets tracked", value: "200+", timeframe: "live" },
      { name: "Daily active users", value: "150+", timeframe: "organic" },
    ],
    lessons:
      "For data-heavy products, less is more. Users don't want every data point — they want the right data point at the right time. The AI layer works best as a filter, not a generator. Also: .beer is a surprisingly memorable TLD.",
    github_repo_url: "https://github.com/Kevinscsatoshi/newz-beer",
    github_repo_name: "newz-beer",
    github_repo_description: "Minimalist Polymarket radar with news integration",
    github_repo_language: "TypeScript",
    github_repo_stars: 0,
    github_repo_updated_at: "2026-02-27T11:52:20Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 2,
    view_count: 1200,
    status: "published",
    featured: true,
    author: authors[3],
  },
  {
    id: "proj-geoz",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-24T10:00:00Z",
    author_id: "user-admin",
    title: "GeoZ — Supply Chain Intelligence",
    one_liner: "Visualize global supply chains, trace upstream dependencies, and understand how geopolitical events impact your portfolio.",
    what_i_built:
      "A supply chain intelligence platform with an interactive 3D globe visualization showing supply chain hotspots. Features include a live event feed with 48-hour pulse view, stock-to-supply-chain search, Telegram OSINT integration, and geopolitical risk scoring. Users can search any stock and see its full upstream supply chain mapped on the globe.",
    why_i_built:
      "After the chip shortage and COVID supply chain chaos, I realized most investors have zero visibility into the supply chains behind their stocks. GeoZ makes geopolitical supply chain risk visible and actionable — turning open-source intelligence into investment signals.",
    prompts: [
      {
        label: "Supply chain mapping prompt",
        prompt:
          "You are a supply chain intelligence analyst. Given a company ticker and name, map its key supply chain dependencies:\n\n1. Tier 1 suppliers (direct)\n2. Tier 2 suppliers (supplier's suppliers)\n3. Key geographic concentrations (countries/regions)\n4. Critical single-source dependencies\n5. Geopolitical risk factors for each geographic node\n\nCompany: {ticker} - {company_name}\n\nReturn as structured JSON with lat/lng coordinates for globe visualization.",
        model: "Claude 3.5 Sonnet",
      },
      {
        label: "Geopolitical event impact analysis",
        prompt:
          "Analyze this geopolitical event and determine its supply chain impact:\n\nEvent: {event_description}\nSource: {source}\n\nFor each affected supply chain:\n1. Which companies/sectors are impacted\n2. Severity (critical/high/medium/low)\n3. Geographic scope\n4. Estimated duration of disruption\n5. Alternative supply routes if any\n\nReturn structured JSON.",
        model: "Claude 3.5 Sonnet",
      },
    ],
    iterations: [
      {
        version: "v1",
        what_changed: "Basic stock search with static supply chain data and flat map view",
        result: "Proof of concept worked but the flat map was boring and hard to read.",
      },
      {
        version: "v2",
        what_changed: "Added Cobe-inspired interactive 3D globe, live event feed, and real-time OSINT from Telegram channels",
        result: "Massive visual upgrade. The globe became the signature feature — people shared screenshots on Twitter.",
      },
      {
        version: "v3",
        what_changed: "Added portfolio view, geopolitical risk scoring, dark/light mode, and iOS app (Swift)",
        result: "Full platform now. Web + mobile. Starting to get interest from institutional investors.",
      },
    ],
    failures:
      "Tried to auto-trade based on geopolitical signals — terrible idea, the signal-to-noise ratio was too low for automated execution. Also built a complex NLP pipeline for news analysis before realizing Claude could do it better with simple prompting. Threw away 2 weeks of custom NLP code.",
    stack_tags: ["Next.js", "TypeScript", "Vercel", "Three.js", "Cobe", "Claude API", "Telegram API", "Swift"],
    screenshots: [],
    demo_html_url: null,
    demo_link: "https://geo-z.vercel.app",
    video_url: null,
    metrics: [
      { name: "Supply chains mapped", value: "500+", timeframe: "companies" },
      { name: "OSINT sources", value: "50+", timeframe: "Telegram channels" },
      { name: "Daily events processed", value: "200+", timeframe: "live" },
    ],
    lessons:
      "3D visualization is a double-edged sword — it looks amazing in demos but can hurt usability if overdone. The globe works because it maps directly to the data (geographic supply chains). Don't use 3D just to be fancy. Also: Telegram is an underrated OSINT goldmine for geopolitical intelligence.",
    github_repo_url: "https://github.com/Kevinscsatoshi/GeoZ",
    github_repo_name: "GeoZ",
    github_repo_description: "Supply chain intelligence platform with interactive globe visualization",
    github_repo_language: "TypeScript",
    github_repo_stars: 1,
    github_repo_updated_at: "2026-03-19T15:16:38Z",
    github_readme: null,
    forked_from: null,
    fork_description: null,
    fork_count: 4,
    view_count: 2800,
    status: "published",
    featured: true,
    author: authors[3],
  },
];

export function getProjectById(id: string): Project | undefined {
  return sampleProjects.find((p) => p.id === id);
}

export function getFeaturedProjects(): Project[] {
  return sampleProjects.filter((p) => p.featured);
}

export function getLatestProjects(): Project[] {
  return [...sampleProjects].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getTrendingProjects(): Project[] {
  return [...sampleProjects].sort(
    (a, b) => b.fork_count + b.view_count - (a.fork_count + a.view_count)
  );
}

export function getProjectsByAuthor(authorId: string): Project[] {
  return sampleProjects.filter((p) => p.author_id === authorId);
}

export function getAuthorById(authorId: string): Profile | undefined {
  return authors.find((a) => a.id === authorId);
}

export { authors };
