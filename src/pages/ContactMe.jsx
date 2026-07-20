import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import DynamicIcon from "../components/DynamicIcon";
import { getSiteLink, isExternalLink, siteConfig } from "../data/SiteConfig";

export default function ContactMe() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({ form_name: "", email: "", message: "" });

  const sendEmail = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAIL_SERVICE,
        process.env.REACT_APP_EMAIL_TEMPLATE,
        {
          from_name: formData.form_name,
          message: formData.message,
          email: formData.email,
        },
        process.env.REACT_APP_EMAIL_JS_USER_ID
      );
      setStatus("success");
      setFormData({ form_name: "", email: "", message: "" });
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <header className="max-w-3xl">
        <p className="pixel-font mb-4 text-[10px] text-[#6c5ce7]">START A CONVERSATION</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Ada ide, peluang, atau sekadar ingin kenalan?</h1>
        <p className="mt-5 text-lg text-[#4b5368]">
          Ceritakan kebutuhanmu dengan bahasa biasa. Saya akan membalas sejelas dan secepat yang saya bisa.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-5" aria-labelledby="direct-contact-title">
          <div className="pixel-panel bg-[#6c5ce7] p-6 text-white sm:p-8">
            <p className="pixel-font text-[9px] text-[#ffd166]">QUICK CONTACT</p>
            <h2 id="direct-contact-title" className="mt-4 text-2xl font-black">Jalur langsung</h2>
            <p className="mt-3 text-white/85">Pilih platform yang paling nyaman untukmu.</p>
          </div>

          {siteConfig.contactLinkKeys.map((linkKey) => {
            const contact = getSiteLink(linkKey);
            const className = "pixel-panel-sm flex min-h-[76px] items-center gap-4 p-4 transition-transform hover:-translate-y-1";
            const content = (
              <>
                <span className={`grid h-12 w-12 shrink-0 place-items-center border-2 border-[#17213c] ${contact.color}`}>
                  <DynamicIcon name={contact.icon} className="text-2xl" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-[#5d6475]">{contact.label}</span>
                  <span className="block truncate font-black">{contact.value}</span>
                </span>
              </>
            );

            return isExternalLink(contact.href) ? (
              <a key={linkKey} href={contact.href} target="_blank" rel="noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <a key={linkKey} href={contact.href} className={className}>
                {content}
              </a>
            );
          })}

          <div className="border-2 border-dashed border-[#17213c] bg-[#f3e7cd] p-5">
            <p className="font-bold">Biasanya saya membalas dalam 1–2 hari kerja.</p>
          </div>
        </aside>

        <section className="pixel-panel p-6 sm:p-9" aria-labelledby="contact-form-title">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border-2 border-[#17213c] bg-[#ff8fab] font-black">M</span>
            <div>
              <p className="text-sm font-bold text-[#5d6475]">Kirim pesan</p>
              <h2 id="contact-form-title" className="text-2xl font-black">Mari mulai dari sini</h2>
            </div>
          </div>

          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block font-black">Nama</label>
                <input
                  id="contact-name"
                  name="user_name"
                  type="text"
                  autoComplete="name"
                  required
                  className="pixel-input"
                  placeholder="Nama lengkap"
                  value={formData.form_name}
                  onChange={(event) => setFormData({ ...formData, form_name: event.target.value })}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block font-black">Email</label>
                <input
                  id="contact-email"
                  name="user_email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pixel-input"
                  placeholder="nama@perusahaan.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block font-black">Pesan</label>
              <textarea
                id="contact-message"
                name="message"
                rows="7"
                required
                className="pixel-input resize-y"
                placeholder="Halo Aliezzar, saya ingin membahas..."
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button type="submit" disabled={status === "loading"} className="pixel-button pixel-button-primary disabled:cursor-not-allowed disabled:opacity-60">
                {status === "loading" ? "Mengirim..." : "Kirim pesan"}
                <span aria-hidden="true">→</span>
              </button>
              <div className="min-h-[24px]" aria-live="polite">
                {status === "success" ? <p className="font-bold text-[#176746]">Pesan terkirim. Terima kasih!</p> : null}
                {status === "error" ? <p className="font-bold text-[#b42318]">Pesan belum terkirim. Silakan coba lagi atau gunakan email langsung.</p> : null}
              </div>
            </div>
          </form>
        </section>
      </div>
    </motion.div>
  );
}
