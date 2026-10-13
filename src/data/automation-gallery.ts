export type AutomationPlatform = 'n8n' | 'Make.com' | 'Zapier'
export const AUTOMATION_GALLERY = [
  { id: 'rag-agent', title: 'RAG-Based AI Agent', platform: 'n8n', summary: 'Find answers in company documents and keep the knowledge base in sync.', demo: '/work-in-action/basic-rag' },
  { id: 'hr-evaluation', title: 'HR Job Posting & Candidate Evaluation', platform: 'n8n', summary: 'Organize CV evidence, follow-ups, and interview scheduling for recruiter review.', demo: '/work-in-action/hr-assistant' },
  { id: 'appointment-setter', title: 'AI Appointment Setter', platform: 'n8n', summary: 'Check availability, book appointments, and reschedule through a voice workflow.', demo: '/work-in-action/ai-receptionist' },
  { id: 'short-video-creator', title: 'YouTube Shorts & Facebook Reels Creator', platform: 'n8n', summary: 'Generate short-form videos from a content plan, publish them, and log the results.' },
  { id: 'resume-optimizer', title: 'Job Scraper & Resume Optimizer', platform: 'n8n', summary: 'Find relevant roles and prepare tailored resume and email drafts for review.' },
  { id: 'messenger-agent', title: 'Facebook Messenger AI Agent', platform: 'n8n', summary: 'Answer customer messages using business information and conversation context.' },
  { id: 'xero-asana', title: 'Xero-to-Asana Reporting Pipeline', platform: 'Make.com', summary: 'Prepare transaction reports and attach CSV files to completed Asana tasks.' },
  { id: 'gmail-attachment-sorter', title: 'Gmail Attachment Auto-sort', platform: 'Make.com', summary: 'Identify and rename email attachments, save them to Drive, and log the files.' },
  { id: 'apollo-enrichment', title: 'Lead Enrichment in Apollo', platform: 'Zapier', summary: 'Enrich form leads with company details and route follow-ups by priority.' },
  { id: 'content-repurposing', title: 'AI Content Repurposing', platform: 'Zapier', summary: 'Turn video transcripts into blog content and social posts.' },
  { id: 'sales-follow-up', title: 'Lead Follow-up & Sales Pipeline', platform: 'Zapier', summary: 'Coordinate folders, tasks, and email follow-ups across sales stages.' },
] satisfies { id: string; title: string; platform: AutomationPlatform; summary: string; demo?: string }[]
