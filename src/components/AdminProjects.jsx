"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchProjects();
    
    // Auto-refresh every 5 minutes to catch new repos
    const interval = setInterval(fetchProjects, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
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
        const mappedProjects = data.data.map(p => ({
          ...p,
          demoUrl: p.customDemoUrl || p.homepage // Prioritize custom demo if exists
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
  };

  const generateTechJourney = (project) => {
    const lang = project.language || "various technologies";
    const name = project.name;
    
    const templates = [
      `The development of ${name} was a technical journey focused on mastering ${lang}. I architected the solution to handle complex data flows while ensuring performance and scalability remained top priorities.`,
      `Building ${name} challenged me to push the boundaries of ${lang}. I focused on creating a robust system that integrates modern design patterns with efficient backend logic, resulting in a seamless user experience.`,
      `With ${name}, I dived deep into the intricacies of ${lang} development. The project involved solving critical technical hurdles through iterative prototyping and rigorous testing of core functionalities.`,
      `The technical evolution of ${name} centered on leveraging ${lang} to its full potential. I engineered a modular architecture that prioritizes clean code practices and intuitive interaction models.`
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    setProjects(prev => prev.map(p => 
      p.repoName === project.repoName ? { ...p, customDescription: randomTemplate } : p
    ));
  };

  const handleToggleApproval = async (repoName, isCurrentlyApproved, customDescription, demoUrl, forceUpdate = false) => {
    const action = (isCurrentlyApproved && !forceUpdate) ? "disapprove" : "approve";
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
          demoUrl: demoUrl || ""
        }),
      });

      if (response.status === 401) {
        setError("Unauthorized. Please refresh and log in again.");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProjects(prev => prev.map(p => 
          p.repoName === repoName ? { ...p, approved: action === "approve" } : p
        ));
        
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

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.repoName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-xl text-blue-400 animate-pulse">Fetching your GitHub repositories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Project Manager</h1>
            <p className="text-slate-400">Curate and approve projects for your portfolio</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm focus:border-blue-500 outline-none transition-all w-full md:w-64"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                🔍
              </span>
            </div>
            <button 
              onClick={fetchProjects}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/10"
              title="Refresh projects"
            >
              🔄
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border transition-all ${
                project.approved 
                  ? "bg-blue-500/5 border-blue-500/30" 
                  : "bg-[#0f172a] border-white/5"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail Preview */}
                <div className="w-full md:w-48 h-28 bg-black rounded-xl overflow-hidden border border-white/10 flex-shrink-0 relative group self-start shadow-inner">
                  <img 
                    src={project.screenshotUrl || (project.demoUrl || project.homepage && !project.homepage.includes('github.com')) 
                      ? `https://v1.screenshot.11ty.dev/${encodeURIComponent(project.screenshotUrl || project.demoUrl || project.homepage)}/small/`
                      : `https://opengraph.githubassets.com/1/Jhay-web52/${project.repoName}`
                    }
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    key={project.screenshotUrl} // Force re-render when screenshotUrl changes
                    onError={(e) => {
                      e.target.src = "/assets/projects/jhayfx.png";
                    }}
                  />
                  {!(project.screenshotUrl || project.demoUrl || project.homepage) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="text-[10px] text-white/60 text-center px-4">No URL provided for screenshot</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    {project.private && (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] uppercase tracking-wider rounded border border-white/5">
                        Private
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Description</label>
                      <textarea
                        value={project.customDescription || project.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects(prev => prev.map(p => 
                            p.repoName === project.repoName ? { ...p, customDescription: val } : p
                          ));
                        }}
                        placeholder="Technical journey description..."
                        className="w-full p-3 bg-black/30 border border-white/5 rounded-lg text-sm text-slate-400 min-h-[100px] outline-none focus:border-blue-500/50 resize-y"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">Custom Demo URL (For Screenshots)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={project.demoUrl || project.homepage || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProjects(prev => prev.map(p => 
                              p.repoName === project.repoName ? { ...p, demoUrl: val } : p
                            ));
                          }}
                          placeholder="https://your-site.vercel.app"
                          className="flex-1 p-3 bg-black/30 border border-white/5 rounded-lg text-sm text-slate-400 outline-none focus:border-blue-500/50"
                        />
                        <button
                          onClick={() => {
                            setProjects(prev => prev.map(p => 
                              p.repoName === project.repoName ? { ...p, screenshotUrl: p.demoUrl || p.homepage } : p
                            ));
                          }}
                          className="px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                        >
                          Generate Preview
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">
                        Paste the Vercel URL and click "Generate Preview" to see the screenshot.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {project.language}
                    </span>
                    <span>⭐ {project.stars}</span>
                    <button 
                      onClick={() => generateTechJourney(project)}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                    >
                      ✨ Generate Tech Story
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                  {project.approved ? (
                    <>
                      <button
                        onClick={() => handleToggleApproval(project.repoName, true, project.customDescription, project.demoUrl, true)}
                        disabled={savingId === project.repoName}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
                      >
                        {savingId === project.repoName ? "Updating..." : "Update Changes"}
                      </button>
                      <button
                        onClick={() => handleToggleApproval(project.repoName, true, project.customDescription, project.demoUrl)}
                        disabled={savingId === project.repoName}
                        className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                      >
                        Disapprove
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleToggleApproval(project.repoName, false, project.customDescription, project.demoUrl)}
                      disabled={savingId === project.repoName}
                      className="w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
                    >
                      {savingId === project.repoName ? "Saving..." : "Approve & Show"}
                    </button>
                  )}
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-center text-sm border border-white/10 transition-all font-medium"
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
