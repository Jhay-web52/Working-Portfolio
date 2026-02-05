"use client";

import LeftView from "./projectType/LeftView";
import RightView from "./projectType/RightView";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const Projects = () => {
  const refHeading = useRef(null);
  const inViewHeading = useInView(refHeading);
  const [projects, setProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectsPerPage] = useState(6);

  const variants1 = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  // Fetch projects from GitHub API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        const data = await response.json();

        if (data.success) {
          setProjects(data.data);
          // Show first 6 projects initially
          setDisplayedProjects(data.data.slice(0, projectsPerPage));
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Load more projects
  const handleLoadMore = () => {
    const currentLength = displayedProjects.length;
    const nextProjects = projects.slice(0, currentLength + projectsPerPage);
    setDisplayedProjects(nextProjects);
  };

  const hasMoreProjects = displayedProjects.length < projects.length;

  return (
    <section className="py-[80px] sm:px-6" id="projects">
      <motion.div
        ref={refHeading}
        variants={variants1}
        initial="initial"
        animate={inViewHeading ? "animate" : "initial"}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <h3 className="text-3xl font-[800] text-textWhite sm:text-5xl">
          Projects
        </h3>
        <div className="mt-2 h-[4px] min-w-0 flex-grow bg-textWhite"></div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-10 text-center text-textLight"
        >
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-textLight/30 border-t-textWhite"></div>
          <p className="mt-4">Loading projects...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border-2 border-red-500/50 bg-red-500/10 py-4 px-4 text-center text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Projects Grid */}
      {!loading && !error && displayedProjects && displayedProjects.length > 0 ? (
        <>
          {displayedProjects.map((project, i) => {
            return i % 2 === 0 ? (
              <LeftView key={project.id} {...project} />
            ) : (
              <RightView key={project.id} {...project} />
            );
          })}

          {/* Load More Button */}
          {hasMoreProjects && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mt-12"
            >
              <button
                onClick={handleLoadMore}
                className="group relative px-8 py-3 bg-transparent text-textWhite font-bold rounded-lg overflow-hidden border border-textWhite/30 hover:border-[#31d1d1] transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">not impressed enough, show more</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#31d1d1]/20 to-[#6d28d9]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </motion.div>
          )}
        </>
      ) : !loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-10 text-center text-textLight"
        >
          No projects found.
        </motion.div>
      ) : null}
    </section>
  );
};

export default Projects;

// project section flow

// ┌───────────────────────────┐
// │ ProjectList (Data)        │
// │ [{id, name, description,  │
// │ img, tech, source, demo}] │
// └───────────────┬───────────┘
//                 ↓
// ┌───────────────────────────┐
// │ Projects.jsx              │
// │ Decide how many to show   │
// │ displayedProjects         │
// └───────────────┬───────────┘
//                 ↓
// ┌───────────────────────────┐
// │ Decide Layout Side        │
// │ id % 2 === 0 → LeftView   │
// │ id % 2 !== 0 → RightView  │
// └───────────────┬───────────┘
//                 ↓
// ┌───────────────────────────┐
// │ LeftView / RightView       │
// │ - Text: name + description │
// │ - Tech stack               │
// │ - Buttons: source/demo     │
// │ - Image                    │
// └───────────────┬───────────┘
//                 ↓
// ┌───────────────────────────┐
// │ Framer Motion Animations  │
// │ - Text slide-in           │
// │ - Image blur → sharp      │
// └───────────────┬───────────┘
//                 ↓
// ┌───────────────────────────┐
// │ Browser Renders           │
// │ Projects visually with    │
// │ alternating Left/Right    │
// └───────────────────────────┘

