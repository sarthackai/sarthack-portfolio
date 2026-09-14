import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { personalInfo } from '../data/resumeData';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="about section section-with-grid" id="about">
      <div className="container" ref={ref}>
        <div className="about-layout">
          {/* Left — Sticky heading + monogram */}
          <motion.div
            className="about-left"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="section-heading section-heading--left">
              <span className="label">Get to Know Me</span>
              <h2>About Me</h2>
              <div className="underline" />
            </div>

            <div className="about-monogram">
              <span className="about-monogram-text">SD</span>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            className="about-right"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3>
              I'm <span style={{ color: 'var(--accent-primary)' }}>Sarthack Das</span>
            </h3>
            <p>{personalInfo.careerObjective}</p>
            <p>
              Currently pursuing B.Tech in CSE with specialization in AI/ML at Techno India
              University, building real-world projects that combine machine learning with modern
              web development.
            </p>

            <div className="about-info-grid">
              <div className="about-info-item">
                <div className="info-label">
                  <FiMapPin style={{ marginRight: 4, verticalAlign: 'middle' }} /> Location
                </div>
                <div className="info-value">{personalInfo.location}</div>
              </div>
              <div className="about-info-item">
                <div className="info-label">
                  <FiMail style={{ marginRight: 4, verticalAlign: 'middle' }} /> Email
                </div>
                <div className="info-value">{personalInfo.email}</div>
              </div>
              <div className="about-info-item">
                <div className="info-label">
                  <FiPhone style={{ marginRight: 4, verticalAlign: 'middle' }} /> Phone
                </div>
                <div className="info-value">{personalInfo.phone}</div>
              </div>
              <div className="about-info-item">
                <div className="info-label">🎓 Degree</div>
                <div className="info-value">B.Tech CSE AI/ML</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
