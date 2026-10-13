// Requires Sharp from the bundled runtime; source files stay untouched.
const sharp = require('sharp')
const path = require('node:path')
const fs = require('node:fs/promises')
const sources = [
  ['rag-agent', 'RAG-Based AI Agent - n8n.png'],
  ['hr-evaluation', 'HR Job Posting & AI Candidate Evaluation = n8n.png'],
  ['appointment-setter', 'AI Appointment Setter - N8N.png'],
  ['short-video-creator', 'Automated YouTube Shorts and Facebook Reels Creator - n8n.png'],
  ['resume-optimizer', 'AI Job Scraper + Resume Optimizer - n8n.png'],
  ['messenger-agent', 'AI Agent for Facbook Messenger - n8n.png'],
  ['xero-asana', 'Xero-to-Asana Reporting Pipeline.png'],
  ['gmail-attachment-sorter', 'Gmail Attachment Auto-sort Make.com'],
  ['apollo-enrichment', 'Automated Lead Enrichment in Apollo.png'],
  ['content-repurposing', 'AI Content Repurposing Zapier.png'],
  ['sales-follow-up', 'Lead Follow Up & Sales Pipeline Automation - Zapier.png'],
]
;(async () => {
  if (!process.argv[2]) throw Error('Provide the source image directory')
  const destination = path.resolve('public/automation-gallery')
  await fs.mkdir(destination, { recursive: true })
  for (const [id, file] of sources) {
    const source = path.join(process.argv[2], file)
    await sharp(source).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(destination, `${id}-thumb.webp`))
    await sharp(source).webp({ quality: 88 }).toFile(path.join(destination, `${id}.webp`))
  }
  console.log('Generated 11 complete thumbnails and 11 full-size images.')
})().catch(error => { console.error(error); process.exit(1) })
