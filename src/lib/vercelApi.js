/**
 * Vercel API utilities for fetching deployed projects
 * Requires VERCEL_TOKEN in environment variables
 */

const VERCEL_API_BASE = "https://api.vercel.com";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional: for team projects

/**
 * Fetch all projects from Vercel
 * @param {number} limit - Maximum number of projects to fetch
 * @returns {Promise<Array>} Array of Vercel projects
 */
export async function fetchVercelProjects(limit = 100) {
  if (!VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN is not configured in environment variables");
  }

  try {
    const headers = {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Fetch all projects
    const url = new URL(`${VERCEL_API_BASE}/v9/projects`);
    if (VERCEL_TEAM_ID) {
      url.searchParams.append("teamId", VERCEL_TEAM_ID);
    }
    url.searchParams.append("limit", Math.min(limit, 100));

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || `Vercel API error: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Error fetching Vercel projects:", error);
    throw error;
  }
}

/**
 * Fetch deployments for a specific project
 * @param {string} projectId - Vercel project ID
 * @returns {Promise<Array>} Array of deployments
 */
export async function fetchProjectDeployments(projectId) {
  if (!VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN is not configured in environment variables");
  }

  try {
    const headers = {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    };

    const url = new URL(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}`
    );
    if (VERCEL_TEAM_ID) {
      url.searchParams.append("teamId", VERCEL_TEAM_ID);
    }
    url.searchParams.append("limit", 5); // Get last 5 deployments

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn(`Could not fetch deployments for project ${projectId}`);
      return [];
    }

    const data = await response.json();
    return data.deployments || [];
  } catch (error) {
    console.error(`Error fetching deployments for ${projectId}:`, error);
    return [];
  }
}

/**
 * Transform Vercel project data to portfolio format
 * @param {Object} vercelProject - Vercel project object
 * @param {Array} deployments - Project deployments
 * @returns {Object} Transformed project object
 */
export function transformVercelProject(vercelProject, deployments = []) {
  const latestDeployment = deployments[0];
  const createdAt = new Date(vercelProject.createdAt);
  const updatedAt = vercelProject.updatedAt
    ? new Date(vercelProject.updatedAt)
    : createdAt;

  // Extract technologies from framework or guess from common naming
  const framework = vercelProject.framework || "Next.js";
  const technologies = [framework, "Vercel", "JavaScript"];

  if (vercelProject.buildCommand?.includes("typescript")) {
    technologies.push("TypeScript");
  }

  return {
    id: vercelProject.id,
    name: vercelProject.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: [
      vercelProject.description || `A project built with ${framework}`,
      `Framework: ${framework} | Vercel deployment`,
      `Created: ${createdAt.toLocaleDateString()} | Updated: ${updatedAt.toLocaleDateString()}`,
    ],
    img: null, // Can be enhanced with custom metadata
    tech: technologies,
    framework: framework,
    source: vercelProject.link?.git?.url || vercelProject.gitRepository?.url || "#",
    demo: `https://${vercelProject.alias?.[0] || vercelProject.name}.vercel.app` ||
      vercelProject.productionDeploymentHostname,
    vercelUrl: latestDeployment
      ? `https://${latestDeployment.url}`
      : `https://${vercelProject.productionDeploymentHostname}`,
    featured: vercelProject.productionDeploymentHostname !== null,
    year: createdAt.getFullYear(),
    vercelProjectId: vercelProject.id,
    vercelTeamId: vercelProject.teamId,
    environment: "production",
    createdAt: vercelProject.createdAt,
    updatedAt: vercelProject.updatedAt,
  };
}

/**
 * Get combined metadata about Vercel projects
 * @param {Array} projects - Array of Vercel projects
 * @returns {Object} Metadata object
 */
export function getVercelMetadata(projects) {
  const frameworks = {};
  let totalProjects = projects.length;

  projects.forEach((project) => {
    const framework = project.framework || "Unknown";
    frameworks[framework] = (frameworks[framework] || 0) + 1;
  });

  return {
    totalProjects,
    frameworks,
    mostUsedFramework: Object.entries(frameworks).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown",
  };
}
