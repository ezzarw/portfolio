import { useState } from "react";
import { motion } from "framer-motion";
import certificates from "../data/CertificateData.json";

const cardColors = ["bg-[#ffd166]", "bg-[#79c8ff]", "bg-[#75d6ad]", "bg-[#ff8fab]"];

const primaryDirectories = [...new Set(certificates.map((certificate) => certificate.categories?.[0] || certificate.category || "Sertifikat"))];

function getNestedCategories(directory) {
  return [
    ...new Set(
      certificates
        .filter((certificate) => (certificate.categories?.[0] || certificate.category || "Sertifikat") === directory)
        .map((certificate) => certificate.categories?.[1] || certificate.category || "Lainnya")
    ),
  ];
}

export default function Certificates() {
  const [activeDirectory, setActiveDirectory] = useState(primaryDirectories[0] || "");
  const nestedCategories = getNestedCategories(activeDirectory);
  const [activeCategory, setActiveCategory] = useState(nestedCategories[0] || "");
  const visibleCertificates = certificates.filter((certificate) => {
    const directory = certificate.categories?.[0] || certificate.category || "Sertifikat";
    const category = certificate.categories?.[1] || certificate.category || "Lainnya";
    return directory === activeDirectory && category === activeCategory;
  });

  function selectDirectory(directory) {
    setActiveDirectory(directory);
    setActiveCategory(getNestedCategories(directory)[0] || "");
  }

  return (
    <motion.div
      key="certificates"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="max-w-3xl">
        <p className="pixel-font mb-4 text-[10px] text-[#6c5ce7]">CERTIFICATE VAULT</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Kumpulan sertifikat dan kredensial.</h1>
        <p className="mt-5 text-lg text-[#4b5368]">
          Data sertifikat disiapkan untuk disinkronkan dari folder Google Drive dan ditampilkan otomatis di sini.
        </p>
      </header>

      {certificates.length > 0 ? (
        <section className="mt-10" aria-label="Koleksi sertifikat">
          {primaryDirectories.length > 1 ? (
            <div className="mb-8 flex flex-wrap gap-3" aria-label="Direktori utama">
              {primaryDirectories.map((directory) => (
                <button
                  key={directory}
                  type="button"
                  onClick={() => selectDirectory(directory)}
                  aria-pressed={activeDirectory === directory}
                  className={`pixel-button ${activeDirectory === directory ? "pixel-button-primary" : "bg-[#fffaf0]"}`}
                >
                  {directory}
                </button>
              ))}
            </div>
          ) : null}

          <div className="pixel-panel overflow-hidden bg-[#fffaf0]">
            <div className="overflow-x-auto border-b-[3px] border-[#17213c] bg-[#f3e7cd] px-4 pt-4">
              <div role="tablist" aria-label={`Kategori dalam ${activeDirectory}`} className="flex min-w-max items-end gap-2">
                {nestedCategories.map((category) => {
                  const selected = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveCategory(category)}
                      className={`min-h-[48px] border-[3px] border-b-0 border-[#17213c] px-5 py-3 font-black transition-transform focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6c5ce7] ${
                        selected ? "relative top-[3px] bg-[#fffaf0] text-[#4338a8]" : "bg-[#ffd166] hover:-translate-y-1"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div role="tabpanel" className="p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-dashed border-[#17213c]/30 pb-4">
                <div>
                  <p className="pixel-font text-[9px] text-[#6c5ce7]">{activeDirectory}</p>
                  <h2 className="mt-2 text-2xl font-black">{activeCategory}</h2>
                </div>
                <p className="pixel-font text-[9px] text-[#6c5ce7]">{visibleCertificates.length} CREDENTIAL</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visibleCertificates.map((certificate, index) => (
                  <CertificateCard
                    key={certificate.id || certificate.driveFileId || certificate.title}
                    certificate={certificate}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pixel-panel mt-10 overflow-hidden bg-[#fffaf0]">
          <div className="border-b-[3px] border-[#17213c] bg-[#ffd166] p-5">
            <p className="pixel-font text-[9px]">WAITING FOR SYNC</p>
          </div>
          <div className="p-7 sm:p-10">
            <h2 className="text-2xl font-black">Google Drive belum tersambung.</h2>
            <p className="mt-3 max-w-2xl text-[#4b5368]">
              Setelah integrasi aktif, file sertifikat dari folder yang dipilih akan muncul sebagai kartu lengkap dengan penerbit, tanggal, dan tautan verifikasi.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {["Folder Drive khusus", "Metadata sertifikat", "Tautan lihat atau verifikasi"].map((item, index) => (
                <div key={item} className="pixel-panel-sm bg-white p-4">
                  <span className="pixel-font text-[9px] text-[#6c5ce7]">STEP {index + 1}</span>
                  <p className="mt-3 font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}

function CertificateCard({ certificate, index }) {
  const color = cardColors[index % cardColors.length];
  const link = certificate.credentialUrl || certificate.webViewLink;

  return (
    <article className="pixel-panel-sm flex h-full flex-col overflow-hidden bg-[#fffaf0]">
      <div className={`border-b-2 border-[#17213c] p-5 ${color}`}>
        <span className="pixel-badge bg-white">{certificate.category || "Sertifikat"}</span>
        <p className="pixel-font mt-10 text-[9px]">CREDENTIAL {String(index + 1).padStart(2, "0")}</p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-black">{certificate.title}</h2>
        <p className="mt-2 font-bold text-[#4338a8]">{certificate.issuer}</p>
        {certificate.description ? <p className="mt-3 flex-1 text-[#5d6475]">{certificate.description}</p> : <div className="flex-1" />}
        <dl className="mt-6 border-t-2 border-dashed border-[#17213c]/30 pt-5">
          <div className="flex justify-between gap-4">
            <dt className="font-bold text-[#5d6475]">Terbit</dt>
            <dd className="font-black">{certificate.issueDate || "-"}</dd>
          </div>
          {certificate.credentialId ? (
            <div className="mt-2 flex justify-between gap-4">
              <dt className="font-bold text-[#5d6475]">Credential ID</dt>
              <dd className="break-all text-right font-black">{certificate.credentialId}</dd>
            </div>
          ) : null}
        </dl>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="pixel-button pixel-button-primary mt-6">
            Lihat sertifikat
          </a>
        ) : null}
      </div>
    </article>
  );
}
