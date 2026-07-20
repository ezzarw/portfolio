import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { motion } from "framer-motion";
import { Fragment, useEffect, useMemo, useState } from "react";
import DynamicCta from "../components/DynamicCta";
import DynamicIcon from "../components/DynamicIcon";
import manualProjects from "../data/ProjectData.json";
import { getSiteLink, siteConfig } from "../data/SiteConfig";

const cardColors = ["bg-[#79c8ff]", "bg-[#ffd166]", "bg-[#ff8fab]", "bg-[#75d6ad]"];
const allFilter = "Semua";

const githubUsername = "ezzarw";
const githubCacheKey = "portfolio-github-projects";
const githubCacheDuration = 60 * 60 * 1000;

const normalizeProject = (project) => ({
  ...project,
  categories: project.categories || ["Lainnya"],
  technologies: project.technologies || (project.technology ? [project.technology] : ["Other"]),
  featured: Boolean(project.featured),
});

const normalizedManualProjects = manualProjects
  .filter((project) => project.visibleProject === "Public")
  .map(normalizeProject);

const formatTitle = (title) => title.replaceAll("-", " ").replaceAll("_", " ");
const sortFilters = (items) => [allFilter, ...new Set(items)].sort((a, b) => {
  if (a === allFilter) return -1;
  if (b === allFilter) return 1;
  return a.localeCompare(b);
});

export default function Projects() {
  const [githubProjects, setGithubProjects] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(allFilter);
  const [technologyFilter, setTechnologyFilter] = useState(allFilter);
  const normalizedProjects = useMemo(() => {
    const githubTitles = new Set(githubProjects.map((project) => project.title.toLowerCase()));
    const localOnlyProjects = normalizedManualProjects.filter((project) => !githubTitles.has(project.title.toLowerCase()));
    const manualMetadata = new Map(normalizedManualProjects.map((project) => [project.title.toLowerCase(), project]));
    const enrichedGithubProjects = githubProjects.map((project) => ({
      ...project,
      ...manualMetadata.get(project.title.toLowerCase()),
      source: "GitHub Live",
      githubMetadata: project.githubMetadata,
    }));
    return [...enrichedGithubProjects, ...localOnlyProjects.map((project) => ({ ...project, source: "Manual" }))];
  }, [githubProjects]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGithubProjects() {
      const cached = JSON.parse(localStorage.getItem(githubCacheKey) || "null");
      if (cached?.savedAt && Date.now() - cached.savedAt < githubCacheDuration) {
        setGithubProjects(cached.projects);
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) throw new Error("GitHub API tidak tersedia");
        const repositories = await response.json();
        const projects = repositories
          .filter((repository) => !repository.fork && !repository.archived)
          .map((repository) => normalizeProject({
            title: repository.name,
            description: repository.description || "Repository publik dari GitHub.",
            categories: ["GitHub"],
            technologies: repository.language ? [repository.language] : ["Other"],
            visibleProject: "Public",
            image: `https://opengraph.githubassets.com/1/${repository.full_name}`,
            link: repository.html_url,
            githubMetadata: {
              fullName: repository.full_name,
              defaultBranch: repository.default_branch,
              stars: repository.stargazers_count,
              forks: repository.forks_count,
              updatedAt: repository.updated_at,
            },
          }));
        setGithubProjects(projects);
        localStorage.setItem(githubCacheKey, JSON.stringify({ savedAt: Date.now(), projects }));
      } catch (error) {
        if (error.name !== "AbortError") {
          setGithubProjects(cached?.projects || []);
        }
      }
    }

    loadGithubProjects();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => sortFilters(normalizedProjects.flatMap((project) => project.categories)),
    [normalizedProjects]
  );
  const availableTechnologies = useMemo(() => {
    const matchingProjects = categoryFilter === allFilter
      ? normalizedProjects
      : normalizedProjects.filter((project) => project.categories.includes(categoryFilter));

    return sortFilters(matchingProjects.flatMap((project) => project.technologies));
  }, [categoryFilter, normalizedProjects]);
  const visibleProjects = normalizedProjects.filter((project) => {
    const categoryMatches = categoryFilter === allFilter || project.categories.includes(categoryFilter);
    const technologyMatches = technologyFilter === allFilter || project.technologies.includes(technologyFilter);
    return categoryMatches && technologyMatches;
  });
  const projectsLink = getSiteLink(siteConfig.projectsCta.linkKey);

  const selectCategory = (category) => {
    setCategoryFilter(category);
    setTechnologyFilter(allFilter);
  };

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="max-w-3xl">
        <p className="pixel-font mb-4 text-[10px] text-[#6c5ce7]">PROJECT ARCHIVE</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Karya berdasarkan bidang dan teknologi.</h1>
        <p className="mt-5 text-lg text-[#4b5368]">
          Pilih bidang seperti Backend atau DevOps, lalu persempit lagi berdasarkan teknologi yang digunakan.
        </p>
      </header>

      <div className="my-10 grid gap-5 lg:grid-cols-2">
        <FilterGroup
          label="Kategori"
          ariaLabel="Filter kategori proyek"
          options={categories}
          activeOption={categoryFilter}
          onSelect={selectCategory}
        />
        <FilterGroup
          label="Teknologi"
          ariaLabel="Filter teknologi proyek"
          options={availableTechnologies}
          activeOption={technologyFilter}
          onSelect={setTechnologyFilter}
        />
      </div>

      <p className="mb-6 font-bold text-[#4b5368]" aria-live="polite">
        Menampilkan {visibleProjects.length} dari {normalizedProjects.length} proyek
      </p>

      {visibleProjects.length > 0 ? (
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={normalizedProjects.findIndex((item) => item.title === project.title)}
            />
          ))}
        </section>
      ) : (
        <div className="pixel-panel bg-[#ffd166] p-8 text-center">
          <h2 className="text-2xl font-black">Belum ada kombinasi yang cocok.</h2>
          <p className="mt-2 text-[#4b5368]">Pilih kategori atau teknologi lain untuk melihat proyek.</p>
        </div>
      )}

      <div className="mt-14 pixel-panel flex flex-col gap-5 bg-[#75d6ad] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="pixel-font text-[9px]">{siteConfig.projectsCta.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-black">{siteConfig.projectsCta.title}</h2>
          <p className="mt-2 text-[#3d465e]">{siteConfig.projectsCta.description}</p>
        </div>
        <DynamicCta
          cta={{ label: projectsLink.label, type: "link", linkKey: siteConfig.projectsCta.linkKey }}
          className="bg-white"
        />
      </div>
    </motion.div>
  );
}

function FilterGroup({ label, ariaLabel, options, activeOption, onSelect }) {
  return (
    <fieldset className="pixel-panel-sm bg-[#fffaf0] p-5">
      <legend className="pixel-badge bg-[#ffd166]">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-3" role="group" aria-label={ariaLabel}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            aria-pressed={activeOption === option}
            className={`min-h-[44px] border-2 border-[#17213c] px-4 py-2 font-bold shadow-[3px_3px_0_#17213c] transition-colors ${
              activeOption === option ? "bg-[#6c5ce7] text-white" : "bg-white hover:bg-[#ffd166]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ProjectCard({ project, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readme, setReadme] = useState("");
  const [readmeStatus, setReadmeStatus] = useState("idle");
  const color = cardColors[index % cardColors.length];

  async function openDetails() {
    setIsOpen(true);
    if (project.source !== "GitHub Live" || readmeStatus !== "idle") return;

    setReadmeStatus("loading");
    try {
      const response = await fetch(`https://api.github.com/repos/${project.githubMetadata.fullName}/readme`, {
        headers: { Accept: "application/vnd.github.raw+json" },
      });
      if (response.status === 404) {
        setReadmeStatus("empty");
        return;
      }
      if (!response.ok) throw new Error("README gagal dimuat");
      setReadme(await response.text());
      setReadmeStatus("ready");
    } catch (error) {
      setReadmeStatus("error");
    }
  }

  return (
    <>
      <article className="pixel-panel-sm flex h-full flex-col overflow-hidden">
        <div className={`relative border-b-2 border-[#17213c] p-4 ${color}`}>
          <div className="flex flex-wrap gap-2">
            <span className={`pixel-badge ${project.source === "GitHub Live" ? "bg-[#6c5ce7]" : "bg-white text-[#17213c]"}`}>
              {project.source}
            </span>
            {project.categories.map((category) => (
              <span key={category} className="pixel-badge bg-white">{category}</span>
            ))}
          </div>
          <div className="mt-10 flex min-h-[88px] items-end justify-between gap-4">
            <span className="pixel-font text-[9px]">PROJECT {String(index + 1).padStart(2, "0")}</span>
            <span className="pixel-font text-4xl opacity-20" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="break-words text-xl font-black">{formatTitle(project.title)}</h2>
          <p className="mt-3 flex-1 text-[#5d6475]">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span key={technology} className="pixel-badge bg-[#f3e7cd]">{technology}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-end border-t-2 border-dashed border-[#17213c]/30 pt-5">
            <button type="button" onClick={openDetails} className="min-h-[44px] font-black text-[#4338a8] underline decoration-2 underline-offset-4 hover:text-[#6c5ce7]">
              Detail →
            </button>
          </div>
        </div>
      </article>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#17213c]/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel className="pixel-panel w-full max-w-2xl overflow-hidden bg-[#fffaf0]">
                  <div className={`flex items-center justify-between border-b-[3px] border-[#17213c] p-5 ${color}`}>
                    <span className="pixel-font text-[9px]">PROJECT INFO</span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="grid h-11 w-11 place-items-center border-2 border-[#17213c] bg-white shadow-[2px_2px_0_#17213c]"
                      aria-label="Tutup detail proyek"
                    >
                      <AiOutlineClose className="text-xl" />
                    </button>
                  </div>
                  <div className="p-6 sm:p-8">
                    <Dialog.Title as="h2" className="break-words text-3xl font-black">
                      {formatTitle(project.title)}
                    </Dialog.Title>
                    <p className="mt-5 text-lg text-[#4b5368]">{project.description}</p>
                    <dl className="mt-7 grid gap-5 border-y-2 border-dashed border-[#17213c]/30 py-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-bold text-[#5d6475]">Kategori</dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {project.categories.map((category) => <span key={category} className="pixel-badge">{category}</span>)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-bold text-[#5d6475]">Teknologi</dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((technology) => <span key={technology} className="pixel-badge">{technology}</span>)}
                        </dd>
                      </div>
                    </dl>
                    {project.source === "GitHub Live" ? (
                      <section className="mt-7" aria-labelledby={`readme-${project.title}`}>
                        <h3 id={`readme-${project.title}`} className="pixel-font text-[9px] text-[#6c5ce7]">README.MD</h3>
                        {readmeStatus === "loading" ? <p className="mt-4 font-bold text-[#5d6475]">Memuat README...</p> : null}
                        {readmeStatus === "ready" ? (
                          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words border-2 border-[#17213c] bg-white p-5 font-sans text-sm leading-6 text-[#4b5368]">
                            {readme}
                          </pre>
                        ) : null}
                        {readmeStatus === "empty" ? <p className="mt-4 text-[#5d6475]">Repository ini belum memiliki README.</p> : null}
                        {readmeStatus === "error" ? <p className="mt-4 text-[#5d6475]">README tidak dapat dimuat saat ini.</p> : null}
                      </section>
                    ) : null}
                    <a href={project.link} target="_blank" rel="noreferrer" className="pixel-button pixel-button-primary mt-7">
                      <DynamicIcon name="github" className="text-xl" />
                      Buka proyek
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
