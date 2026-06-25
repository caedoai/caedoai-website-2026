import styles from './PrivacyPolicy.module.css'

export default function PrivacyPolicy({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.content}>
          <h1>Privacy Policy</h1>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you voluntarily provide when contacting us through our website forms, 
            including your name, email address, phone number, company information, and project details. 
            We also automatically collect usage data such as IP addresses, browser types, pages visited, 
            and timestamps to improve our website performance and security.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to:
          </p>
          <ul>
            <li>Respond to your inquiries and provide requested services</li>
            <li>Send project updates and communications</li>
            <li>Improve website functionality and user experience</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption, secure data storage, 
            and regular security audits to protect your personal information from unauthorized access, 
            alteration, and disclosure.
          </p>

          <h2>4. Third-Party Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share 
            information with trusted service providers who assist us in operating our website and conducting 
            our business, subject to confidentiality agreements. We may also disclose information when required 
            by law or to protect our legal rights.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            Our website uses cookies and similar tracking technologies to enhance your experience and 
            analyze site usage. You can control cookie preferences through your browser settings. Note that 
            disabling cookies may affect website functionality.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide services and fulfill 
            the purposes outlined in this policy, unless a longer retention period is required by law. 
            You may request deletion of your data at any time.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about our privacy practices or wish to exercise your rights,
            please contact us at <a href="mailto:caedoai@gmail.com">caedoai@gmail.com</a>
          </p>

          <h2>9. Policy Updates</h2>
          <p>
            We may update this privacy policy periodically. Significant changes will be communicated 
            to you via email or posted prominently on our website. Your continued use of our website 
            constitutes acceptance of the updated policy.
          </p>

          <p className={styles.lastUpdated}>Last updated: April 2026</p>
        </div>
      </div>
    </div>
  )
}
