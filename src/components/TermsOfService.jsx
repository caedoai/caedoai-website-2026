import styles from './TermsOfService.module.css'

export default function TermsOfService({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.content}>
          <h1>Terms of Service</h1>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the CaedoAi website, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, 
            please do not use this service.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) 
            on CaedoAi' website for personal, non-commercial transitory viewing only. This is the grant of 
            a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or other proprietary notations</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on CaedoAi' website are provided on an 'as is' basis. CaedoAi makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
            implied warranties or conditions of merchantability, fitness for a particular purpose, 
            or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall CaedoAi or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or 
            inability to use the materials on CaedoAi' website.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on CaedoAi' website could include technical, typographical, or photographic errors. 
            CaedoAi does not warrant that any of the materials on our website are accurate, complete, or current. 
            CaedoAi may make changes to the materials contained on our website at any time without notice.
          </p>

          <h2>6. Materials Reference</h2>
          <p>
            CaedoAi has not reviewed all of the sites linked to our website and is not responsible for the contents 
            of any such linked site. The inclusion of any link does not imply endorsement by CaedoAi of the site. 
            Use of any such linked website is at the user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            CaedoAi may revise these terms of service for our website at any time without notice. 
            By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction 
            where CaedoAi operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that 
            location.
          </p>

          <h2>9. User Responsibilities</h2>
          <p>
            Users agree to:
          </p>
          <ul>
            <li>Provide accurate and truthful information when contacting us</li>
            <li>Respect intellectual property rights</li>
            <li>Not engage in illegal or harmful activities</li>
            <li>Not attempt to gain unauthorized access to our systems</li>
          </ul>

          <h2>10. Intellectual Property</h2>
          <p>
            All content on CaedoAi' website, including text, graphics, logos, images, and software, 
            is the property of CaedoAi or its content suppliers and is protected by international copyright laws. 
            Unauthorized reproduction or use is prohibited.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            For questions regarding these terms, please contact us at <a href="mailto:caedoai@gmail.com">caedoai@gmail.com</a>
          </p>

          <p className={styles.lastUpdated}>Last updated: April 2026</p>
        </div>
      </div>
    </div>
  )
}
