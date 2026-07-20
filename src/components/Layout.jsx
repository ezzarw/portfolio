import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { useState } from "react";
import DynamicIcon from "./DynamicIcon";
import { getSiteLink, isExternalLink, siteConfig } from "../data/SiteConfig";

export default function Layout({ children, setIsNavbar, isNavbar }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const githubLink = getSiteLink("github");

  const navigate = (id) => {
    setIsNavbar(id);
    setNavbarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pixel-grid min-h-screen overflow-x-hidden">
      <a
        href="#main-content"
        className="pixel-button fixed left-4 top-4 z-50 -translate-y-24 focus:translate-y-0"
      >
        Lewati ke konten
      </a>

      <header className="sticky top-0 z-40 border-b-[3px] border-[#17213c] bg-[#fffaf0]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="flex min-h-[48px] items-center gap-3 text-left"
            onClick={() => navigate(siteConfig.navigation[0].id)}
            aria-label="Buka halaman utama"
          >
            <span className="grid h-11 w-11 place-items-center border-2 border-[#17213c] bg-[#ffd166] shadow-[3px_3px_0_#17213c] pixel-font text-sm">
              {siteConfig.brand.initials}
            </span>
            <span>
              <span className="pixel-font block text-[10px] sm:text-xs">{siteConfig.brand.shortName}</span>
              <span className="block text-xs font-bold text-[#5d6475] sm:text-sm">
                {siteConfig.brand.role}
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Navigasi utama">
            {siteConfig.navigation.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.id)}
                aria-current={isNavbar === item.id ? "page" : undefined}
                className={`min-h-[44px] border-2 border-[#17213c] px-4 py-2 text-sm font-bold transition-colors ${
                  isNavbar === item.id
                    ? "bg-[#6c5ce7] text-white shadow-[3px_3px_0_#17213c]"
                    : "bg-[#fffaf0] hover:bg-[#ffd166]"
                }`}
              >
                <span className="mr-2 text-xs opacity-70">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <a
            href={githubLink.href}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-[44px] items-center gap-2 border-2 border-[#17213c] bg-[#17213c] px-4 py-2 font-bold text-white transition-colors hover:bg-[#4338a8] lg:flex"
          >
            <DynamicIcon name={githubLink.icon} className="text-xl" />
            {githubLink.label}
          </a>

          <button
            type="button"
            className="grid h-12 w-12 place-items-center border-2 border-[#17213c] bg-[#ffd166] shadow-[3px_3px_0_#17213c] md:hidden"
            onClick={() => setNavbarOpen((current) => !current)}
            aria-expanded={navbarOpen}
            aria-controls="mobile-navigation"
            aria-label={navbarOpen ? "Tutup menu" : "Buka menu"}
          >
            {navbarOpen ? <AiOutlineClose className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {navbarOpen ? (
          <nav
            id="mobile-navigation"
            className="border-t-[3px] border-[#17213c] bg-[#f3e7cd] p-4 md:hidden"
            aria-label="Navigasi mobile"
          >
            <div className="mx-auto grid max-w-7xl gap-3">
              {siteConfig.navigation.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  aria-current={isNavbar === item.id ? "page" : undefined}
                  className={`min-h-[48px] border-2 border-[#17213c] px-4 text-left font-bold shadow-[3px_3px_0_#17213c] ${
                    isNavbar === item.id ? "bg-[#6c5ce7] text-white" : "bg-[#fffaf0]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}. {item.label}
                </button>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main-content" className="min-h-[calc(100vh-76px)]">
        {children}
      </main>

      <footer className="border-t-[3px] border-[#17213c] bg-[#17213c] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold">Dibuat dengan rasa ingin tahu dan banyak kopi.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {siteConfig.footerLinkKeys.map((linkKey) => {
              const link = getSiteLink(linkKey);
              const className = "font-bold underline-offset-4 hover:underline";

              return isExternalLink(link.href) ? (
                <a key={linkKey} className={className} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ) : (
                <a key={linkKey} className={className} href={link.href}>
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
