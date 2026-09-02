import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { education } from '../data/resumeData';

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="education section" id="education">
      <div className="container" ref={ref}>
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label">Academic Background</span>
          <h2>Education</h2>
          <div className="underline" />
        </motion.div>

        <div className="timeline">
          {education.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item glass-card"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
            >
              <h3>{item.degree}</h3>
              <div className="institution">{item.institution}</div>
              <span className="period">
                <FiCalendar size={14} />
                {item.period}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
