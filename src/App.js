import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import AboutMe from "./pages/AboutMe";
import ContactMe from "./pages/ContactMe";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";

export default function App() {
  const [activePage, setActivePage] = useState("/");

  const pages = {
    "/": <Home onNavigate={setActivePage} />,
    "about-me": <AboutMe />,
    projects: <Projects />,
    certificates: <Certificates />,
    "contact-me": <ContactMe />,
  };

  return (
    <Layout setIsNavbar={setActivePage} isNavbar={activePage}>
      <AnimatePresence mode="wait">{pages[activePage]}</AnimatePresence>
    </Layout>
  );
}
