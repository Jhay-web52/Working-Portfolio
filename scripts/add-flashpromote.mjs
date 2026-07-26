/**
 * Approves flashpromote1 (Joel's flagship SaaS project) on the live portfolio
 * via the admin API, and marks it as explicitly featured so it doesn't depend
 * on the stargazers_count > 5 heuristic (flashpromote1 is a private repo with
 * no public stars).
 *
 * Run from the project root:
 *   node --env-file=.env.local scripts/add-flashpromote.mjs
 */

const BASE_URL = "https://joeloguntade.vercel.app";
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("Missing ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const APPROVAL = {
  repoName: "flashpromote1",
  description:
    "Full stack influencer-marketing SaaS with dual-role dashboards for brands and influencers. Stripe handles payments, Resend sends transactional email, and Supabase powers auth, storage, and real-time data — Joel's flagship project.",
  demoUrl: "https://flashpromote1.vercel.app",
  featured: true,
};

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

  const result = await adminPost(cookie, { action: "approve", ...APPROVAL });
  if (result.success) {
    console.log(`  ✓ Approved: ${APPROVAL.repoName} (featured: ${APPROVAL.featured})`);
  } else {
    console.log(`  ✗ Failed:  ${APPROVAL.repoName} — ${result.error}`);
    process.exit(1);
  }

  console.log("\nDone. Visit https://joeloguntade.vercel.app to see it live.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
