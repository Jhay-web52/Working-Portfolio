/**
 * Aggregates the live numbers shown in StatsStrip.
 * Runs server-side only — every fetch here is cached via Next.js's fetch
 * cache (`next: { revalidate }`), so this never hits the network on every
 * page load, only once per revalidation window.
 */

import { fetchVercelProjects } from "@/lib/vercelApi";
import { loadApprovedProjects } from "@/lib/approvedProjectsStore";

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Jhay-web52";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Earliest role in the timeline (see ExperienceWrapper.jsx — Jhayfx Trading
// Academy, 2024). Years Experience is derived from this so it never needs a
// manual bump.
const EXPERIENCE_START_YEAR = 2024;

const FALLBACK_STATS = {
  yearsExperience: 1,
  projectsBuilt: 9,
  companies: 2,
  technologies: 20,
};

async function fetchGitHubPublicRepoCount() {
  try {
    const headers = { Accept: "application/vnd.github.v3+json" };
    if (GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`;

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    return typeof data.public_repos === "number" ? data.public_repos : null;
  } catch (error) {
    console.error("Error fetching GitHub public repo count:", error);
    return null;
  }
}

async function fetchProjectsBuiltCount() {
  // Prefer the live count of projects actually deployed on Vercel.
  try {
    const projects = await fetchVercelProjects();
    if (Array.isArray(projects) && projects.length > 0) {
      return projects.length;
    }
  } catch {
    // VERCEL_TOKEN likely isn't configured — fall through to the next source.
  }

  // Fall back to the curated/approved project list — the same source of
  // truth the Projects section itself reads from.
  try {
    const approved = await loadApprovedProjects();
    if (Array.isArray(approved) && approved.length > 0) {
      return approved.length;
    }
  } catch (error) {
    console.error("Error loading approved projects for stats:", error);
  }

  return null;
}

function computeYearsExperience() {
  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;
  return Math.max(years, 1);
}

export async function getPortfolioStats() {
  const [projectsBuilt, publicRepoCount] = await Promise.all([
    fetchProjectsBuiltCount(),
    fetchGitHubPublicRepoCount(),
  ]);

  return {
    yearsExperience: computeYearsExperience(),
    projectsBuilt:
      projectsBuilt ?? publicRepoCount ?? FALLBACK_STATS.projectsBuilt,
    companies: FALLBACK_STATS.companies,
    technologies: FALLBACK_STATS.technologies,
  };
}
