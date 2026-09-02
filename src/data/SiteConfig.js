export const siteConfig = {
  brand: {
    name: "Aliezzar Wijaya",
    role: "Backend, Cloud/DevOps & Security",
    location: "Sidoarjo, Jawa Timur, Indonesia",
    statusText: "Open for CTF, DevOps & Backend Collaboration",
    avatar: "/avatar.jpg",
  },
  cta: {
    primary: {
      label: "Download Resume [PDF]",
      href: "/resume.pdf",
      type: "link",
    },
    secondary: {
      label: "Diskusikan Proyek",
      page: "contact-me",
      type: "navigate",
    },
  },
  closingCta: {
    title: "Tertarik Berkolaborasi?",
    description: "Terbuka untuk diskusi proyek Backend, Cloud/DevOps, dan Cyber Security.",
    buttonText: "Hubungi Saya",
    page: "contact-me",
  },
  links: {
    github: {
      label: "GitHub",
      href: "https://github.com/ezzarw",
      icon: "Terminal",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aliezzar-wijaya/",
      icon: "Shield",
    },
    instagram: {
      label: "Instagram",
      href: "https://www.instagram.com/ezzarforschool",
      icon: "Cloud",
    },
    notionNotes: {
      label: "Catatan Publik (Notion)",
      href: "https://five-gray-199.notion.site/3cf52d1a44ad80ffb356df6e7a9c6794?v=5ad52d1a44ad8219bba18828789d6e28",
      icon: "BookOpen",
    },
    email: {
      label: "Email",
      href: "mailto:aliezzar42@gmail.com",
      icon: "ExternalLink",
    },
  },
  navigation: [
    { id: "/", label: "Beranda" },
    { id: "projects", label: "Portofolio & Sertifikat" },
    { id: "about-me", label: "Tentang" },
    { id: "contact-me", label: "Kontak" },
  ],
};

export const getSiteLink = (key) => siteConfig.links[key] || null;
export const isExternalLink = (href) => typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:"));
