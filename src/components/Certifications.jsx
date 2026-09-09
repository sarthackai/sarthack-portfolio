import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiAward, FiExternalLink, FiX } from 'react-icons/fi';
import { certifications } from '../data/resumeData';

/* ────────────────────────────────────────────────────
   Certificate Lightbox Modal
   ──────────────────────────────────────────────────── */
function CertificateModal({ cert, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!cert) return null;

  return (
    <div
      className="cert-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate preview: ${cert.title}`}
    >
      <div
        className="cert-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="cert-modal-close"
          onClick={onClose}
          aria-label="Close certificate preview"
        >
          <FiX />
        </button>

        <div className="cert-modal-image-wrapper">
          <img
            src={cert.image}
            alt={`Certificate: ${cert.title} from ${cert.issuer}`}
            className="cert-modal-image"
          />
        </div>

        <div className="cert-modal-info">
          <h3>{cert.title}</h3>
          <p className="cert-modal-issuer">{cert.issuer}</p>
          {cert.date && <p className="cert-modal-date">{cert.date}</p>}
          {cert.verificationUrl && (
            <a
              href={cert.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-verify-btn"
              aria-label={`Verify certificate: ${cert.title}`}
            >
              <FiExternalLink />
              Verify Certificate
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Individual Certificate Card
   ──────────────────────────────────────────────────── */
function CertCard({ cert, onClick }) {
  return (
    <div
      className="cert-slide-card"
      onClick={() => onClick(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(cert);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View certificate: ${cert.title} from ${cert.issuer}`}
    >
      <div className="cert-slide-image-wrapper">
        <img
          src={cert.image}
          alt={`${cert.title} — ${cert.issuer}`}
          className="cert-slide-image"
          loading="lazy"
        />
        <div className="cert-slide-overlay">
          <FiAward className="cert-slide-overlay-icon" />
          <span>View Certificate</span>
        </div>
      </div>
      <div className="cert-slide-info">
        <h3 className="cert-slide-title">{cert.title}</h3>
        <p className="cert-slide-issuer">{cert.issuer}</p>
        {cert.date && <p className="cert-slide-date">{cert.date}</p>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Main Certifications Section
   ──────────────────────────────────────────────────── */
export default function Certifications() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleOpen = useCallback((cert) => {
    setSelectedCert(cert);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCert(null);
  }, []);

  // Duplicate certs for seamless loop — we render 3 copies so
  // the track always wraps without gaps
  const trackCerts = [...certifications, ...certifications, ...certifications];

  return (
    <section className="certifications section" id="certifications">
      <div className="container" ref={sectionRef}>
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

        {/* Ambient glow behind the marquee */}
        <div className="cert-marquee-glow" aria-hidden="true" />

        {/* Marquee container */}
        <motion.div
          className="cert-marquee-wrapper"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-label="Certificate carousel"
        >
          {/* Fade edges */}
          <div className="cert-marquee-fade cert-marquee-fade--left" aria-hidden="true" />
          <div className="cert-marquee-fade cert-marquee-fade--right" aria-hidden="true" />

          {/* Sliding track */}
          <div
            className={`cert-marquee-track${isPaused ? ' paused' : ''}`}
          >
            {trackCerts.map((cert, i) => (
              <CertCard
                key={`cert-${i}`}
                cert={cert}
                onClick={handleOpen}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={handleClose} />
      )}
    </section>
  );
}
