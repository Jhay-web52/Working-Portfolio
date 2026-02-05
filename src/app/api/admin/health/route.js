import { isAdminRequestAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function bool(value) {
  return !!value;
}

export async function GET(request) {
  if (!isAdminRequestAuthorized(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const anyRedisUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_URL ||
    process.env.REDIS_REST_URL ||
    process.env.REDIS_URL;

  const anyRedisToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.KV_REST_API_READ_ONLY_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_TOKEN ||
    process.env.REDIS_REST_TOKEN ||
    process.env.REDIS_TOKEN;

  const hasKvUrl = bool(anyRedisUrl);
  const hasKvReadToken = bool(
    process.env.KV_REST_API_READ_ONLY_TOKEN ||
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.UPSTASH_REDIS_TOKEN ||
      process.env.REDIS_REST_TOKEN ||
      process.env.REDIS_TOKEN
  );
  const hasKvWriteToken = bool(
    process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.UPSTASH_REDIS_TOKEN ||
      process.env.REDIS_REST_TOKEN ||
      process.env.REDIS_TOKEN
  );

  return Response.json({
    success: true,
    env: {
      nodeEnv: process.env.NODE_ENV || "",
      vercel: bool(process.env.VERCEL),
    },
    github: {
      hasToken: bool(process.env.GITHUB_TOKEN),
      username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "",
    },
    kv: {
      hasUrl: hasKvUrl,
      canRead: hasKvUrl && hasKvReadToken,
      canWrite: hasKvUrl && hasKvWriteToken,
      provider: process.env.KV_REST_API_URL
        ? "vercel-kv"
        : (process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_URL)
          ? "upstash"
          : process.env.REDIS_URL
            ? "redis-url"
            : process.env.REDIS_REST_URL
              ? "redis-rest"
          : "none",
      debug: {
        hasAnyUrl: bool(anyRedisUrl),
        hasAnyToken: bool(anyRedisToken),
      },
    },
  });
}
