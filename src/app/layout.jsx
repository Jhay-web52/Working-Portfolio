import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLoaderCleanup from "@/components/ClientLoaderCleanup";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://joeloguntade.vercel.app"),
  title: {
    default: "Joel Oguntade | Frontend Developer",
    template: "%s | Joel Oguntade",
  },
  description:
    "Frontend Developer specialising in React, Next.js, and TypeScript. Building fast, accessible, and production-ready web applications. Based in Sunderland, UK.",
  keywords: [
    "Joel Oguntade",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Frontend Engineer",
    "Web Developer UK",
    "Portfolio",
    "JavaScript Developer",
  ],
  authors: [{ name: "Joel Oguntade", url: "https://joeloguntade.vercel.app" }],
  creator: "Joel Oguntade",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://joeloguntade.vercel.app",
  },
  openGraph: {
    type: "website",
    url: "https://joeloguntade.vercel.app",
    title: "Joel Oguntade | Frontend Developer",
    description:
      "Frontend Developer specialising in React, Next.js, and TypeScript. Building fast, accessible, and production-ready web applications.",
    siteName: "Joel Oguntade Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Joel Oguntade — Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joel Oguntade | Frontend Developer",
    description:
      "Frontend Developer specialising in React, Next.js, and TypeScript.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable}`}>
      <body style={{ backgroundColor: "#121212" }}>
        <div id="initial-loader">
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>

          <div className="loader-content">
            <div className="typing-container">
              <div className="typing-line">
                <span className="typing-text typing-text-1">
                  Welcome to Joel&apos;s Portfolio ⚡
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-2">
                  Front-end Developer & Designer 💻
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-3">
                  Please Wait, Loading Your Experience ✨
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-4">
                  Preparing Something Special For You 🎨
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-5">
                  Almost There, Stay Tuned 🚀
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-6">
                  Thanks For Your Patience 💜
                </span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-7">
                  Get Ready For An Amazing Journey 🌟
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Removes CSS loader after hydration */}
        <ClientLoaderCleanup />

        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
