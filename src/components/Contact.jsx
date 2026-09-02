import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiSend } from 'react-icons/fi';
import { personalInfo } from '../data/resumeData';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="contact section" id="contact">
      <div className="container" ref={ref}>
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label">Let's Connect</span>
          <h2>Get In Touch</h2>
          <div className="underline" />
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Let's work together</h3>
            <p>
              I'm always open to discussing new projects, creative ideas, or opportunities to
              be part of your vision. Feel free to reach out!
            </p>

            <div className="contact-items">
              <a href={`mailto:${personalInfo.email}`} className="contact-item">
                <div className="contact-item-icon">
                  <FiMail />
                </div>
                <div className="contact-item-text">
                  <div className="label">Email</div>
                  <div className="value">{personalInfo.email}</div>
                </div>
              </a>

              <a href={`tel:${personalInfo.phone}`} className="contact-item">
                <div className="contact-item-icon">
                  <FiPhone />
                </div>
                <div className="contact-item-text">
                  <div className="label">Phone</div>
                  <div className="value">{personalInfo.phone}</div>
                </div>
              </a>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <FiMapPin />
                </div>
                <div className="contact-item-text">
                  <div className="label">Location</div>
                  <div className="value">{personalInfo.location}</div>
                </div>
              </div>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <div className="contact-item-icon">
                  <FiLinkedin />
                </div>
                <div className="contact-item-text">
                  <div className="label">LinkedIn</div>
                  <div className="value">Sarthack Das</div>
                </div>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <div className="contact-item-icon">
                  <FiGithub />
                </div>
                <div className="contact-item-text">
                  <div className="label">GitHub</div>
                  <div className="value">sarthackai</div>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form glass-card"
            style={{ padding: 32 }}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              // Opens mailto as fallback since there's no backend
              const formData = new FormData(e.target);
              const name = formData.get('name');
              const email = formData.get('email');
              const message = formData.get('message');
              window.location.href = `mailto:${personalInfo.email}?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(
                `From: ${name} (${email})\n\n${message}`
              )}`;
            }}
          >
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your Message" rows="5" required />
            </div>
            <button type="submit" className="glow-btn glow-btn-filled" style={{ width: '100%', justifyContent: 'center' }}>
              <FiSend /> Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
