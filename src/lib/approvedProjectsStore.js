import { promises as fs } from "fs";
import { join } from "path";

const KV_KEY = "portfolio:approved-projects";
const FILE_PATH = join(process.cwd(), "approved-projects.json");

function normalizeKvEnv() {
  // New Vercel Redis integrations often provide UPSTASH_* vars.
  // @vercel/kv expects KV_* vars. Map them if needed.
  if (!process.env.KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_URL) {
    process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL;
  }

  if (!process.env.KV_REST_API_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN) {
    process.env.KV_REST_API_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  if (
    !process.env.KV_REST_API_READ_ONLY_TOKEN &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    process.env.KV_REST_API_READ_ONLY_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  }
}

async function getKvClient() {
  normalizeKvEnv();
  const mod = await import("@vercel/kv");
  return mod.kv;
}

function hasKvRead() {
  return (
    (!!process.env.KV_REST_API_URL || !!process.env.UPSTASH_REDIS_REST_URL) &&
    (
      !!process.env.KV_REST_API_READ_ONLY_TOKEN ||
      !!process.env.KV_REST_API_TOKEN ||
      !!process.env.UPSTASH_REDIS_REST_TOKEN
    )
  );
}

function hasKvWrite() {
  return (
    (!!process.env.KV_REST_API_URL || !!process.env.UPSTASH_REDIS_REST_URL) &&
    (!!process.env.KV_REST_API_TOKEN || !!process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function readFromFile() {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeToFile(list) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving approved projects to file:", error);
    return false;
  }
}

export async function loadApprovedProjects() {
  // Prefer KV in production so approvals persist across deployments.
  if (hasKvRead()) {
    try {
      const kv = await getKvClient();
      const value = await kv.get(KV_KEY);

      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      }

      // If KV is empty, optionally seed from file (useful on first deploy).
      if (value == null) {
        const fileList = await readFromFile();
        if (fileList.length > 0 && hasKvWrite()) {
          try {
            const kv = await getKvClient();
            await kv.set(KV_KEY, fileList);
          } catch (seedError) {
            console.error("KV seed error:", seedError);
          }
        }
        return fileList;
      }

      return [];
    } catch (error) {
      console.error("Error loading approved projects from KV:", error);
      // Fall back to file if KV is misconfigured.
      return await readFromFile();
    }
  }

  // Local dev fallback.
  return await readFromFile();
}

export async function saveApprovedProjects(list) {
  if (!Array.isArray(list)) {
    throw new Error("saveApprovedProjects expected an array");
  }

  if (hasKvWrite()) {
    try {
      const kv = await getKvClient();
      await kv.set(KV_KEY, list);
      return true;
    } catch (error) {
      console.error("Error saving approved projects to KV:", error);
      // If KV write fails, still attempt file write for local/dev.
      return await writeToFile(list);
    }
  }

  // Local dev fallback.
  return await writeToFile(list);
}
