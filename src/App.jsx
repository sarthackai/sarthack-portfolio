import { useState, useEffect } from 'react';
import ThemeProvider, { useTheme } from './context/ThemeProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleField from './components/three/ParticleField';

function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop
    const mql = window.matchMedia('(min-width: 769px) and (pointer: fine)');
    if (!mql.matches) return;

    setVisible(true);

    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="cursor-glow"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <CursorGlow />
      <ParticleField theme={theme} />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero theme={theme} />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
