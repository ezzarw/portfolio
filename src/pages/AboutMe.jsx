import { motion } from "framer-motion";
import gearData from "../data/GearData.json";

const focusAreas = [
  {
    title: "Infrastructure",
    items: ["Docker", "Kubernetes", "CI/CD", "Linux"],
    color: "bg-[#79c8ff]",
  },
  {
    title: "Development",
    items: ["Golang", "Python", "PHP", "Automation"],
    color: "bg-[#ffd166]",
  },
  {
    title: "Security",
    items: ["CTF", "Digital Forensics", "Bug Hunting", "Hardening"],
    color: "bg-[#ff8fab]",
  },
];

const principles = [
  "Memecah masalah rumit menjadi langkah yang jelas dan bisa dikerjakan.",
  "Mendokumentasikan keputusan agar tim tidak bergantung pada satu orang.",
  "Menyeimbangkan kecepatan eksperimen dengan keamanan dan kemudahan perawatan.",
];

export default function AboutMe() {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div>
          <p className="pixel-font mb-4 text-[10px] text-[#6c5ce7]">ABOUT PLAYER 01</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Orang di balik layar.</h1>
        </div>
        <p className="max-w-3xl text-lg leading-relaxed text-[#4b5368] sm:text-xl">
          Saya Aliezzar, pembelajar aktif yang menikmati pertemuan antara cloud, keamanan, software, dan AI. Saya suka membangun hal praktis, mengotomatiskan pekerjaan berulang, lalu menjelaskan hasilnya dengan bahasa yang mudah dimengerti.
        </p>
      </header>

      <div className="my-12 pixel-divider" />

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="story-title">
        <article className="pixel-panel p-6 sm:p-9">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border-2 border-[#17213c] bg-[#75d6ad] font-black">A</span>
            <h2 id="story-title" className="text-2xl font-black">Cerita singkat</h2>
          </div>
          <div className="space-y-5 text-[#4b5368]">
            <p>
              Ketertarikan saya berawal dari rasa penasaran tentang bagaimana sebuah sistem bekerja—dan bagaimana membuatnya lebih baik. Dari sana saya mulai bereksperimen dengan Linux, bahasa pemrograman, infrastruktur, keamanan siber, sampai agentic AI.
            </p>
            <p>
              Saya paling menikmati proyek yang punya dampak nyata: deployment lebih sederhana, proses manual menjadi otomatis, data lebih mudah dipahami, atau pengguna merasa produk lebih nyaman digunakan.
            </p>
            <p>
              Di luar teknis, saya suka menonton VTuber, bermain game, dan mengikuti tantangan Capture the Flag. Semua itu melatih kreativitas, ketelitian, dan cara berpikir dari berbagai sudut.
            </p>
          </div>
        </article>

        <aside className="pixel-panel bg-[#6c5ce7] p-6 text-white sm:p-8" aria-labelledby="currently-title">
          <p className="pixel-font text-[9px] text-[#ffd166]">CURRENT QUEST</p>
          <h2 id="currently-title" className="mt-4 text-2xl font-black" style={{color: 'black'}}>Sedang saya dalami</h2>
          <ul className="mt-7 space-y-4">
            {["Kubernetes & CI/CD", "Golang untuk tooling", "Digital forensics", "Agentic AI workflows"].map((item, index) => (
              <li key={item} className="flex gap-3 border-2 border-white/80 bg-[#4338a8] p-4 font-bold shadow-[3px_3px_0_#ffd166]">
                <span className="text-[#ffd166]">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="py-16" aria-labelledby="focus-title">
        <div className="mb-9">
          <p className="pixel-font mb-3 text-[10px] text-[#6c5ce7]">TOOLBOX</p>
          <h2 id="focus-title" className="text-3xl font-black">Area yang saya kerjakan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((area) => (
            <article key={area.title} className="pixel-panel-sm overflow-hidden">
              <h3 className={`border-b-2 border-[#17213c] p-5 text-xl font-black ${area.color}`}>{area.title}</h3>
              <ul className="grid grid-cols-2 gap-3 p-5">
                {area.items.map((item) => (
                  <li key={item} className="pixel-badge justify-center text-center">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2" aria-labelledby="principles-title">
        <div className="pixel-panel p-6 sm:p-8">
          <p className="pixel-font text-[9px] text-[#6c5ce7]">HOW I WORK</p>
          <h2 id="principles-title" className="mt-4 text-2xl font-black">Prinsip kerja</h2>
          <ol className="mt-6 space-y-5">
            {principles.map((principle, index) => (
              <li key={principle} className="flex gap-4">
                <span className="pixel-font mt-1 text-[9px] text-[#6c5ce7]">0{index + 1}</span>
                <p className="text-[#4b5368]">{principle}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="pixel-panel p-6 sm:p-8">
          <p className="pixel-font text-[9px] text-[#6c5ce7]">SETUP</p>
          <h2 className="mt-4 text-2xl font-black">Peralatan sehari-hari</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gearData.gearType.map((group) => (
              <article key={group.gear} className="border-2 border-[#17213c] bg-[#f3e7cd] p-4">
                <h3 className="font-black">{group.gear}</h3>
                <p className="mt-2 text-sm text-[#5d6475]">{group.gearList.map((item) => item.item).join(" · ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
