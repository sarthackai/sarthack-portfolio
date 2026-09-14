import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  FiCode,
  FiLayout,
  FiServer,
  FiDatabase,
  FiCpu,
  FiTool,
  FiBookOpen,
} from 'react-icons/fi';
import { technicalSkills } from '../data/resumeData';

const categories = [
  {
    title: 'Programming Languages',
    icon: <FiCode />,
    skills: technicalSkills.languages,
  },
  {
    title: 'Frontend',
    icon: <FiLayout />,
    skills: technicalSkills.frontend,
  },
  {
    title: 'Backend',
    icon: <FiServer />,
    skills: technicalSkills.backend,
  },
  {
    title: 'Databases',
    icon: <FiDatabase />,
    skills: technicalSkills.databases,
  },
  {
    title: 'Machine Learning',
    icon: <FiCpu />,
    skills: technicalSkills.machineLearning,
  },
  {
    title: 'Core Subjects',
    icon: <FiBookOpen />,
    skills: technicalSkills.coreSubjects,
  },
  {
    title: 'Developer Tools',
    icon: <FiTool />,
    skills: technicalSkills.devTools,
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="skills section section-with-grid" id="skills">
      <div className="container" ref={ref}>
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label">What I Work With</span>
          <h2>Technical Skills</h2>
          <div className="underline" />
        </motion.div>

        <div className="skills-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="skill-category glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <div className="skill-category-header">
                <div className="skill-category-icon">{cat.icon}</div>
                <h3>{cat.title}</h3>
              </div>
              <div className="skill-list">
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="skill-pill"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
