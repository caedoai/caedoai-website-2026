import { useState, useEffect, useRef } from 'react'
import { useTypewriterAnimation } from '../hooks/useTypewriterAnimation'
import plans from '../data/plans.json'
import ticker from '../data/ticker.json'
import whyItems from '../data/why-items.json'
import faqs from '../data/faqs.json'
import painItems from '../data/pain-items.json'
import PrivacyPolicy from '../components/PrivacyPolicy'
import TermsOfService from '../components/TermsOfService'
import './Home.css'

// Environment Configuration
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'ali@caedoai.com'
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/caedo.ai/'
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/caedoai/30min'

const TICKER_ITEMS = ticker
const WHY_ITEMS = whyItems
const FAQS = faqs
const PAIN_ITEMS = painItems

// Review Images Configuration
const TOTAL_REVIEWS = 14

// Generate review array by splitting into two marquee rows
const generateReviewArray = (start, count) => {
  const arr = []
  for (let i = 0; i < count * 2; i++) {
    arr.push(((start + i) % TOTAL_REVIEWS) + 1)
  }
  return arr
}

const REVIEWS_ROW_1 = generateReviewArray(0, 6)
const REVIEWS_ROW_2 = generateReviewArray(6, 6)

function PainScroll() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const panelRef = useRef(null)
  const cardsRef = useRef(null)
  const counterRef = useRef(null)
  const fillRef = useRef(null)
  const cardRefs = useRef([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return

    let gsapCtx
    let killed = false

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (killed) return

      const section = sectionRef.current
      const cards = cardsRef.current
      if (!section || !cards) return

      gsapCtx = gsap.context(() => {
        const n = PAIN_ITEMS.length
        const gridEl = section.querySelector('.pain__grid')
        if (!gridEl) return

        // Get the actual scroll distance needed by measuring the cards container
        const initialHeight = gridEl.scrollHeight
        const vh = window.innerHeight
        const scrollDist = initialHeight - vh

        const trigger = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${scrollDist}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(Math.floor(self.progress * n), n - 1)
              setActive(idx)
              if (counterRef.current) counterRef.current.textContent = String(idx + 1).padStart(2, '0')
              if (fillRef.current) fillRef.current.style.width = `${((idx + 1) / n) * 100}%`
              gsap.set(cards, { y: -self.progress * scrollDist, overwrite: 'auto' })
            },
          },
        })
      }, section)
    }

    init()
    return () => {
      killed = true
      gsapCtx?.revert()
    }
  }, [isMobile])

  const scrollToCard = (i) => {
    const card = cardRefs.current[i]
    if (!card) return
    const y = card.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2 - card.offsetHeight / 2)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const n = PAIN_ITEMS.length

  return (
    <section ref={sectionRef} className="pain">
      <div className="pain__grid">

        {/* Pinned left panel */}
        <div ref={panelRef} className="pain__panel">
          <div className="pain__eyebrow">Sound familiar?</div>

          <div className="pain__titles">
            {PAIN_ITEMS.map((item, i) => (
              <h2 key={item.num} className={`pain__title${i === active ? ' pain__title--active' : ''}`}>
                {item.heading}
              </h2>
            ))}
          </div>

          <div className="pain__progress-row">
            <span ref={counterRef} className="pain__counter">01</span>
            <span className="pain__counter-total">/ {String(n).padStart(2, '0')}</span>
            <div className="pain__bar">
              <div ref={fillRef} className="pain__bar-fill" style={{ width: '25%' }} />
            </div>
          </div>

          <div className="pain__steps">
            {PAIN_ITEMS.map((item, i) => (
              <div
                key={item.num}
                className={`pain__step${i === active ? ' pain__step--active' : ''}`}
                onClick={() => scrollToCard(i)}
              >
                <span className="pain__step-dot" />
                <span className="pain__step-label">{item.chip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling cards deck */}
        <div ref={cardsRef} className="pain__cards">
          {PAIN_ITEMS.map((item, i) => (
            <article
              key={item.num}
              ref={(el) => (cardRefs.current[i] = el)}
              data-index={i}
              className={`pain__card${i === active ? ' pain__card--active' : ''}`}
            >
              <span className="pain__ghost-num">{item.num}</span>
              <div className="pain__card-meta">
                <span className="pain__card-num">{item.num}</span>
                <span className="pain__card-chip">{item.chip}</span>
              </div>
              <p className="pain__card-body">{item.body}</p>
              <div className="pain__card-result">
                <span className="pain__result-arrow">→</span>
                <span className="pain__result-text">Result: {item.result}</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

function FAQSection({ onBookCall }) {
  const [openIdx, setOpenIdx] = useState(0)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx)
  }

  return (
    <>
      <section id="faq" className="faq">
        <div className="faq__inner">
          <div className="faq__heading">
            <div className="faq__eyebrow"><span className="faq__dash" />FAQ</div>
            <h2 className="faq__title">Things people ask before they book.</h2>
            <p className="faq__sub">Still curious about something specific? Get a straight answer on a 20-minute call — no pitch deck.</p>
            <a href="#" className="faq__link" onClick={(e) => { e.preventDefault(); onBookCall?.() }}>
              Book a discovery call →
            </a>
          </div>

          <div className="faq__items">
            {FAQS.map((item, i) => (
              <div key={i} className="faq__item" data-open={openIdx === i ? '1' : '0'}>
                <button className="faq__btn" onClick={() => toggleFAQ(i)}>
                  <span>{item.q}</span>
                  <span className="faq__icon">{openIdx === i ? '−' : '+'}</span>
                </button>
                <div className="faq__panel" style={{ maxHeight: openIdx === i ? '500px' : '0px' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__glow" />
        <div className="cta__inner">
          <div className="cta__eyebrow">Ready when you are</div>
          <h2 className="cta__headline">Your next customer is searching right now.<br />Let's make sure they find you.</h2>
          {/* <p className="cta__sub">One dedicated manager, white-label by default. Your content machine — running without you.</p> */}

          <div className="cta__actions">
            <button className="cta__btn" onClick={onBookCall}>Book a discovery call →</button>
            <div className="cta__alt">Or email us at <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`} target="_blank" rel="noopener">{CONTACT_EMAIL}</a></div>
          </div>

          <div className="cta__trust">
            <div className="cta__trust-item"><span className="cta__check">✓</span>7-day money-back guarantee</div>
            <div className="cta__trust-item"  ><span className="cta__check">✓</span>Cancel anytime</div>
            <div className="cta__trust-item"><span className="cta__check">✓</span>White-label by default</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__main">
          <div className="footer__col footer__col--brand">
            <div className="footer__brand-name">CaedoAi</div>
            <p className="footer__brand-desc">Your dedicated, white-label web team, built to scale with your agency.</p>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Explore</div>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer__col">
            <div className="footer__col-title">Get in touch</div>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`} target="_blank" rel="noopener">{CONTACT_EMAIL}</a>
            <a href={INSTAGRAM_URL}>Instagram</a>
            <a href={CALENDLY_URL + '?back=1&month=2026-06'}>Calendly</a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">© 2026 CaedoAi. All rights reserved.</div>
          <div className="footer__links">
            <button className="footer__link-btn" onClick={() => setPrivacyOpen(true)}>Privacy</button>
            <button className="footer__link-btn" onClick={() => setTermsOpen(true)}>Terms</button>
            
          </div>
        </div>
      </footer>

      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfService isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  )
}

export default function Home({ onBookCall }) {
  const tickerTrack = [...TICKER_ITEMS, ...TICKER_ITEMS]
  const businessTypes = ['HVAC Business', 'Roofing Business', 'Electrician Business', 'Plumbing Business', 'Construction Business']
  const animatedText = useTypewriterAnimation(businessTypes, 80, 40, 2500)

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section id="top" className="home__hero">
        <div className="home__hero-orb-a" />
        <div className="home__hero-orb-b" />
        <div className="home__hero-inner">
          {/* <p className="home__eyebrow"><span className="home__eyebrow-dash" />EditxLabs Studio</p> */}
          <div className="home__headline-wrap">
            <h1 className="home__headline">
              Leading Web Partner for your <br /> <span className="home__headline-accent">{animatedText}<span className="home__cursor">I</span></span>
            </h1>
          </div>
          <p className="home__hero-sub">
            Your craft is the work. Ours is making sure your city finds you first.
          </p>
          <div className="home__hero-actions">
            <button className="home__btn-primary" onClick={onBookCall}>
              Book a call →
            </button>
            <a className="home__btn-ghost" href="#how-it-works">
              See how it works <span className="home__arrow">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="home__ticker">
        <div className="home__ticker-track">
          {tickerTrack.map((item, i) => (
            <span key={i} className="home__ticker-item">
              {item} <span className="home__ticker-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PAIN SCROLL ── */}
      <PainScroll />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="hiw">
        <div className="hiw__inner">
          <div className="hiw__eyebrow-row">
            <span className="hiw__eyebrow-dash" />How it works
          </div>
          <h2 className="hiw__title">Up and running FAST.</h2>
          <div className="hiw__grid">
            <div className="hiw__card">
              <div className="hiw__card-top">
                <span className="hiw__num">01</span>
                {/* <span className="hiw__tag">Day 1</span> */}
              </div>
              <h3 className="hiw__card-heading">Quick discovery call</h3>
              <p className="hiw__card-body">We map your style, brand, and client needs. Takes 20 minutes. You leave with a clear plan — we leave with everything we need to start.</p>
            </div>
            <div className="hiw__card">
              <div className="hiw__card-top">
                <span className="hiw__num">02</span>
                {/* <span className="hiw__tag">Day 2</span> */}
              </div>
              <h3 className="hiw__card-heading">We build it</h3>
              <p className="hiw__card-body">Send a Loom if you have context. That&apos;s it — We build your site from scratch — no recycled layouts. We handle everything. You focus on the jobs.</p>
            </div>
            <div className="hiw__card hiw__card--highlight">
              <div className="hiw__card-top">
                <span className="hiw__num">03</span>
                {/* <span className="hiw__tag hiw__tag--solid">Day 3 →</span> */}
              </div>
              <h3 className="hiw__card-heading">We grow it</h3>
              <p className="hiw__card-body">Launch is day one, not the finish line. Every month we're posting on your GBP, tracking your rankings, updating your content, and pushing you higher in every search that matters. The work doesn't stop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY EDITXLABS ── */}
      <section className="why">
        <div className="why__inner">
          <div className="why__eyebrow-row">
            <span className="why__eyebrow-dash" />Why EditxLabs
          </div>
          <h2 className="why__title">The thing none of our competitors have.</h2>
          <div className="why__grid">
            {WHY_ITEMS.map((item) => (
              <div key={item.pill} className="why__card">
                <span className="why__pill">{item.pill}</span>
                <h3 className="why__heading">{item.heading}</h3>
                <p className="why__body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENCY MATH ── */}
      <section className="amath">
        <div className="amath__inner">
          <div className="amath__eyebrow-row">
            <span className="amath__eyebrow-dash" />Agency math
          </div>
          <h2 className="amath__title">Two jobs.<br />It's already paid for.</h2>
          <p className="amath__sub">The average HVAC job is worth $300–$500 on the low end. A single AC replacement runs thousands of dollars. Your CaedoAi plan costs $497 a month. Two calls from Google and you're already in profit. Every lead after that is yours — free.</p>
          <div className="amath__eq">
            <div className="amath__eq-box">
              <div className="amath__eq-num">2 Jobs</div>
              <div className="amath__eq-label">Low End — Roughly $1000</div>
            </div>
            <div className="amath__eq-op">—</div>
            <div className="amath__eq-box">
              <div className="amath__eq-num">$497</div>
              <div className="amath__eq-label">Your monthly plan cost</div>
            </div>
            <div className="amath__eq-op">=</div>
            <div className="amath__eq-box amath__eq-box--result">
              <div className="amath__eq-num">Net Profit</div>
              <div className="amath__eq-label">Every call after that is pure margin.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="testi">
        <div className="testi__header-wrap">
          <div className="testi__eyebrow-row">
            <span className="testi__eyebrow-dash" />Testimonials
          </div>
          <div className="testi__header">
            <h2 className="testi__title">Don&apos;t takeour word for it.</h2>
            <div className="testi__rating">
              <div className="testi__rating-text">
                <span className="testi__rating-num">4.9/5</span>
                <span className="testi__rating-label">verified reviews</span>
              </div>
              <div className="testi__rating-stars">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Row 1 → */}
        <div className="testi__mq testi__mq--1">
          <div className="testi__mq-track testi__mq-track--l">
            {REVIEWS_ROW_1.map((n, i) => (
              <div key={i} className="testi__img-slot">
                <img
                  src={`/reviews/${n}.jpg`}
                  alt={`Review ${n}`}
                  className="testi__img"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 ← */}
        <div className="testi__mq testi__mq--2">
          <div className="testi__mq-track testi__mq-track--r">
            {REVIEWS_ROW_2.map((n, i) => (
              <div key={i} className="testi__img-slot">
                <img
                  src={`/reviews/${n}.jpg`}
                  alt={`Review ${n}`}
                  className="testi__img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="pricing">
        <div className="pricing__inner">

          {/* Header */}
          <div className="pricing__header">
            <p className="pricing__eyebrow"><span className="pricing__eyebrow-dash" />Plans &amp; Pricing</p>
            <h2 className="pricing__title">Our Prices.</h2>
            <p className="pricing__sub">
              One setup fee. One monthly rate. No hidden costs, no lock-in traps, no vague deliverables.
            </p>
          </div>

          {/* Trust chips */}
          <div className="pricing__chips">
            <span className="pricing__chip pricing__chip--primary">
              <span className="pricing__chip-check pricing__chip-check--lime">✓</span>
              7-day money-back guarantee
            </span>
            <span className="pricing__chip">
              <span className="pricing__chip-check">✓</span>
              Cancel anytime
            </span>
            {/* <span className="pricing__chip">
              <span className="pricing__chip-check">✓</span>
              No long-term contracts
            </span> */}
          </div>

          {/* Cards */}
          <div className="pricing__cards">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`pricing__card${plan.popular ? ' pricing__card--popular' : ''}`}
              >
                {plan.popular && <div className="pricing__badge">★ Most Popular</div>}

                <div className="pricing__plan-name">{plan.name}</div>
                <div className="pricing__plan-desc">{plan.descriptor}</div>

                <div className="pricing__price-row">
                  <span className="pricing__price">{plan.price}</span>
                  {plan.priceSuffix && <span className="pricing__price-suffix">{plan.priceSuffix}</span>}
                </div>
                {plan.priceNote && <div className="pricing__price-note">{plan.priceNote}</div>}

                <div className="pricing__stats">
                  {plan.stats.map((stat) => (
                    <div key={stat.label} className="pricing__stat">
                      <span className="pricing__stat-label">{stat.label}</span>
                      <span className="pricing__stat-value">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <ul className="pricing__features">
                  {plan.services.map((service, i) => (
                    <li key={i} className={`pricing__feature${i === 0 ? ' pricing__feature--lead' : ''}`}>
                      <span className="pricing__feature-check">✓</span>
                      {service}
                    </li>
                  ))}
                </ul>

                <button
                  className={`pricing__cta${plan.popular ? ' pricing__cta--solid' : ''}`}
                  onClick={onBookCall}
                >
                  {plan.ctaLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee band */}
          <div className="pricing__guarantee">
            <div className="pricing__guarantee-badge">
              <span className="pricing__guarantee-num">7</span>
              <span className="pricing__guarantee-unit">Days</span>
            </div>
            <div className="pricing__guarantee-body">
              <div className="pricing__guarantee-title">Money-back guarantee</div>
              <p className="pricing__guarantee-text">
                Not thrilled with the SEO results? Tell us within 7 days and we'll refund every cent — no forms, no friction, no awkward questions.
              </p>
            </div>
            {/* <div className="pricing__guarantee-list">
              <div className="pricing__guarantee-item"><span className="pricing__feature-check">✓</span>Cancel anytime</div>
              <div className="pricing__guarantee-item"><span className="pricing__feature-check">✓</span>No long-term contracts</div>
              <div className="pricing__guarantee-item"><span className="pricing__feature-check">✓</span>Keep all your files</div>
            </div> */}
          </div>

          {/* Closer */}
          <div className="pricing__closer">
            <div className="pricing__closer-text">Not sure which plan fits? Let's figure it out together.</div>
            <button className="pricing__closer-cta" onClick={onBookCall}>
              Book a Discovery Call →
            </button>
          </div>

        </div>
      </section>

      {/* ── FAQ, CTA, FOOTER ── */}
      <FAQSection onBookCall={onBookCall} />

    </main>
  )
}
