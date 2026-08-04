import { getPortfolioStats } from "@/lib/statsApi";
import StatsStripClient from "./StatsStripClient";

export default async function StatsStrip() {
  const { yearsExperience, projectsBuilt, companies, technologies } =
    await getPortfolioStats();

  const stats = [
    { target: yearsExperience, label: "Years Experience", suffix: "+" },
    { target: projectsBuilt, label: "Projects Built", suffix: "" },
    { target: companies, label: "Companies", suffix: "" },
    { target: technologies, label: "Technologies", suffix: "+" },
  ];

  return <StatsStripClient stats={stats} />;
}
