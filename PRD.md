# Vibez — MVP Product Requirements Document

**Product:** Vibez — The Structured Builder Network for AI Builders
**Version:** MVP v0.1
**Date:** 2026-03-24
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Problem and Opportunity](#3-problem-and-opportunity)
4. [Target Users / Personas](#4-target-users--personas)
5. [Core Jobs to Be Done](#5-core-jobs-to-be-done)
6. [Product Principles](#6-product-principles)
7. [MVP Scope](#7-mvp-scope)
8. [Out of Scope for MVP](#8-out-of-scope-for-mvp)
9. [Detailed Page-by-Page Product Requirements](#9-detailed-page-by-page-product-requirements)
10. [Key User Flows](#10-key-user-flows)
11. [GitHub Integration Requirements for MVP](#11-github-integration-requirements-for-mvp)
12. [Content Quality / Moderation Implications](#12-content-quality--moderation-implications)
13. [Cold Start and Seeding Strategy](#13-cold-start-and-seeding-strategy)
14. [Success Metrics for MVP](#14-success-metrics-for-mvp)
15. [Risks and Open Questions](#15-risks-and-open-questions)
16. [Recommended Post-MVP Roadmap](#16-recommended-post-mvp-roadmap)
17. [Prioritization: Must-Have / Should-Have / Later](#17-prioritization-must-have--should-have--later)

---

## 1. Executive Summary

Vibez is a structured builder network for the AI/vibe coding community. It captures the full chain of AI-assisted building — **Prompt -> Build -> Output -> Metrics -> Iteration** — in a format that is browsable, searchable, forkable, and reusable.

Unlike Discord (noisy), Reddit (unstructured), Product Hunt (launch-day only), or GitHub (code without context), Vibez connects the dots between what was prompted, what was built, what worked, what failed, and what traction resulted. Projects can optionally link to GitHub repositories for code-level credibility.

The MVP targets AI builders, learners, and operators. The core bet: if we give builders a structured way to publish their full build story — and give learners a structured way to study and remix it — we create a knowledge network that is more valuable than any existing community.

**MVP goal:** Prove that users will browse, publish, and fork structured AI build case studies — and return.

**Target timeline:** 4-6 weeks to launch with curated seed content and an invite-first builder cohort.

---

## 2. Product Vision

Vibez becomes the default place to see **what actually works** with AI.

Not what people are talking about. Not what launched today. What was built, how it was built, what prompts drove it, what failed along the way, what stack was used, whether it has real traction — and the linked code behind it.

**One-liner:** GitHub meets Indie Hackers meets a prompt library — for people who ship with AI.

**3-year vision:** A searchable, forkable library of tens of thousands of real AI build stories, each connected to prompts, stacks, repos, metrics, and iteration history. The most practical resource in the AI builder ecosystem.

---

## 3. Problem and Opportunity

### The Problem

People building with AI today cannot easily find high-quality, structured examples of:

- What someone actually built with AI tools
- The specific prompts they used
- The stack and tools involved
- How they iterated from v1 to vN
- What failed and why
- Whether the project has real traction (users, revenue, conversion)
- The code behind it

Existing platforms optimize for the wrong thing:

| Platform | Strength | Gap |
|----------|----------|-----|
| Discord / Reddit | Discussion | Noisy, unstructured, ephemeral |
| Product Hunt | Launch visibility | No process visibility, no iteration story |
| Indie Hackers | Founder discussion | Lacks prompt-level and workflow-level detail |
| GitHub | Code | No prompt/workflow/metrics context |
| Twitter/X | Distribution | Fleeting, no structured knowledge |

### The Opportunity

The AI builder community is large, growing, and underserved by existing tools. There is no single platform that captures the **full build chain** in a structured, browsable, reusable format. Vibez fills this gap by treating the **Project** — not the post, not the thread — as the core content object.

---

## 4. Target Users / Personas

### Persona 1: The Builder

**Who:** People who make products, experiments, agents, workflows, tools, or micro-startups with AI.

**Motivation:**
- Visibility and recognition for their work
- Distribution beyond their existing network
- A portfolio that shows process, not just polished output
- A single page that connects prompts, outputs, and GitHub repos

**Behavior:** Publishes 1-3 projects. Returns to update metrics and iterations. Shares project links externally.

### Persona 2: The Learner

**Who:** People who want to learn from real AI build examples.

**Motivation:**
- Study real prompts that produced real results
- Understand what stacks and tools work for different use cases
- Compare iterations to see how projects evolved
- Fork or remix working projects as a starting point
- Learn from failures, not just polished showcases

**Behavior:** Browses frequently. Saves and forks projects. Rarely publishes initially.

### Persona 3: The Operator

**Who:** Founders, product leads, investors, and serious observers who care about what works in practice.

**Motivation:**
- Find practical signals about what AI approaches have real traction
- Discover repeatable build patterns
- Identify tools and stacks that produce results
- Spot emerging trends before they hit mainstream channels

**Behavior:** Browses periodically. Filters by metrics and traction. Shares interesting finds with teams.

---

## 5. Core Jobs to Be Done

| # | Job | Primary Persona |
|---|-----|-----------------|
| 1 | "Show me what people are actually building with AI — with proof" | Learner, Operator |
| 2 | "Let me publish my full build story in one structured place" | Builder |
| 3 | "Show me the exact prompts that produced this result" | Learner |
| 4 | "Let me fork this project and build my own version" | Learner, Builder |
| 5 | "Help me understand what stack/tools to use for my use case" | Learner |
| 6 | "Show me what's working — with real metrics, not hype" | Operator |
| 7 | "Give me a credible builder portfolio that shows process" | Builder |
| 8 | "Let me connect my code to my build story" | Builder |

---

## 6. Product Principles

1. **Structured over free-form.** The core object is a Project with defined sections, not a text post. Publishing is guided, not open-ended.
2. **Signal over noise.** Optimize for reusable knowledge, not engagement metrics. No infinite scroll dopamine loops.
3. **Proof over hype.** Metrics, demos, repos, and iteration history matter more than marketing language.
4. **Builder-first.** The platform should feel like a tool for serious builders, not a social network for audiences.
5. **Outcome-oriented.** Every feature should help someone learn what works, or help someone show that their thing works.
6. **Calm and credible.** The design should feel like a structured project library — clean, modern, minimal, high-signal.
7. **Flat and minimal UI.** Card-based component layout. Flat design language — no shadows, gradients, or visual clutter. Each project is a compact card; users click in to see the full detail view. Prioritize whitespace, legibility, and scannability.

---

## 6.1 UI / Design Direction

**Overall approach:** Flat design. Card-based component system. Minimal and clean.

**Design language:**
- Flat — no drop shadows, no gradients, no 3D effects
- Subtle borders or background tints to separate cards/sections
- Generous whitespace between components
- Monospace or semi-monospace typography for prompt blocks and code
- System or clean sans-serif font for body text
- Muted, neutral color palette with one accent color for CTAs

**Core interaction pattern:**
- The Discover page is a grid of compact project cards
- Users click a card to enter the full project detail view
- The detail view displays README, inline demo, prompts, metrics, and all structured sections
- Each section in the detail view is a distinct visual block — scannable, not a wall of text

**Inline demo behavior:**
- If the builder uploaded an HTML file: render it in a sandboxed `<iframe>` directly on the project page — users can interact with the demo without leaving Vibez
- If the project is too complex for inline rendering: display an uploaded video or YouTube/Loom embed
- If neither is provided: show screenshots or external demo link only
- Priority order: live iframe demo > video > external link > screenshots

**README display:**
- If a GitHub repo is attached and has a README, render it as markdown in a contained, scrollable block on the project page
- Provides technical documentation context alongside the build story

---

## 7. MVP Scope

The MVP is a structured project publishing and browsing platform with GitHub integration and fork/remix capability.

### In scope:

- **Home / Discover page** — curated and sorted project feed
- **Project page** — the full structured project view with GitHub repo section
- **Create Project flow** — guided structured publishing with optional GitHub repo attachment
- **Profile page** — builder identity and project list
- **Fork / Remix flow** — create a derivative project with lineage preserved
- **Authentication** — GitHub OAuth (only auth method for MVP)
- **GitHub integration** — connect account, attach repo, display repo metadata
- **Basic search and filtering** — by stack tags, recency, metrics presence
- **Curated seed content** — 20-30 high-quality projects published before public launch

### Tech direction:

- Next.js (App Router)
- Supabase (auth, database, storage)
- Vercel (hosting)
- GitHub OAuth + GitHub REST API
- Tailwind CSS

---

## 8. Out of Scope for MVP

The following are explicitly **not** in the MVP. They may appear in the post-MVP roadmap.

- Comments or discussion threads on projects
- Upvoting / ranking / karma systems
- Notifications
- Follow / subscribe to builders
- Direct messaging
- AI-powered features (auto-tagging, prompt analysis, recommendations)
- Auto-import from GitHub (README parsing, stack detection)
- Commit timeline or development velocity display
- API / embeds
- Mobile-native app
- Monetization features
- Admin dashboard (use Supabase dashboard directly)
- Community features (groups, collections, challenges)
- Email newsletters or digests
- Advanced analytics for builders

---

## 9. Detailed Page-by-Page Product Requirements

### 9.1 Home / Discover

**Purpose:** Communicate value quickly. Help people discover high-quality projects.

**Layout:**

Card-based grid layout. Each project is a compact, flat card component. The entire Discover page is a browsable grid of these cards — no heavy text blocks, no feed-style scrolling.

- **Hero section** (logged-out only): One-line value prop + CTA to browse or sign up. Example: *"See what AI builders are actually shipping — prompts, stacks, metrics, and all."*
- **Featured Projects** (curated by admin): 3-4 hand-picked project cards, visually highlighted. Rotated manually for MVP.
- **Trending Projects**: Grid of cards sorted by recent fork count + view count (simple heuristic).
- **Latest Builds**: Grid of cards in reverse-chronological order.
- **Filter bar**: Filter by stack tags (e.g., "Next.js", "GPT-4", "LangChain", "Cursor"). Filter by "has metrics" / "has GitHub repo".

**Project Card** (the core UI component, used across all lists):

Flat design — no drop shadows, no rounded corners heavier than 4px. Clean borders or subtle background differentiation only.

| Field | Required |
|-------|----------|
| Title | Yes |
| One-line result | Yes |
| Stack tags (up to 5) | Yes |
| Author name + avatar | Yes |
| Key metric (if provided) | Optional |
| Fork count | Yes (0 if none) |
| GitHub badge | Show if repo attached |
| Thumbnail/screenshot | Optional |

**Interactions:**
- Click card -> Project detail page (full view)
- Click author -> Profile page
- Click tag -> Filtered grid

### 9.2 Project Page

**Purpose:** The most important page. Opened when a user clicks a project card. Show the full build story in a structured, scannable format.

**Design approach:** Flat, minimal layout. Each section is a visually distinct block/component with clear labels. Generous whitespace between sections. No decorative elements.

**Sections (in order):**

#### Header
- Title
- One-line result
- Author (linked to profile)
- Published date
- Stack tags
- Fork count
- "Fork this project" button
- GitHub badge (if repo attached)

#### Overview
- What I built (short description, 2-5 sentences)
- Why I built it (motivation/context)

#### Prompts
- One or more prompt blocks
- Each block: label + prompt text (markdown-rendered, with code blocks for raw prompts)
- Optional: which tool/model was used for each prompt

#### Iteration History
- Chronological list of iterations
- Each iteration: what changed, why, what resulted
- Minimum 1 entry (even if "v1, no iterations yet")

#### Failures / What Didn't Work
- Optional section
- Free-text or structured entries
- What was tried, why it failed, what was learned

#### Stack / Tools
- List of tools, frameworks, APIs, models used
- Displayed as tags with optional notes

#### Output / Demo
- Screenshots (uploaded images)
- **Inline live demo** (if the project output is simple HTML/CSS/JS):
  - Rendered in a sandboxed `<iframe>` directly on the project page
  - Builder uploads an HTML file (with inline CSS/JS) or pastes a static demo URL
  - The iframe is sandboxed (`sandbox="allow-scripts"`) — no navigation, no external requests
  - Provides an immediate, interactive preview without leaving Vibez
- **Video fallback**: If the project is too complex for inline rendering (backend-dependent, native app, etc.), the builder uploads a video file or provides a YouTube/Loom URL
  - Video is embedded inline on the project page
- **External demo link**: Optional URL to the live product (opens in new tab)
- Display priority: inline demo > video > external link > screenshots only

#### Metrics / Traction
- Optional section
- Structured fields: users, revenue, conversion rate, or custom metric
- Each metric: label + value + timeframe
- Example: "500 users in first week" / "$200 MRR after 30 days"

#### Lessons Learned
- Free-text section
- What the builder would tell someone starting this project today

#### README
- Shown if a GitHub repo is attached and the repo has a README
- Rendered as markdown directly on the project page
- Fetched via GitHub API at publish time, cached and refreshed periodically (max once per hour)
- Provides technical context and documentation without leaving Vibez
- Displayed in a contained, scrollable block if the README is long

#### GitHub Repository
- Shown only if a repo is attached
- Display: repo name, description, primary language, star count, last updated date
- Link to repo on GitHub
- Note: this section adds credibility but does not dominate the page

#### Fork Lineage
- Shown only if this project is a fork
- "Forked from: [Original Project Title]" with link
- What changed in this version

**Page behavior:**
- All sections render if content exists; empty optional sections are hidden
- Anchor links in a sidebar or top nav for long projects
- Clean typography, generous whitespace, code-style prompt blocks

### 9.3 Create Project

**Purpose:** Guide builders through structured project publishing. Prevent low-effort free-form posting.

**Flow:** Multi-step form (not a single long page). Steps:

#### Step 1: Basics
- Title (required, max 100 chars)
- One-line result (required, max 200 chars)
- What I built (required, rich text, 50-1000 chars)
- Why I built it (required, rich text, 50-500 chars)

#### Step 2: Prompts
- Add one or more prompt blocks
- Each block: label (optional) + prompt text in markdown (required) + model/tool used (optional)
- Prompt blocks support full markdown formatting
- Minimum 1 prompt block required

#### Step 3: Build Story
- Iteration history (at least 1 entry required)
  - Each entry: version label + what changed + what resulted
- Failures / what didn't work (optional, encouraged)
  - Prompt text: "What did you try that didn't work? This helps others avoid the same mistakes."

#### Step 4: Stack & Output
- Stack tags (required, minimum 1, select from existing + create new)
- Screenshots (optional, up to 5 images, drag-and-drop upload)
- **Live demo** (optional): upload a single HTML file (with inline CSS/JS) for sandboxed inline preview on the project page
- **Video** (optional): upload a video file (mp4, max 50MB) or paste a YouTube/Loom URL — used when the project can't be demoed inline
- Demo link (optional, URL to external live product)

#### Step 5: Metrics & Lessons
- Metrics (optional, add structured metric entries)
  - Each: metric name + value + timeframe
- Lessons learned (optional, rich text)

#### Step 6: GitHub & Publish
- Connect GitHub (if not already connected) — triggers OAuth flow
- Select repository to attach (optional) — dropdown of user's repos
- Preview project page
- Publish button

**Form behavior:**
- Progress indicator across steps
- Save as draft at any step
- Back/forward navigation
- Validation: required fields enforced per step before advancing
- Publish triggers a "pending review" state if moderation is enabled (see Section 12)

### 9.4 Profile Page

**Purpose:** Builder identity and project portfolio.

**Content:**
- Display name
- Avatar (from GitHub if connected, or uploaded)
- Bio (optional, max 300 chars)
- GitHub username + link (if connected)
- Total projects published
- Total forks received (across all projects)
- Project list (cards, same format as Discover page)
- Joined date

**Interactions:**
- Edit profile (own profile only)
- Click any project card -> Project page

### 9.5 Fork / Remix Flow

**Purpose:** Let users create derivative projects from existing ones, preserving lineage.

**Trigger:** "Fork this project" button on any Project page.

**Flow:**
1. Click "Fork this project" (requires login)
2. Pre-populated Create Project form with original content
3. All fields are editable
4. Additional required field: "What did you change?" (text, 50-500 chars)
5. User can attach a different GitHub repo or no repo
6. On publish, the new project displays "Forked from: [Original]" with link

**Data model:**
- `forked_from` field on Project (nullable, references parent project ID)
- Fork count is a computed count of projects referencing the parent

---

## 10. Key User Flows

### Flow 1: Lurker / Learner

```
Landing page (logged out)
  -> Reads hero / value prop
  -> Scrolls Featured Projects
  -> Clicks a project card
  -> Reads Project Page (full story: prompts, iterations, stack, metrics)
  -> Clicks GitHub repo link to inspect code
  -> Scrolls to "Lessons Learned"
  -> Optionally: signs up to save or fork
```

**Success criteria:** User spends 3+ minutes on a project page. Returns within 7 days.

### Flow 2: Builder

```
Signs up (GitHub OAuth)
  -> Browses Discover page for examples and inspiration
  -> Clicks "Create Project"
  -> Completes structured multi-step form
  -> Connects GitHub account (if not already)
  -> Attaches repository
  -> Previews project page
  -> Publishes
  -> Shares project link externally (Twitter, Discord, etc.)
  -> Returns to update metrics or add iterations
```

**Success criteria:** Builder completes and publishes a project. Returns to update it at least once.

### Flow 3: Power User (Fork/Remix)

```
Discovers interesting project via Discover or external link
  -> Reads full project page
  -> Clicks "Fork this project"
  -> Modifies prompts, stack, or approach
  -> Adds own output and metrics
  -> Attaches own GitHub repo
  -> Publishes remixed version
  -> Original project shows fork count +1
```

**Success criteria:** Fork is published. Forked project has meaningful differentiation from original.

---

## 11. GitHub Integration Requirements for MVP

### Authentication
- GitHub OAuth as the only login method (no email/password for MVP)
- Scopes requested: `read:user`, `public_repo` (read-only access to public repos)
- Store GitHub access token securely in Supabase (encrypted)
- Display GitHub username and avatar on profile

### Repository Attachment
- After GitHub auth, user can select from their public repositories
- Repo selection: searchable dropdown listing user's repos (paginated via GitHub API)
- One repo per project (1:1 relationship)
- Repo can be detached or changed after publishing

### Metadata Display on Project Page
- Repository name (linked to GitHub)
- Repository description
- Primary language
- Star count
- Last updated date
- Fetched at publish time + refreshed on project page view (cached, max once per hour)

### README Display
- Fetch README.md content via GitHub API when a repo is attached
- Render as markdown on the project page (in a contained, scrollable block)
- Cached in Supabase; refreshed max once per hour on project page view
- If no README exists in the repo, this section is hidden

### What GitHub Integration is NOT (in MVP)
- No private repo access
- No commit history display
- No automatic stack detection from repo
- No webhook integration
- No write access to repos
- No GitHub Actions integration

### Technical Notes
- Use GitHub REST API v3 (simpler than GraphQL for MVP scope)
- Cache repo metadata in Supabase to avoid rate limits
- Handle token expiry gracefully (prompt re-auth if token fails)
- Rate limit: GitHub allows 5,000 requests/hour per authenticated user — sufficient for MVP

---

## 12. Content Quality / Moderation Implications

### Why This Matters

The core value proposition is **high-signal, structured content**. If project quality degrades, the platform loses its primary differentiator. Quality control is a product feature, not an afterthought.

### MVP Moderation Approach

**Manual review queue:**
- All new projects enter a "pending review" state before appearing on Discover
- Admin reviews via Supabase dashboard (no custom admin UI for MVP)
- Review criteria: structured sections filled meaningfully, not spam, not placeholder content
- Approved projects appear on Discover; rejected projects get an email with feedback

**Minimum quality bar:**
- Title and one-line result are specific (not "My AI Project")
- At least 1 real prompt block (not "I used ChatGPT")
- At least 1 iteration entry
- At least 1 stack tag
- Overview describes something concrete

**Implications for product design:**
- Create flow should use placeholder text and examples that model high-quality submissions
- Consider showing 2-3 example projects in the Create flow as references
- The guided multi-step form is itself a quality mechanism — it's harder to submit low-effort content when each section has clear expectations

### Spam Prevention (Lightweight)
- Require GitHub OAuth (raises barrier to spam accounts)
- Rate limit: max 3 project submissions per day per user
- No anonymous publishing

---

## 13. Cold Start and Seeding Strategy

### The Problem

A builder network with no projects has no value for learners. A platform with no audience has no value for builders. Both sides need to exist at launch.

### Strategy: Curated Seed Content + Invite-First Builders

#### Phase 1: Seed Content (Pre-Launch, Weeks 1-2)

- **Founder creates 10-15 projects** personally — real builds, real prompts, real metrics
- These serve as both content and quality templates
- Cover diverse categories: agents, SaaS tools, automations, micro-startups, developer tools
- Each seed project should demonstrate a different stack and approach

#### Phase 2: Invited Builders (Pre-Launch, Weeks 3-4)

- Invite 15-20 known AI builders (from Twitter, Indie Hackers, local network)
- Provide them with:
  - Early access
  - Personal onboarding (show them seed projects as examples)
  - A simple ask: "Publish one project about something you've built with AI"
- Target: 30+ total projects at launch

#### Phase 3: Soft Launch (Week 5)

- Open to broader audience via waitlist or public access
- Feature the best 10 projects on the homepage
- Share individual project links on Twitter/X, Reddit, Hacker News
- The hook is the project, not the platform — let great projects drive discovery

### Product Implications

- Home page must look full and curated with 30 projects (not empty)
- Featured Projects section is manually curated (admin sets featured flag in DB)
- "Trending" algorithm should work with low volume (fork count + page views, simple heuristic)
- Profile pages should feel valuable even with 1-2 projects
- The Create flow must be polished enough that invited builders have a good experience

---

## 14. Success Metrics for MVP

### Primary Metrics (Prove Core Value)

| Metric | Target (First 8 Weeks) | Why It Matters |
|--------|------------------------|----------------|
| Projects published | 50+ | Supply side is working |
| Avg. time on project page | > 3 minutes | Content is valuable and being consumed |
| Return visitors (7-day) | > 25% of unique visitors | Platform is worth coming back to |
| Fork/remix count | 10+ | Core mechanic is working |
| GitHub repos attached | > 40% of projects | Integration adds value |

### Secondary Metrics (Health Signals)

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Projects with metrics section filled | > 30% | Builders share real outcomes |
| Create flow completion rate | > 60% of starts | Form isn't too burdensome |
| Bounce rate on Discover page | < 50% | Homepage is compelling |
| Projects per builder | > 1.5 avg | Builders are returning to publish |
| External shares (UTM-tracked) | Any signal | Organic distribution is happening |

### What We're NOT Optimizing For (MVP)

- Total registered users (vanity)
- Daily active users (too early)
- Time on site overall (could indicate confusion, not value)
- Social engagement (likes, comments — not in MVP)

---

## 15. Risks and Open Questions

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Builders won't publish** — too much effort for structured format | High | Multi-step form with clear guidance, draft saving, example projects. Keep required fields lean. |
| **Content quality is low** — projects are shallow or promotional | High | Manual review queue, quality bar in moderation, guided form design. |
| **Cold start fails** — not enough content to attract learners | High | Founder-created seed content, invited builder cohort, curated featuring. |
| **GitHub integration adds complexity without enough value** | Medium | Keep MVP scope minimal (link + metadata only). Measure attachment rate. |
| **Fork/remix underused** — users browse but don't remix | Medium | Feature forks prominently, make fork flow frictionless, highlight "forked from" on project pages. |
| **Platform feels like work, not community** | Medium | Intentional trade-off. The value is structured knowledge. Add lightweight social features post-MVP if needed. |

### Open Questions

1. **How to handle projects that become outdated?** Should there be an "archived" or "inactive" state?
2. **Should there be any form of "endorsement" in MVP?** Even without upvotes, some signal of peer validation could help. Defer to post-MVP?

### Resolved Decisions

- **Auth:** GitHub OAuth only for MVP. No email/password. This raises the quality bar and simplifies implementation.
- **Prompt blocks:** Support full markdown formatting. Allows code blocks for raw prompts and rich text for context.
- **WIP state:** No "work in progress" publishing state. Projects are either drafts (private, saved locally) or published (public, pending moderation review).
- **Private/unlisted projects:** Not supported in MVP. All published projects are public.

---

## 16. Recommended Post-MVP Roadmap

### Phase 2: Social Layer (Months 2-3)
- Comments on projects (structured: "question" / "suggestion" / "result" types)
- Follow builders
- Notifications (new projects from followed builders, forks of your project)
- Upvote / signal mechanism (lightweight, not Reddit-style karma)

### Phase 3: Discovery & Intelligence (Months 3-4)
- Full-text search across prompts, stacks, descriptions
- AI-powered recommendations ("similar projects", "related prompts")
- Auto-tagging from project content
- Collections / curated lists (admin and user-created)
- Weekly digest email

### Phase 4: GitHub Deep Integration (Months 4-5)
- Auto-import README summary
- Commit velocity / development timeline display
- Stack detection from repo languages and dependencies
- "Build journal" entries synced from releases or tagged commits

### Phase 5: Ecosystem (Months 5-8)
- API for embedding project cards externally
- Challenges / build-alongs (curated prompts, community builds)
- Builder reputation system
- Organization profiles
- Monetization exploration (featured placements, pro profiles, analytics for builders)

---

## 17. Prioritization: Must-Have / Should-Have / Later

### Must-Have (MVP Launch Blockers)

- [ ] Home / Discover page with project cards and filtering
- [ ] Project page with all structured sections
- [ ] Create Project multi-step guided form
- [ ] GitHub OAuth login
- [ ] Profile page with project list
- [ ] GitHub repo attachment (select repo, display metadata)
- [ ] Fork / Remix flow with lineage
- [ ] Image upload for screenshots
- [ ] Inline live demo (sandboxed iframe for uploaded HTML files)
- [ ] Video upload / embed (mp4 upload or YouTube/Loom URL)
- [ ] README display on project page (fetched from attached GitHub repo)
- [ ] Stack tag system (select + create)
- [ ] Manual moderation queue (approve/reject via Supabase)
- [ ] 20-30 seed projects at launch
- [ ] Mobile-responsive design
- [ ] Basic SEO (meta tags, OG images for project sharing)

### Should-Have (Ship Within 2 Weeks of Launch)

- [ ] Save as draft in Create flow
- [ ] Search by title and tags
- [ ] "Has metrics" / "Has GitHub repo" filters
- [ ] Demo link unfurling (thumbnail preview)
- [ ] Video embed (YouTube/Loom) on project page
- [ ] Edit project after publishing
- [ ] Trending algorithm (simple: forks + views in last 7 days)
- [ ] Sitemap generation for SEO

### Later (Post-MVP, Informed by Data)

- [ ] Comments
- [ ] Follow builders
- [ ] Notifications
- [ ] Upvotes / endorsements
- [ ] AI-powered recommendations
- [ ] Full-text search
- [ ] Collections / curated lists
- [ ] GitHub deep integration (README import, commit timeline)
- [ ] API / embeds
- [ ] Builder analytics dashboard
- [ ] Weekly digest emails
- [ ] Organization profiles
- [ ] Monetization features

---

*End of PRD. This document should be treated as a living artifact — update it as decisions are made and learnings emerge during implementation.*
