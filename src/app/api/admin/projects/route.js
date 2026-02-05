/**
 * Admin API for managing project approvals
 * Stores approved projects in persistent KV (falls back to /approved-projects.json in local dev)
 * Endpoints:
 * - GET /api/admin/projects - List all projects with approval status
 * - POST /api/admin/projects - Approve/disapprove a project
 */

import {
  loadApprovedProjects,
  saveApprovedProjects,
} from "@/lib/approvedProjectsStore";

import { isAdminRequestAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Jhay-web52";

/**
 * Fetch all projects from GitHub
 */
async function fetchAllGitHubProjects() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

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
    .map((repo) => ({
      id: repo.id,
      name: repo.name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      repoName: repo.name,
      description: repo.description || "No description",
      language: repo.language || "No language specified",
      private: repo.private,
      stars: repo.stargazers_count,
      url: repo.html_url,
      homepage: repo.homepage || "",
      approved: false,
    }));
}

export async function GET(request) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await fetchAllGitHubProjects();
    const approvedList = await loadApprovedProjects();

    // Mark approved projects and attach custom descriptions (case-insensitive)
    const projectsWithStatus = projects.map((project) => {
      const approvedItem = approvedList.find(item => {
        const itemRepoName = typeof item === 'string' ? item : item.repoName;
        return itemRepoName && itemRepoName.toLowerCase() === project.repoName.toLowerCase();
      });
      
      return {
        ...project,
        approved: !!approvedItem,
        customDescription: typeof approvedItem === 'object' ? approvedItem.description : null,
        customDemoUrl: typeof approvedItem === 'object' ? approvedItem.demoUrl : null
      };
    });

    return Response.json({
      success: true,
      data: projectsWithStatus,
      approvedProjects: approvedList,
      totalProjects: projectsWithStatus.length,
      approvedCount: projectsWithStatus.filter((p) => p.approved).length,
    });
  } catch (error) {
    console.error("Admin projects error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, repoName, description, demoUrl } = body;

    if (!action || !repoName) {
      return Response.json(
        {
          success: false,
          error: "Missing action or repoName",
        },
        { status: 400 }
      );
    }

    let approvedList = await loadApprovedProjects();
    let updated = false;

    // Convert old string array to object array if needed
    approvedList = approvedList.map(item => 
      typeof item === 'string' ? { repoName: item, description: "", demoUrl: "" } : item
    );

    if (action === "approve") {
      const existingIndex = approvedList.findIndex(p => p.repoName.toLowerCase() === repoName.toLowerCase());
      if (existingIndex > -1) {
        // Update existing fields if provided
        if (description !== undefined) {
          approvedList[existingIndex].description = description;
          updated = true;
        }
        if (demoUrl !== undefined) {
          approvedList[existingIndex].demoUrl = demoUrl;
          updated = true;
        }
      } else {
        approvedList.push({ 
          repoName, 
          description: description || "", 
          demoUrl: demoUrl || "" 
        });
        updated = true;
      }
    } else if (action === "disapprove") {
      const initialLength = approvedList.length;
      approvedList = approvedList.filter(p => p.repoName.toLowerCase() !== repoName.toLowerCase());
      if (approvedList.length !== initialLength) {
        updated = true;
      }
    } else {
      return Response.json(
        {
          success: false,
          error: "Invalid action. Use 'approve' or 'disapprove'",
        },
        { status: 400 }
      );
    }

    if (updated) {
      const saved = await saveApprovedProjects(approvedList);
      return Response.json({
        success: saved,
        message: `Project "${repoName}" ${action}ed successfully`,
        approvedProjects: approvedList,
      });
    }

    return Response.json({
      success: true,
      message: `Project "${repoName}" already in that state`,
      approvedProjects: approvedList,
    });
  } catch (error) {
    console.error("Admin POST error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to update project approval",
      },
      { status: 500 }
    );
  }
}
