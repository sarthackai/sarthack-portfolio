import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight } from 'react-icons/fi';
import { personalInfo } from '../data/resumeData';
import NeuralNetwork from './three/NeuralNetwork';

export default function Hero({ theme }) {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-layout">
          {/* Left — Text Content */}
          <div className="hero-content">
            <motion.span
              className="hero-greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hello, I'm
            </motion.span>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {personalInfo.name}
            </motion.h1>

            <motion.h2
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <span className="highlight">AI/ML</span> Engineer &{' '}
              <span className="highlight">Full Stack</span> Developer
            </motion.h2>

            {/* Cycling role subtitle */}
            <motion.span
              className="hero-roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <span className="hero-roles-track">
                <span>Machine Learning · Deep Learning · AI</span>
                <span>React · Python · TensorFlow</span>
                <span>Data Science · Neural Networks</span>
                <span>Full Stack Development · REST APIs</span>
                <span>Machine Learning · Deep Learning · AI</span>
              </span>
            </motion.span>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {personalInfo.careerObjective}
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <a href="#projects" className="glow-btn glow-btn-filled">
                View Projects <FiArrowRight />
              </a>
              <a
                href="/Sarthack_Resume_.pdf"
                download
                className="glow-btn"
              >
                <FiDownload /> Resume
              </a>
            </motion.div>

            <motion.div
              className="hero-socials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
              <a href={`mailto:${personalInfo.email}`} aria-label="Email">
                <FiMail />
              </a>
            </motion.div>
          </div>

          {/* Right — 3D Neural Network */}
          <motion.div
            className="hero-canvas"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <NeuralNetwork theme={theme} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="mouse" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
