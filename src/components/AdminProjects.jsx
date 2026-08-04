"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const TECH_JOURNEY_TEMPLATES = [
  (name, lang) =>
    `The development of ${name} was a technical journey focused on mastering ${lang}. I architected the solution to handle complex data flows while ensuring performance and scalability remained top priorities.`,
  (name, lang) =>
    `Building ${name} challenged me to push the boundaries of ${lang}. I focused on creating a robust system that integrates modern design patterns with efficient backend logic, resulting in a seamless user experience.`,
  (name, lang) =>
    `With ${name}, I dived deep into the intricacies of ${lang} development. The project involved solving critical technical hurdles through iterative prototyping and rigorous testing of core functionalities.`,
  (name, lang) =>
    `The technical evolution of ${name} centered on leveraging ${lang} to its full potential. I engineered a modular architecture that prioritizes clean code practices and intuitive interaction models.`,
];

function pickTechJourney(project) {
  const lang = project.language || "various technologies";
  const template =
    TECH_JOURNEY_TEMPLATES[
      Math.floor(Math.random() * TECH_JOURNEY_TEMPLATES.length)
    ];
  return template(project.name, lang);
}

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingId, setSavingId] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/projects", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setError("Session expired or not logged in. Refresh and log in again.");
        setProjects([]);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Map API data to component state
        const mappedProjects = data.data.map((p) => ({
          ...p,
          demoUrl: p.customDemoUrl || p.homepage, // Prioritize custom demo if exists
        }));
        setProjects(mappedProjects);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    // Auto-refresh every 5 minutes to catch new repos
    const interval = setInterval(fetchProjects, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  const generateTechJourney = (project) => {
    const randomTemplate = pickTechJourney(project);

    setProjects((prev) =>
      prev.map((p) =>
        p.repoName === project.repoName
          ? { ...p, customDescription: randomTemplate }
          : p,
      ),
    );
  };

  const handleToggleApproval = async (
    repoName,
    isCurrentlyApproved,
    customDescription,
    demoUrl,
    forceUpdate = false,
  ) => {
    const action =
      isCurrentlyApproved && !forceUpdate ? "disapprove" : "approve";
    setSavingId(repoName);
    setError(null);

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action,
          repoName,
          description: customDescription || "",
          demoUrl: demoUrl || "",
        }),
      });

      if (response.status === 401) {
        setError("Unauthorized. Please refresh and log in again.");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.repoName === repoName
              ? { ...p, approved: action === "approve" }
              : p,
          ),
        );

        // Brief success feedback could be added here if needed
      } else {
        setError(data.error || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Failed to toggle approval:", err);
      setError("Update failed. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.repoName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="animate-pulse text-xl text-blue-400">
          Fetching your GitHub repositories...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-slate-200 md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Project Manager
            </h1>
            <p className="text-slate-400">
              Curate and approve projects for your portfolio
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0f172a] py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-blue-500 md:w-64"
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">
                🔍
              </span>
            </div>
            <button
              onClick={fetchProjects}
              className="rounded-lg border border-white/10 p-2 transition-colors hover:bg-white/5"
              title="Refresh projects"
            >
              🔄
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 transition-all ${
                project.approved
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-white/5 bg-[#0f172a]"
              }`}
            >
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Thumbnail Preview */}
                <div className="group relative h-28 w-full flex-shrink-0 self-start overflow-hidden rounded-xl border border-white/10 bg-black shadow-inner md:w-48">
                  <img
                    src={
                      project.screenshotUrl ||
                      project.demoUrl ||
                      (project.homepage &&
                        !project.homepage.includes("github.com"))
                        ? `https://v1.screenshot.11ty.dev/${encodeURIComponent(project.screenshotUrl || project.demoUrl || project.homepage)}/small/`
                        : `https://opengraph.githubassets.com/1/Jhay-web52/${project.repoName}`
                    }
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    key={project.screenshotUrl} // Force re-render when screenshotUrl changes
                    onError={(e) => {
                      e.target.src = "/assets/projects/jhayfx.png";
                    }}
                  />
                  {!(
                    project.screenshotUrl ||
                    project.demoUrl ||
                    project.homepage
                  ) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="px-4 text-center text-[10px] text-white/60">
                        No URL provided for screenshot
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {project.name}
                    </h3>
                    {project.private && (
                      <span className="rounded border border-white/5 bg-slate-800 px-2 py-0.5 text-[10px] tracking-wider text-slate-400 uppercase">
                        Private
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] tracking-wider text-slate-500 uppercase">
                        Description
                      </label>
                      <textarea
                        value={project.customDescription || project.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects((prev) =>
                            prev.map((p) =>
                              p.repoName === project.repoName
                                ? { ...p, customDescription: val }
                                : p,
                            ),
                          );
                        }}
                        placeholder="Technical journey description..."
                        className="min-h-[100px] w-full resize-y rounded-lg border border-white/5 bg-black/30 p-3 text-sm text-slate-400 outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] tracking-wider text-slate-500 uppercase">
                        Custom Demo URL (For Screenshots)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={project.demoUrl || project.homepage || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProjects((prev) =>
                              prev.map((p) =>
                                p.repoName === project.repoName
                                  ? { ...p, demoUrl: val }
                                  : p,
                              ),
                            );
                          }}
                          placeholder="https://your-site.vercel.app"
                          className="flex-1 rounded-lg border border-white/5 bg-black/30 p-3 text-sm text-slate-400 outline-none focus:border-blue-500/50"
                        />
                        <button
                          onClick={() => {
                            setProjects((prev) =>
                              prev.map((p) =>
                                p.repoName === project.repoName
                                  ? {
                                      ...p,
                                      screenshotUrl: p.demoUrl || p.homepage,
                                    }
                                  : p,
                              ),
                            );
                          }}
                          className="rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 text-xs font-bold whitespace-nowrap text-blue-400 transition-all hover:bg-blue-600/30"
                        >
                          Generate Preview
                        </button>
                      </div>
                      <p className="mt-2 text-[10px] text-slate-500">
                        Paste the Vercel URL and click &quot;Generate
                        Preview&quot; to see the screenshot.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {(project.languages && project.languages.length > 0
                      ? project.languages
                      : project.language
                        ? [project.language]
                        : []
                    ).map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-300"
                      >
                        {lang}
                      </span>
                    ))}
                    <span className="ml-2">⭐ {project.stars}</span>
                    <button
                      onClick={() => generateTechJourney(project)}
                      className="flex items-center gap-1 font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      ✨ Generate Tech Story
                    </button>
                  </div>
                </div>

                <div className="flex min-w-[140px] flex-col justify-center gap-2">
                  {project.approved ? (
                    <>
                      <button
                        onClick={() =>
                          handleToggleApproval(
                            project.repoName,
                            true,
                            project.customDescription,
                            project.demoUrl,
                            true,
                          )
                        }
                        disabled={savingId === project.repoName}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingId === project.repoName
                          ? "Updating..."
                          : "Update Changes"}
                      </button>
                      <button
                        onClick={() =>
                          handleToggleApproval(
                            project.repoName,
                            true,
                            project.customDescription,
                            project.demoUrl,
                          )
                        }
                        disabled={savingId === project.repoName}
                        className="w-full rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Disapprove
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleToggleApproval(
                          project.repoName,
                          false,
                          project.customDescription,
                          project.demoUrl,
                        )
                      }
                      disabled={savingId === project.repoName}
                      className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition-all hover:bg-green-700 disabled:opacity-50"
                    >
                      {savingId === project.repoName
                        ? "Saving..."
                        : "Approve & Show"}
                    </button>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-center text-sm font-medium text-slate-400 transition-all hover:bg-white/10"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
