import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLoaderCleanup from "@/components/ClientLoaderCleanup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "Portfolio | Joel Oguntade",
  description: "Joel Oguntade's portfolio site.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
                <span className="typing-text typing-text-1">Welcome to Joel's Portfolio ⚡</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-2">Front-end Developer & Designer 💻</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-3">Please Wait, Loading Your Experience ✨</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-4">Preparing Something Special For You 🎨</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-5">Almost There, Stay Tuned 🚀</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-6">Thanks For Your Patience 💜</span>
              </div>
              <div className="typing-line">
                <span className="typing-text typing-text-7">Get Ready For An Amazing Journey 🌟</span>
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