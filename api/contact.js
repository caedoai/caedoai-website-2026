// Vercel Serverless Function — proxies contact-form submissions to Google Apps Script.
// Hides the Apps Script URL, validates input, blocks spam, rate-limits by IP.

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000  // 10 minutes
const RATE_LIMIT_MAX = 5                     // 5 submits per window per IP
const HOURLY_WINDOW_MS = 60 * 60 * 1000
const HOURLY_MAX = 20
const MIN_SUBMIT_MS = 2000                   // reject submits faster than 2s

const ALLOWED_SERVICES = new Set([
  'VSL', 'Lifestyle', 'Faceless', 'Podcasts', 'Intro Vid', 'UGC',
  'Motion Graphics', 'Thumbnails', 'Ad Creatives', 'Short-form',
  'Long-form', 'Other',
])

const hits = new Map()

function getIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function rateLimited(ip) {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < HOURLY_WINDOW_MS)
  const recent = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) return true
  if (arr.length >= HOURLY_MAX) return true
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > HOURLY_WINDOW_MS)) hits.delete(k)
    }
  }
  return false
}

// Google Sheets formula-injection guard. Prefix dangerous leading chars with '.
function sanitizeForSheet(v) {
  if (typeof v !== 'string') return ''
  const stripped = v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim()
  if (/^[=+\-@\t\r]/.test(stripped)) return "'" + stripped
  return stripped
}

function isString(v, { min = 0, max } = {}) {
  if (typeof v !== 'string') return false
  if (v.length < min) return false
  if (max != null && v.length > max) return false
  return true
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_RE = /^[\d+()\-\s]+$/
const NAME_RE = /^[a-zA-Z\s'.-]+$/
const URL_RE = /^https?:\/\/[^\s<>"']{3,200}$/i

function validateContact(body) {
  const errors = []
  if (!isString(body.name, { min: 1, max: 70 }) || !NAME_RE.test(body.name)) errors.push('name')
  if (!isString(body.company, { min: 1, max: 70 })) errors.push('company')
  if (!isString(body.message, { min: 1, max: 500 })) errors.push('message')
  if (!isString(body.email, { max: 70 }) || !EMAIL_RE.test(body.email)) errors.push('email')
  if (body.phone !== '' && !(isString(body.phone, { max: 30 }) && PHONE_RE.test(body.phone))) errors.push('phone')
  if (!Array.isArray(body.services) || body.services.length === 0 || body.services.length > 12) errors.push('services')
  else if (!body.services.every((s) => ALLOWED_SERVICES.has(s))) errors.push('services')
  return errors
}

function validateCareers(body) {
  const errors = []
  if (!isString(body.name, { min: 1, max: 70 }) || !NAME_RE.test(body.name)) errors.push('name')
  if (!isString(body.email, { max: 70 }) || !EMAIL_RE.test(body.email)) errors.push('email')
  if (body.phone !== '' && !(isString(body.phone, { max: 30 }) && PHONE_RE.test(body.phone))) errors.push('phone')
  if (body.portfolioLink !== '' && !(isString(body.portfolioLink, { max: 200 }) && URL_RE.test(body.portfolioLink))) errors.push('portfolioLink')
  return errors
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method_not_allowed' })
  }

  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ success: false, error: 'unsupported_media_type' })
  }

  const ip = getIp(req)
  if (rateLimited(ip)) {
    res.setHeader('Retry-After', '600')
    return res.status(429).json({ success: false, error: 'rate_limited' })
  }

  const body = req.body && typeof req.body === 'object' ? req.body : null
  if (!body) return res.status(400).json({ success: false, error: 'invalid_body' })

  // Honeypot — bots fill this hidden field.
  if (body.website && String(body.website).length > 0) {
    return res.status(200).json({ success: true })  // silent success
  }

  // Min time-on-page.
  const loadedAt = Number(body.loadedAt)
  if (!Number.isFinite(loadedAt) || Date.now() - loadedAt < MIN_SUBMIT_MS) {
    return res.status(400).json({ success: false, error: 'too_fast' })
  }

  const formType = body.formType
  if (formType !== 'contact' && formType !== 'careers') {
    return res.status(400).json({ success: false, error: 'invalid_form_type' })
  }

  const errors = formType === 'contact' ? validateContact(body) : validateCareers(body)
  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'validation', fields: errors })
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL
  const secret = process.env.SHARED_SECRET
  if (!scriptUrl || !secret) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Missing APPS_SCRIPT_URL or SHARED_SECRET env var')
    }
    return res.status(500).json({ success: false, error: 'server_misconfigured' })
  }

  const payload =
    formType === 'contact'
      ? {
          formType: 'contact',
          name: sanitizeForSheet(body.name),
          company: sanitizeForSheet(body.company),
          services: body.services.map(sanitizeForSheet).join(', '),
          message: sanitizeForSheet(body.message),
          email: sanitizeForSheet(body.email),
          phone: sanitizeForSheet(body.phone || ''),
        }
      : {
          formType: 'careers',
          name: sanitizeForSheet(body.name),
          email: sanitizeForSheet(body.email),
          phone: sanitizeForSheet(body.phone || ''),
          portfolioLink: sanitizeForSheet(body.portfolioLink || ''),
        }

  const params = new URLSearchParams(payload)
  // Apps Script doPost cannot read custom HTTP headers — pass the secret as a body field.
  params.append('secret', secret)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!upstream.ok) {
      return res.status(502).json({ success: false, error: 'upstream_error' })
    }
    const text = await upstream.text()
    let parsed = null
    try { parsed = JSON.parse(text) } catch {}
    if (parsed && parsed.success) return res.status(200).json({ success: true })
    return res.status(502).json({ success: false, error: 'upstream_rejected' })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Upstream fetch failed:', err?.message || err)
    }
    return res.status(502).json({ success: false, error: 'upstream_unreachable' })
  }
}
