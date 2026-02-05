import { promises as fs } from "fs";
import { join } from "path";

const KV_KEY = "portfolio:approved-projects";
const FILE_PATH = join(process.cwd(), "approved-projects.json");

let redisClientPromise;

function normalizeKvEnv() {
  // Only map REST-based Upstash variables.
  // NOTE: A generic `REDIS_URL=redis://...` is NOT compatible with @vercel/kv.
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
    process.env.KV_REST_API_READ_ONLY_TOKEN =
      process.env.UPSTASH_REDIS_REST_TOKEN;
  }
}

async function getKvClient() {
  normalizeKvEnv();
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    throw new Error("Missing REDIS_URL");
  }

  if (!redisClientPromise) {
    redisClientPromise = (async () => {
      const { createClient } = await import("redis");
      const client = createClient({ url: process.env.REDIS_URL });
      client.on("error", (err) => {
        console.error("Redis client error:", err);
      });
      await client.connect();
      return client;
    })();
  }

  return redisClientPromise;
}

function hasKvRead() {
  normalizeKvEnv();
  return (
    !!process.env.KV_REST_API_URL &&
    (
      !!process.env.KV_REST_API_READ_ONLY_TOKEN ||
      !!process.env.KV_REST_API_TOKEN
    )
  );
}

function hasKvWrite() {
  normalizeKvEnv();
  return (
    !!process.env.KV_REST_API_URL &&
    !!process.env.KV_REST_API_TOKEN
  );
}

function hasRedisUrl() {
  return !!process.env.REDIS_URL;
}

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || !!process.env.VERCEL;
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
  // If a standard REDIS_URL is provided (redis://...), use it.
  // This is common with non-Upstash Redis providers.
  if (hasRedisUrl()) {
    try {
      const client = await getRedisClient();
      const value = await client.get(KV_KEY);
      if (!value) return [];
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error loading approved projects from Redis:", error);
      return await readFromFile();
    }
  }

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

  // If a standard REDIS_URL is provided, write there.
  if (hasRedisUrl()) {
    try {
      const client = await getRedisClient();
      await client.set(KV_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      console.error("Error saving approved projects to Redis:", error);
      if (isProductionRuntime()) {
        throw new Error(
          "Redis write failed. Verify REDIS_URL is set correctly in Vercel (Production) and redeploy."
        );
      }
      return await writeToFile(list);
    }
  }

  // In serverless production, filesystem writes are not reliable.
  // If KV is configured only for reads, fail loudly with a clear message.
  if (hasKvRead() && !hasKvWrite() && isProductionRuntime()) {
    throw new Error(
      "KV/Redis is configured read-only. Set KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_TOKEN) for write access."
    );
  }

  if (hasKvWrite()) {
    try {
      const kv = await getKvClient();
      await kv.set(KV_KEY, list);
      return true;
    } catch (error) {
      console.error("Error saving approved projects to KV:", error);

      // In production, don't pretend filesystem persistence will work.
      if (isProductionRuntime()) {
        throw new Error(
          "KV/Redis write failed. Verify your KV/Upstash URL+token and that the Storage is connected to this Vercel project."
        );
      }

      // Local/dev fallback.
      return await writeToFile(list);
    }
  }

  // Local dev fallback.
  return await writeToFile(list);
}
