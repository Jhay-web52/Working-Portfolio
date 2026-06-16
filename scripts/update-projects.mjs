/**
 * One-time script to clean up approved projects in Redis KV.
 * - Removes: SunnySide, Scissors-Landing-Page, __smoke_test__
 * - Deduplicates Blog-Application
 * - Rewrites all descriptions with real, specific copy
 *
 * Run from the project root:
 *   node --env-file=.env.local scripts/update-projects.mjs
 */

// Normalise Upstash env vars
if (!process.env.KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_URL) {
  process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
}
if (!process.env.KV_REST_API_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN) {
  process.env.KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
}

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error("Missing KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_* equivalents).");
  console.error("Make sure you're running: node --env-file=.env.local scripts/update-projects.mjs");
  process.exit(1);
}

const { Redis } = await import("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KV_KEY = "portfolio:approved-projects";

// Projects to remove entirely
const REMOVE_LIST = [
  "sunnyshade",
  "sunny-landing",
  "sunnyside",         // repo is actually "SunnySide"
  "scissors-landing",
  "scissors-landing-page", // repo is actually "Scissors-Landing-Page"
  "__smoke_test__",
];

// Custom descriptions keyed by lowercase repo name.
// Write "what it does" + "how it was built" — no boilerplate.
const DESCRIPTIONS = {
  "jhayfx": {
    description: "Landing page for JhayFx, a trading education brand — showcases course tiers, signal service plans, and a community CTA. Built with HTML, CSS, and TypeScript with a conversion-focused layout and smooth scroll interactions.",
    demoUrl: "https://jhayfx.vercel.app",
  },
  "cinavault": {
    description: "Movie discovery app powered by the TMDB API — browse trending films, search by title, and view ratings and cast details. Built with vanilla JavaScript with live API calls and dynamic DOM rendering.",
    demoUrl: "https://movie-list-mauve-pi.vercel.app",
  },
  "e-commerce": {
    description: "E-commerce storefront built in TypeScript — browse products by category, manage a live cart, and step through a multi-stage checkout. Type-safe component design keeps the shopping flow reliable from browsing to order confirmation.",
    demoUrl: "https://ecommercequickserve.vercel.app",
  },
  "blog-application": {
    description: "Blog platform built with Vue.js — readers can browse and filter posts by category with a clean reading layout. Uses Vue Router for page navigation and reactive computed properties for instant filtering without reloads.",
    demoUrl: "https://blog-application-gamma-seven.vercel.app",
  },
  "markdown-preview": {
    description: "Live markdown editor built with Vue.js and TypeScript — write on the left, see a fully rendered preview on the right in real time. Supports headings, code blocks, lists, links, and inline formatting.",
    demoUrl: "https://markdown-preview-five.vercel.app",
  },
  "codeflow-ai": {
    description: "AI-powered code assistant that takes natural language prompts and returns generated, explained, or debugged code snippets. Built with vanilla JavaScript around an LLM API with a clean split-pane input/output interface.",
    demoUrl: "https://codeflow-ai-zeta.vercel.app",
  },
  "bejama-react": {
    description: "React e-commerce UI with product listing, live cart management, and a checkout flow. Demonstrates practical React patterns — component state, prop drilling, and conditional rendering — in a realistic shopping experience.",
    demoUrl: "https://bejama-react.vercel.app",
  },
  "chuks-kitchen": {
    description: "Freelance client project — a restaurant website with an interactive menu, gallery, and contact form. Built mobile-first with HTML, CSS, and JavaScript, featuring smooth scroll behaviour and a clean food-brand aesthetic.",
    demoUrl: "https://chuks-blond.vercel.app",
  },
};

async function main() {
  // 1. Read current state from Redis
  console.log("Reading current approved projects from Redis...\n");
  const raw = await redis.get(KV_KEY);

  let current = [];
  if (Array.isArray(raw)) {
    current = raw;
  } else if (typeof raw === "string") {
    current = JSON.parse(raw);
  }

  console.log(`Found ${current.length} projects in Redis:`);
  current.forEach((p) => {
    const name = typeof p === "string" ? p : p.repoName;
    console.log(`  - ${name}`);
  });

  // 2. Normalise to object format
  const normalised = current.map((item) =>
    typeof item === "string"
      ? { repoName: item, description: "", demoUrl: "" }
      : item
  );

  // 3. Remove unwanted projects (case-insensitive)
  const filtered = normalised.filter((p) => {
    const key = p.repoName.toLowerCase();
    return !REMOVE_LIST.includes(key);
  });

  // 4. Deduplicate by lowercase repo name (keep last occurrence wins — but we want the one with demoUrl)
  const seen = new Map();
  for (const p of filtered) {
    const key = p.repoName.toLowerCase();
    const existing = seen.get(key);
    if (!existing || (!existing.demoUrl && p.demoUrl)) {
      seen.set(key, p);
    }
  }
  const deduped = Array.from(seen.values());

  // 5. Apply new descriptions
  const updated = deduped.map((p) => {
    const key = p.repoName.toLowerCase();
    const override = DESCRIPTIONS[key];
    if (override) {
      return { repoName: p.repoName, ...override };
    }
    return p;
  });

  // 6. Preview changes
  console.log(`\nRemoved ${current.length - updated.length} project(s).`);
  console.log(`\nNew approved list (${updated.length} projects):`);
  updated.forEach((p) => {
    const hasDesc = p.description ? "✓ desc" : "✗ no desc";
    const hasDemo = p.demoUrl ? "✓ demo" : "✗ no demo";
    console.log(`  ${p.repoName.padEnd(20)} ${hasDesc}  ${hasDemo}`);
  });

  // 7. Write back to Redis
  console.log("\nWriting to Redis...");
  await redis.set(KV_KEY, updated);
  console.log("Done. Redeploy or wait for cache to expire to see changes live.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
