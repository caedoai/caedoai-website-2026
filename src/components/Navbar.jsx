import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'


export default function Navbar({ onBookCall }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollRef = useRef(0)
  const logoVideoRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll > lastScrollRef.current && currentScroll > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setScrolled(currentScroll > 40)
      lastScrollRef.current = currentScroll
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (logoVideoRef.current) {
      logoVideoRef.current.playbackRate = 2
    }
  }, [])

  const goHome = () => {
    setMobileMenuOpen(false)
    navigate('/')
    window.scrollTo(0, 0)
  }

  const goToPricing = () => {
    setMobileMenuOpen(false)
    if (location.pathname === '/') {
      const pricingSection = document.getElementById('pricing')
      if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing')
        if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    }
  }

  const closeMobile = () => setMobileMenuOpen(false)

  const navBtnClass = ({ isActive }) =>
    `${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
      <button className={styles.logo} onClick={goHome} aria-label="CaedoAi home">
        <picture>
          <source srcSet="/caeodo-logo.webp" type="image/webp" />
          <source srcSet="/caeodo-logo.jpg" type="image/jpeg" />
          <img src="/caeodo-logo.jpg" alt="CaedoAi Logo" className={styles.logoImg} />
        </picture>
      </button>

      <button
        className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={styles.rightContainer}>
        <ul className={`${styles.links} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <li>
            <NavLink to="/" end className={navBtnClass} onClick={closeMobile}>
              Home
            </NavLink>
          </li>
          <li>
            <button className={styles.navBtn} onClick={goToPricing}>
              Pricing
            </button>
          </li>
          <li className={styles.ctaLi}>
            <button className={styles.ctaMobile} onClick={() => { closeMobile(); onBookCall() }}>
              Book a free call
            </button>
          </li>
        </ul>

        <button className={styles.cta} onClick={onBookCall}>
          Book a free call
        </button>
      </div>
    </nav>
  )
}
