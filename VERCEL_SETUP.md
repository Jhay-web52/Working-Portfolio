# Vercel API Integration Setup Guide

This guide explains how to set up the Vercel API integration to automatically fetch your deployed projects into your portfolio.

## Overview

The portfolio now supports fetching projects from multiple sources:

1. **Vercel API** (Primary) - Automatically fetches all your deployed projects from Vercel
2. **GitHub API** (Fallback) - Falls back to GitHub repositories if Vercel is not configured

## Setup Steps

### Step 1: Get Your Vercel API Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your profile icon → **Settings**
3. Navigate to **Tokens** section
4. Click **Create Token**
5. Give it a descriptive name (e.g., "Portfolio API")
6. Set expiration (recommended: no expiration)
7. Copy the token

### Step 2: (Optional) Get Your Vercel Team ID

If you want to fetch team projects:

1. Go to your team settings on Vercel
2. Look for the Team ID in the URL or team settings page
3. It will look like: `tm_xxxxxxxxxxxxx`

### Step 3: Configure Environment Variables

Create or update your `.env.local` file with:

```env
# Required for Vercel projects
VERCEL_TOKEN=your_copied_token_here

# Optional: for team projects
VERCEL_TEAM_ID=your_team_id_here

# GitHub fallback (recommended to keep)
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=your_github_token_here
```

### Step 4: Test the Integration

Once configured, restart your development server:

```bash
npm run dev
```

Then test the API endpoint:

```bash
# Fetch from Vercel only
curl "http://localhost:3000/api/projects?source=vercel"

# Fetch from GitHub only
curl "http://localhost:3000/api/projects?source=github"

# Fetch from both (default)
curl "http://localhost:3000/api/projects?source=both"

# With limit parameter
curl "http://localhost:3000/api/projects?source=vercel&limit=10"
```

## API Endpoint Reference

### GET `/api/projects`

Fetches projects from configured sources.

**Query Parameters:**

| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| source    | string | "both"  | "vercel", "github", or "both"  |
| limit     | number | 100     | Maximum projects to return     |

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "id": "project-id",
      "name": "Project Name",
      "description": ["desc1", "desc2", "desc3"],
      "img": null,
      "tech": ["Next.js", "Vercel", "JavaScript"],
      "framework": "next",
      "source": "https://github.com/...",
      "demo": "https://project.vercel.app",
      "vercelUrl": "https://deployment-url.vercel.app",
      "featured": true,
      "year": 2024,
      "vercelProjectId": "project-id",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 100,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "sources": ["Vercel API"],
  "metadata": {
    "vercel": {
      "totalProjects": 5,
      "frameworks": { "next": 3, "react": 2 }
    }
  }
}
```

## Features

### Vercel Data Includes:

- ✅ Project name and description
- ✅ Framework information (Next.js, React, etc.)
- ✅ Creation and update timestamps
- ✅ Production deployment URLs
- ✅ GitHub repository links (when connected to Vercel)
- ✅ Project metadata (team ID, environment)

### GitHub Fallback:

- Falls back automatically if Vercel is not configured
- Provides repository stars, watchers, and forks
- Includes language information
- Filters archived repositories

## Automatic Caching

The API implements automatic caching:

- **Vercel projects**: Cached for 1 hour
- **Deployments**: Cached for 30 minutes
- **GitHub repos**: Cached for 1 hour

This reduces API calls and improves response times.

## Troubleshooting

### "VERCEL_TOKEN is not configured"

**Solution:** Make sure your `.env.local` file has `VERCEL_TOKEN` set with a valid token.

### Projects not showing up

1. Verify the token is correct in Vercel dashboard
2. Check that projects exist and are deployed
3. Look at server logs: `npm run dev` output
4. Try the GitHub fallback: `?source=github`

### Getting rate limited

- GitHub API has rate limits (60 requests/hour unauthenticated, 5000/hour authenticated)
- Vercel has rate limits on free tier
- Add tokens to increase limits

### Wrong framework detected

The integration tries to auto-detect frameworks from Vercel's data. If incorrect:

1. Update project details in Vercel dashboard
2. Or manually map projects using the static list fallback

## Advanced Usage

### Switch to Vercel Only

Modify [Projects.jsx](../../src/components/Projects.jsx) to use:

```javascript
const response = await fetch("/api/projects?source=vercel");
```

### Combine with Static List

You can still use the static `ProjectList` from `constants/ProjectList.js` and combine it with API data:

```javascript
const [projects, setProjects] = useState([]);

useEffect(() => {
  const fetchProjects = async () => {
    const response = await fetch("/api/projects?source=vercel");
    const data = await response.json();
    
    // Combine with static list
    const combinedProjects = [...data.data, ...ProjectList];
    setProjects(combinedProjects);
  };
  
  fetchProjects();
}, []);
```

### Filter by Framework

```javascript
const nextProjects = projects.filter(p => p.framework === 'next');
```

### Sort by Date

```javascript
const sortedProjects = projects.sort((a, b) => 
  new Date(b.updatedAt) - new Date(a.updatedAt)
);
```

## Security Notes

- ✅ `VERCEL_TOKEN` should be in `.env.local` (not committed to git)
- ✅ Token is only used server-side in the API route
- ✅ Client-side code never exposes the token
- ✅ Use `.env.local` in your `.gitignore`

## Related Files

- [vercelApi.js](../../src/lib/vercelApi.js) - Vercel utilities and API wrapper
- [route.js](../../src/app/api/projects/route.js) - Projects API endpoint
- [Projects.jsx](../../src/components/Projects.jsx) - Component that fetches projects
- [.env.example](.env.example) - Environment variables template

## Next Steps

1. Set up your Vercel token
2. Restart the dev server
3. Test the API endpoint
4. Monitor server logs for any issues
5. (Optional) Customize project display in Projects.jsx

For more information about Vercel API, visit: https://vercel.com/docs/rest-api
