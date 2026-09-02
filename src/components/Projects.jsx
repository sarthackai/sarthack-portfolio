import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowUpRight, FiActivity, FiFilm } from 'react-icons/fi';
import { projects, personalInfo } from '../data/resumeData';

const iconMap = {
  disease: <FiActivity size={28} />,
  recommendation: <FiFilm size={28} />,
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="projects section" id="projects">
      <div className="container" ref={ref}>
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label">What I've Built</span>
          <h2>Projects</h2>
          <div className="underline" />
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="project-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="project-card-header">
                <div className={`project-card-icon ${project.icon}`}>
                  {iconMap[project.icon]}
                </div>
                <h3>{project.title}</h3>
              </div>

              <div className="project-card-body">
                <div className="project-card-tags">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                >
                  View on GitHub <FiArrowUpRight />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
