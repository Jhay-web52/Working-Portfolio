import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(input) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function timingSafeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    ""
  );
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function signAdminSession({ maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS } = {}) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET (recommended) or ADMIN_PASSWORD (fallback)"
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

  return `${payloadB64}.${sig}`;
}

export function verifyAdminSession(token) {
  if (!token || typeof token !== "string") return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

  if (!timingSafeEqual(sig, expectedSig)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.exp || typeof payload.exp !== "number") return false;
    if (now >= payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function isAdminRequestAuthorized(request) {
  try {
    const cookie = request?.cookies?.get?.(COOKIE_NAME);
    const token = cookie?.value;
    return verifyAdminSession(token);
  } catch {
    return false;
  }
}
