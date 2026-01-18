import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLoaderCleanup from "@/components/ClientLoaderCleanup"

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
{/* 
<!-- Add this to your RootLayout body --> */}
<div id="initial-loader">
  {/* <!-- Floating particles --> */}
  <div class="loader-particle"></div>
  <div class="loader-particle"></div>
  <div class="loader-particle"></div>
  <div class="loader-particle"></div>
  <div class="loader-particle"></div>
  <div class="loader-particle"></div>

  <div class="loader-content">
    {/* <!-- Typing animation --> */}
    <div class="typing-container">
      <div class="typing-line">
        <span class="typing-text typing-text-1">Welcome to Prabhulal Raghwani Portfolio ⚡</span>
      </div>
      <div class="typing-line">
        <span class="typing-text typing-text-2">Front-End Developer & Designer 💻</span>
      </div>
      <div class="typing-line">
        <span class="typing-text typing-text-3">Crafting Beautiful Web Experiences ✨</span>
      </div>
      <div class="typing-line">
        <span class="typing-text typing-text-4">Turning Ideas Into Reality 🚀</span>
      </div>
      <div class="typing-line">
        <span class="typing-text typing-text-5">Building The Future, One Line at a Time 🌟</span>
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
