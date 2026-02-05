import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminPassword,
  signAdminSession,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const { password } = await request.json();
    const expectedPassword = getAdminPassword();

    if (!expectedPassword) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ADMIN_PASSWORD is not configured on the server (set it in .env.local / Vercel env vars)",
        },
        { status: 500 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = signAdminSession();
    const res = NextResponse.json({ success: true });

    res.cookies.set({
      name: getAdminCookieName(),
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
