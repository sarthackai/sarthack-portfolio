import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowUpRight, FiActivity, FiFilm, FiMonitor } from 'react-icons/fi';
import { projects } from '../data/resumeData';

const iconMap = {
  disease: <FiActivity size={24} />,
  recommendation: <FiFilm size={24} />,
  cinehub: <FiMonitor size={24} />,
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // First project is featured, rest are secondary
  const featured = projects[0];
  const secondary = projects.slice(1);

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

        <div className="projects-layout">
          {/* Featured Project */}
          <motion.div
            className="project-card project-card--featured glass-card"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
          >
            <div className="project-card-inner">
              <div className="project-number">01</div>
              <div className="project-card-main">
                <div className="project-card-header">
                  <div className={`project-card-icon ${featured.icon}`}>
                    {iconMap[featured.icon]}
                  </div>
                  <div className="project-card-header-text">
                    <h3>{featured.title}</h3>
                    <p className="project-card-tagline">{featured.description}</p>
                  </div>
                </div>

                <div className="project-card-body">
                  <div className="project-card-tags">
                    {featured.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {featured.github && (
                    <a
                      href={featured.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link"
                    >
                      View on GitHub <FiArrowUpRight />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Projects */}
          {secondary.length > 0 && (
            <div className="projects-secondary">
              {secondary.map((project, i) => (
                <motion.div
                  key={project.title}
                  className="project-card project-card--standard glass-card"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.15 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="project-card-inner">
                    <div className="project-number">{String(i + 2).padStart(2, '0')}</div>
                    <div className="project-card-main">
                      <div className="project-card-header">
                        <div className={`project-card-icon ${project.icon}`}>
                          {iconMap[project.icon]}
                        </div>
                        <div className="project-card-header-text">
                          <h3>{project.title}</h3>
                          <p className="project-card-tagline">{project.description}</p>
                        </div>
                      </div>

                      <div className="project-card-body">
                        <div className="project-card-tags">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card-link"
                          >
                            View on GitHub <FiArrowUpRight />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
