/**
 * Updates approved projects on the live portfolio via the admin API.
 * - Removes: SunnySide, Scissors-Landing-Page, __smoke_test__, duplicate Blog-Application
 * - Rewrites descriptions for the remaining 8 projects
 *
 * Run from the project root:
 *   node --env-file=.env.local scripts/update-projects.mjs
 */

const BASE_URL = "https://joeloguntade.vercel.app";
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("Missing ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

// Projects to remove
const REMOVE = [
  "SunnySide",
  "Scissors-Landing-Page",
  "sunny-landing",
  "scissors-landing",
  "__smoke_test__",
];

// Projects to update with real descriptions (repoName must match GitHub exactly, case-insensitively)
const UPDATES = [
  {
    repoName: "E-commerce",
    description:
      "E-commerce storefront built in TypeScript — browse products by category, manage a live cart, and step through a multi-stage checkout. Type-safe component design keeps the shopping flow reliable from browsing to order confirmation.",
    demoUrl: "https://ecommercequickserve.vercel.app",
  },
  {
    repoName: "Bejama-React",
    description:
      "React e-commerce UI with product listing, live cart management, and a checkout flow. Demonstrates practical React patterns — component state, prop drilling, and conditional rendering — in a realistic shopping experience.",
    demoUrl: "https://bejama-react.vercel.app",
  },
  {
    repoName: "CodeFlow-AI",
    description:
      "AI-powered code assistant that takes natural language prompts and returns generated, explained, or debugged code snippets. Built with vanilla JavaScript around an LLM API with a clean split-pane input/output interface.",
    demoUrl: "https://codeflow-ai-zeta.vercel.app",
  },
  {
    repoName: "Markdown-Preview",
    description:
      "Live markdown editor built with Vue.js and TypeScript — write on the left, see a fully rendered preview on the right in real time. Supports headings, code blocks, lists, links, and inline formatting.",
    demoUrl: "https://markdown-preview-five.vercel.app",
  },
  {
    repoName: "CinaVault",
    description:
      "Movie discovery app powered by the TMDB API — browse trending films, search by title, and view ratings and cast details. Built with vanilla JavaScript with live API calls and dynamic DOM rendering.",
    demoUrl: "https://movie-list-mauve-pi.vercel.app",
  },
  {
    repoName: "Blog-Application",
    description:
      "Blog platform built with Vue.js — readers can browse and filter posts by category with a clean reading layout. Uses Vue Router for page navigation and reactive computed properties for instant filtering without reloads.",
    demoUrl: "https://blog-application-gamma-seven.vercel.app",
  },
  {
    repoName: "JhayFx",
    description:
      "Landing page for JhayFx, a trading education brand — showcases course tiers, signal service plans, and a community CTA. Built with HTML, CSS, and TypeScript with a conversion-focused layout and smooth scroll interactions.",
    demoUrl: "https://jhayfx.vercel.app",
  },
  {
    repoName: "chuks-kitchen",
    description:
      "Freelance client project — a restaurant website with an interactive menu, gallery, and contact form. Built mobile-first with HTML, CSS, and JavaScript, featuring smooth scroll behaviour and a clean food-brand aesthetic.",
    demoUrl: "https://chuks-blond.vercel.app",
  },
];

async function login() {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: PASSWORD }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(`Login failed: ${data.error || res.statusText}`);
  }
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) throw new Error("No session cookie returned from login");
  // Extract the cookie value (format: admin_session=<token>; ...)
  const match = setCookie.match(/admin_session=([^;]+)/);
  if (!match) throw new Error("Could not parse admin_session cookie");
  return `admin_session=${match[1]}`;
}

async function adminPost(cookie, body) {
  const res = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function main() {
  console.log("Logging in to admin API...");
  const cookie = await login();
  console.log("Authenticated.\n");

  // Remove unwanted projects
  for (const repoName of REMOVE) {
    const result = await adminPost(cookie, { action: "disapprove", repoName });
    if (result.success) {
      console.log(`  ✗ Removed: ${repoName}`);
    } else if (result.message?.includes("already in that state")) {
      console.log(`  - Skipped (not found): ${repoName}`);
    } else {
      console.log(`  ? ${repoName}: ${result.message || result.error}`);
    }
  }

  console.log("");

  // Update descriptions
  for (const { repoName, description, demoUrl } of UPDATES) {
    const result = await adminPost(cookie, {
      action: "approve",
      repoName,
      description,
      demoUrl,
    });
    if (result.success) {
      console.log(`  ✓ Updated: ${repoName}`);
    } else {
      console.log(`  ✗ Failed:  ${repoName} — ${result.error}`);
    }
  }

  console.log("\nDone. Visit https://joeloguntade.vercel.app to see changes live.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
