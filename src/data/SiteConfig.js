export const siteConfig = {
  brand: {
    initials: "AW",
    shortName: "ALIEZZAR",
    name: "Aliezzar Wijaya",
    role: "Cloud, DevOps & Security",
  },
  navigation: [
    { id: "/", label: "Home" },
    { id: "about-me", label: "Tentang" },
    { id: "projects", label: "Karya" },
    { id: "contact-me", label: "Kontak" },
  ],
  links: {
    github: {
      label: "GitHub",
      value: "@ezzarw",
      href: "https://github.com/ezzarw",
      icon: "github",
      color: "bg-[#75d6ad]",
    },
    repositories: {
      label: "Semua repository",
      href: "https://github.com/ezzarw?tab=repositories",
      icon: "github",
    },
    linkedin: {
      label: "LinkedIn",
      value: "Aliezzar Wijaya",
      href: "https://www.linkedin.com/in/aliezzar-wijaya-7a9a56356",
      icon: "linkedin",
      color: "bg-[#79c8ff]",
    },
    email: {
      label: "Email",
      value: "aliezzar42@gmail.com",
      href: "mailto:aliezzar42@gmail.com",
      icon: "email",
      color: "bg-[#ffd166]",
    },
  },
  homeCtas: [
    {
      label: "Lihat karya pilihan",
      type: "page",
      target: "projects",
      variant: "primary",
      arrow: true,
    },
    {
      label: "Ajak ngobrol",
      type: "page",
      target: "contact-me",
      variant: "default",
    },
    {
      label: "GitHub",
      type: "link",
      linkKey: "github",
      variant: "default",
    },
  ],
  contactLinkKeys: ["email", "linkedin", "github"],
  footerLinkKeys: ["email", "linkedin", "github"],
  closingCta: {
    eyebrow: "NEXT LEVEL?",
    title: "Mari bikin sesuatu yang berguna.",
    label: "Hubungi saya",
    target: "contact-me",
  },
  projectsCta: {
    eyebrow: "MORE QUESTS",
    title: "Ingin lihat eksperimen lainnya?",
    description: "Repo publik, catatan belajar, dan proyek kecil lainnya tersedia di GitHub.",
    linkKey: "repositories",
  },
};

export const getSiteLink = (linkKey) => siteConfig.links[linkKey];

export const isExternalLink = (href) => href.startsWith("http");
