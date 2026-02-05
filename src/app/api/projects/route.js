/**
 * Fetch GitHub projects with approval system
 * Reads approved projects from persistent KV (falls back to approved-projects.json in local dev)
 * 
 * Environment variables:
 * - NEXT_PUBLIC_GITHUB_USERNAME: GitHub username for fetching repositories
 * - GITHUB_TOKEN: Optional GitHub token for higher rate limits
 */

import { loadApprovedProjects } from "@/lib/approvedProjectsStore";
import { isAdminRequestAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Jhay-web52";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function isLikelyLiveSiteUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (!url.startsWith("http")) return false;

  // A GitHub repository URL is not a live demo.
  if (url.includes("github.com")) return false;

  return true;
}

function pickDemoUrl(customDemoUrl, repoHomepage) {
  if (isLikelyLiveSiteUrl(customDemoUrl)) return customDemoUrl;
  if (isLikelyLiveSiteUrl(repoHomepage)) return repoHomepage;
  return null;
}

/**
 * Fetch approved projects from the KV/file-backed store
 */

/**
 * Map repo names to dynamic screenshot
 */
function getProjectImage(repoName, homepage, fullName) {
  // 1. Try to generate screenshot of homepage if it exists
  if (homepage && homepage.startsWith("http") && !homepage.includes("github.com")) {
    return `https://v1.screenshot.11ty.dev/${encodeURIComponent(homepage)}/large/`;
  }
  
  // 2. Fallback to GitHub OpenGraph image
  if (fullName) {
    return `https://opengraph.githubassets.com/1/${fullName}`;
  }
  
  // 3. Ultimate fallback to portfolio screenshot
  return "/assets/projects/jhayfx.png";
}

/**
 * Fetch projects from GitHub API
 */
async function fetchGitHubProjects(limit, approvedItems) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  // Use a high limit for "unlimited" feel, GitHub max per page is 100.
  // If we have a token, use the authenticated endpoint so private repos can be included
  // (this keeps public + admin lists consistent when you approve a private repo).
  const githubUrl = GITHUB_TOKEN
    ? `https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner`
    : `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`;

  const reposResponse = await fetch(githubUrl, {
    headers,
    cache: "no-store",
  });

  if (!reposResponse.ok) {
    const errorData = await reposResponse.json();
    throw new Error(
      errorData.message || `GitHub API error: ${reposResponse.statusText}`
    );
  }

  const repos = await reposResponse.json();

  return repos
    .filter((repo) => !repo.archived)
    .slice(0, limit)
    .map((repo) => {
      // Find custom info from approved list (case-insensitive)
      // We look for the best match (favoring entries with descriptions)
      const allMatches = approvedItems.filter(item => {
        const itemRepoName = typeof item === 'string' ? item : item.repoName;
        return itemRepoName && itemRepoName.toLowerCase() === repo.name.toLowerCase();
      });
      
      const approvedEntry = allMatches.find(m => typeof m === 'object' && m.description) || allMatches[0];
      
      const customDesc = typeof approvedEntry === 'object' ? approvedEntry.description : null;
      const customDemo = typeof approvedEntry === 'object' ? approvedEntry.demoUrl : null;
      const demoUrl = pickDemoUrl(customDemo, repo.homepage);

      return {
        id: repo.id,
        name: repo.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        repoName: repo.name,
        description: customDesc ? [customDesc] : [
          repo.description || `A project by ${GITHUB_USERNAME}`,
          `Built with modern technologies and best practices. Language: ${
            repo.language || "Multi-language"
          }`,
          `Stars: ${repo.stargazers_count} | Watchers: ${repo.watchers_count} | Forks: ${repo.forks_count}`,
        ],
        img: getProjectImage(repo.name, demoUrl, repo.full_name),
        tech: repo.language ? [repo.language] : ["JavaScript"],
        category: repo.topics?.length > 0 ? repo.topics[0] : "Development",
        source: repo.html_url,
        // Only expose a Live Demo when we have a real website URL.
        demo: demoUrl,
        featured: repo.stargazers_count > 5,
        year: new Date(repo.created_at).getFullYear(),
        source_type: "GitHub",
      };
    });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "1000"); // High limit for "unlimited"
    const isAdmin = isAdminRequestAuthorized(request);
    const includeUnapproved =
      searchParams.get("includeUnapproved") === "true" && isAdmin;

    const approvedList = await loadApprovedProjects();
    const projects = await fetchGitHubProjects(limit, approvedList);

    // Add approval status to projects (case-insensitive)
    const projectsWithApproval = projects.map((project) => ({
      ...project,
      approved: approvedList.some(item => {
        const itemRepoName = typeof item === 'string' ? item : item.repoName;
        return itemRepoName.toLowerCase() === project.repoName.toLowerCase();
      }),
    }));

    // Filter by approval status if not requesting all
    const filteredProjects = includeUnapproved
      ? projectsWithApproval
      : projectsWithApproval.filter((p) => p.approved);

    const publicStats = {
      approvedProjects: filteredProjects.length,
    };

    const adminStats = {
      totalProjects: projects.length,
      approvedProjects: projectsWithApproval.filter((p) => p.approved).length,
      unapprovedProjects: projectsWithApproval.filter((p) => !p.approved).length,
    };

    return Response.json({
      success: true,
      data: filteredProjects,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: filteredProjects.length,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      source: "GitHub API",
      username: GITHUB_USERNAME,
      stats: isAdmin ? adminStats : publicStats,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Projects API error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch projects from GitHub",
      },
      { status: 500 }
    );
  }
}
