import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import EmbedModal from './components/EmbedModal'
import { Analytics } from "@vercel/analytics/react"
import Home from './pages/Home'

// Environment Configuration
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/caedoai/30min'


export default function App() {
  const [embedModalOpen, setEmbedModalOpen] = useState(false)

  const openCalendly = () => setEmbedModalOpen(true)
  const closeCalendly = () => setEmbedModalOpen(false)

  return (
    <>
      <Navbar onBookCall={openCalendly} />
      <Analytics />
      {embedModalOpen && (
        <EmbedModal
          embedUrl={CALENDLY_URL}
          onClose={closeCalendly}
          title="Book a call with EditxLabs"
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Home onBookCall={openCalendly} />}
        />
      </Routes>
    </>
  )
}
