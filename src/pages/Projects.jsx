import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import DynamicCta from "../components/DynamicCta";
import DynamicIcon from "../components/DynamicIcon";
import projects from "../data/ProjectData.json";
import { getSiteLink, siteConfig } from "../data/SiteConfig";

const cardColors = ["bg-[#79c8ff]", "bg-[#ffd166]", "bg-[#ff8fab]", "bg-[#75d6ad]"];

const normalizedProjects = projects
  .filter((project) => project.visibleProject === "Public")
  .map((project) => ({
    ...project,
    featured: Boolean(project.featured),
  }));

const featuredProjects = normalizedProjects.filter((project) => project.featured);
const displayedProjects = featuredProjects.length > 0 ? featuredProjects : normalizedProjects;
const technologies = ["Semua", ...new Set(displayedProjects.map((project) => project.technology))].sort((a, b) => {
  if (a === "Semua") return -1;
  if (b === "Semua") return 1;
  return a.localeCompare(b);
});

const formatTitle = (title) => title.replaceAll("-", " ").replaceAll("_", " ");

export default function Projects() {
  const [filter, setFilter] = useState("Semua");
  const visibleProjects = filter === "Semua"
    ? displayedProjects
    : displayedProjects.filter((project) => project.technology === filter);
  const projectsLink = getSiteLink(siteConfig.projectsCta.linkKey);

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
        <p className="pixel-font mb-4 text-[10px] text-[#6c5ce7]">SELECTED WORK</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Karya pilihan, bukan sekadar daftar repo.</h1>
        <p className="mt-5 text-lg text-[#4b5368]">
          Filter dan kartu proyek di bawah ini dibuat langsung dari data proyek, jadi teknologi atau karya baru akan muncul otomatis.
        </p>
      </header>

      <div className="my-10 flex flex-wrap gap-3" role="group" aria-label="Filter teknologi proyek">
        {technologies.map((technology) => (
          <button
            type="button"
            key={technology}
            onClick={() => setFilter(technology)}
            aria-pressed={filter === technology}
            className={`min-h-[44px] border-2 border-[#17213c] px-4 py-2 font-bold shadow-[3px_3px_0_#17213c] transition-colors ${
              filter === technology ? "bg-[#6c5ce7] text-white" : "bg-[#fffaf0] hover:bg-[#ffd166]"
            }`}
          >
            {technology}
          </button>
        ))}
      </div>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={displayedProjects.findIndex((item) => item.title === project.title)}
          />
        ))}
      </section>

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

function ProjectCard({ project, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const color = cardColors[index % cardColors.length];

  return (
    <>
      <article className="pixel-panel-sm flex h-full flex-col overflow-hidden">
        <div className={`relative border-b-2 border-[#17213c] p-4 ${color}`}>
          <span className="pixel-badge bg-white">{project.technology}</span>
          <div className="mt-10 flex min-h-[88px] items-end justify-between gap-4">
            <span className="pixel-font text-[9px]">PROJECT {String(index + 1).padStart(2, "0")}</span>
            <span className="pixel-font text-4xl opacity-20" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="break-words text-xl font-black">{formatTitle(project.title)}</h2>
          <p className="mt-3 flex-1 text-[#5d6475]">{project.description}</p>
          <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-[#17213c]/30 pt-5">
            <span className="pixel-badge bg-[#f3e7cd]">{project.technology}</span>
            <button type="button" onClick={() => setIsOpen(true)} className="font-black text-[#4338a8] underline decoration-2 underline-offset-4 hover:text-[#6c5ce7]">
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
                    <dl className="mt-7 grid gap-4 border-y-2 border-dashed border-[#17213c]/30 py-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-bold text-[#5d6475]">Teknologi</dt>
                        <dd className="mt-1 font-black">{project.technology}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-bold text-[#5d6475]">Visibilitas</dt>
                        <dd className="mt-1 font-black">{project.visibleProject}</dd>
                      </div>
                    </dl>
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
