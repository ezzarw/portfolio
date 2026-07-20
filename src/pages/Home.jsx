import { motion } from "framer-motion";
import DynamicCta from "../components/DynamicCta";
import { siteConfig } from "../data/SiteConfig";

const strengths = [
  {
    number: "01",
    title: "Cloud & DevOps",
    description: "Membangun deployment dan infrastruktur yang rapi, otomatis, serta mudah dirawat.",
    color: "bg-[#79c8ff]",
  },
  {
    number: "02",
    title: "Cyber Security",
    description: "Terbiasa melihat sistem dari sisi keamanan, forensik digital, dan kompetisi CTF.",
    color: "bg-[#ff8fab]",
  },
  {
    number: "03",
    title: "Agentic AI",
    description: "Mengeksplorasi AI sebagai rekan kerja untuk otomasi, produk, dan eksperimen kreatif.",
    color: "bg-[#75d6ad]",
  },
];

export default function Home({ onNavigate }) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <section className="relative overflow-hidden border-b-[3px] border-[#17213c]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 border-2 border-[#17213c] bg-[#75d6ad] px-3 py-2 shadow-[3px_3px_0_#17213c]">
              <span className="h-3 w-3 animate-pulse border-2 border-[#17213c] bg-white" />
              <span className="text-sm font-bold">Terbuka untuk kolaborasi dan peluang baru</span>
            </div>

            <p className="pixel-font mb-5 text-[11px] text-[#4338a8] sm:text-xs">HALO, SAYA</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Aliezzar
              <span className="block text-[#6c5ce7]">Wijaya.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-[#3d465e] sm:text-xl">
              Saya membangun sistem cloud, otomasi DevOps, dan eksperimen AI yang membantu pekerjaan jadi lebih cepat, aman, dan mudah dipahami.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {siteConfig.homeCtas.map((cta) => (
                <DynamicCta
                  key={`${cta.type}-${cta.target || cta.linkKey}`}
                  cta={cta}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
            <div className="pixel-panel relative aspect-square overflow-hidden bg-[#79c8ff] p-7 sm:p-10">
              <div className="absolute left-6 top-6 h-5 w-5 bg-[#fffaf0] shadow-[20px_0_0_#fffaf0,40px_0_0_#fffaf0,0_20px_0_#fffaf0]" />
              <div className="absolute bottom-0 left-0 h-20 w-full border-t-[3px] border-[#17213c] bg-[#75d6ad]" />
              <div className="pixel-float absolute inset-x-0 top-1/2 mx-auto h-40 w-40 -translate-y-1/2 border-[3px] border-[#17213c] bg-[#ffd166] shadow-[12px_12px_0_#17213c] sm:h-48 sm:w-48">
                <div className="absolute left-8 top-10 h-8 w-8 bg-[#17213c] sm:left-10 sm:top-12" />
                <div className="absolute right-8 top-10 h-8 w-8 bg-[#17213c] sm:right-10 sm:top-12" />
                <div className="absolute bottom-9 left-1/2 h-3 w-16 -translate-x-1/2 bg-[#17213c] sm:bottom-11 sm:w-20" />
                <div className="absolute -left-5 bottom-4 h-16 w-5 border-y-[3px] border-l-[3px] border-[#17213c] bg-[#ff8fab]" />
                <div className="absolute -right-5 bottom-4 h-16 w-5 border-y-[3px] border-r-[3px] border-[#17213c] bg-[#ff8fab]" />
              </div>
              <span className="pixel-font absolute bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px]">PLAYER 01</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="strengths-title">
        <div className="mb-10 max-w-2xl">
          <p className="pixel-font mb-3 text-[10px] text-[#6c5ce7]">SKILL SET</p>
          <h2 id="strengths-title" className="text-3xl font-black tracking-tight sm:text-4xl">
            Yang bisa saya bantu kerjakan
          </h2>
          <p className="mt-4 text-lg text-[#5d6475]">
            Penjelasan singkat tanpa jargon berlebihan—supaya tim teknis maupun nonteknis langsung paham nilainya.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {strengths.map((strength) => (
            <article key={strength.title} className="pixel-panel-sm flex h-full flex-col p-6 sm:p-7">
              <span className={`pixel-font mb-8 grid h-12 w-12 place-items-center border-2 border-[#17213c] text-[10px] ${strength.color}`}>
                {strength.number}
              </span>
              <h3 className="text-xl font-black">{strength.title}</h3>
              <p className="mt-3 text-[#5d6475]">{strength.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t-[3px] border-[#17213c] bg-[#ffd166]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="pixel-font text-[10px]">{siteConfig.closingCta.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">{siteConfig.closingCta.title}</h2>
          </div>
          <DynamicCta
            cta={{
              label: siteConfig.closingCta.label,
              type: "page",
              target: siteConfig.closingCta.target,
              arrow: true,
            }}
            onNavigate={onNavigate}
            className="bg-white"
          />
        </div>
      </section>
    </motion.div>
  );
}
