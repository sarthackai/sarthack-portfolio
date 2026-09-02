import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiAward } from 'react-icons/fi';
import { certifications } from '../data/resumeData';

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="certifications section" id="certifications">
      <div className="container" ref={ref}>
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label">Credentials</span>
          <h2>Certifications</h2>
          <div className="underline" />
        </motion.div>

        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              className="cert-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="cert-badge">
                <FiAward className="cert-badge-icon" />
              </div>
              <h3>{cert.title}</h3>
              <div className="cert-issuer">{cert.issuer}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
