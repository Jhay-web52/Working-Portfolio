import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLoaderCleanup from "@/components/ClientLoaderCleanup";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Portfolio | Prabhulal Raghwani",
  description: "Prabhulal Raghwani's portfolio site.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#121212" }}>
        {/* inintial loading effct using only css */}
        <div id="initial-loader">
          {/* <!-- Floating particles --> */}
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>
          <div className="loader-particle"></div>

          <div class="loader-content">
            {/* <!-- Typing animation --> */}
            <div className="typing-container">
              <div className="typing-line">
                <span className="typing-text typing-text-1">
                  Welcome to Prabhulal's Portfolio ⚡
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
