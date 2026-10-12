import { FlowArrow } from '@/components/slab'
import type { Icon } from '@/components/slab'
export type StackStatus = 'Live' | 'Internal' | 'Beta' | 'Example' | 'SYSTEM' | 'AUTOMATION' | 'AI SYSTEM' | 'E-COMMERCE' | 'CONTENT'
export type StackLogo = { src: string; name: string }
export type StackNode = { id: string; name: string; what: string; stack?: string; status?: StackStatus; Icon: Icon; logos?: StackLogo[]; children?: StackNode[] }
// Portfolio system concepts; no fabricated client delivery or performance claims.
export const aiStack: StackNode = {
  "name": "Systems I build",
  "what": "Automation systems built around how your business actually works.",
  "children": [
    {
      "name": "GoHighLevel systems",
      "what": "Capture leads, book calls and keep your pipeline moving.",
      "children": [
        {
          "status": "SYSTEM",
          "name": "Lead Capture & Follow-Up Engine",
          "Icon": FlowArrow,
          "id": "lead-capture-follow-up-engine",
          "stack": "GoHighLevel · Forms · Workflows",
          "what": "Capture inquiries, update contacts and start the right pipeline follow-up."
        },
        {
          "status": "SYSTEM",
          "name": "Appointment Booking & Reminders",
          "Icon": FlowArrow,
          "id": "appointment-booking-reminder-system",
          "stack": "GoHighLevel · Calendars · Workflows",
          "what": "Book appointments, send reminders and follow up on missed calls."
        },
        {
          "status": "SYSTEM",
          "name": "Lead Reactivation Engine",
          "Icon": FlowArrow,
          "id": "lead-reactivation-engine",
          "stack": "GoHighLevel · Campaigns · Workflows",
          "what": "Reconnect with older leads and route replies into the sales pipeline."
        },
        {
          "status": "SYSTEM",
          "name": "CRM Pipeline & Opportunities",
          "Icon": FlowArrow,
          "id": "crm-pipeline-opportunity-system",
          "stack": "GoHighLevel · Pipelines · Automation",
          "what": "Track opportunities, update stages and alert the team to next steps."
        }
      ],
      "id": "gohighlevel-systems",
      "Icon": FlowArrow
    },
    {
      "name": "Automation systems",
      "what": "Connect your tools and remove repetitive handoffs.",
      "children": [
        {
          "status": "AUTOMATION",
          "name": "Lead Routing & Enrichment Engine",
          "Icon": FlowArrow,
          "id": "lead-routing-enrichment-engine",
          "stack": "n8n · GoHighLevel · Google Sheets",
          "what": "Validate lead details, enrich records and route each inquiry automatically."
        },
        {
          "status": "AUTOMATION",
          "name": "Client Onboarding Automation",
          "Icon": FlowArrow,
          "id": "client-onboarding-automation",
          "stack": "Make · Gmail · Google Drive · GoHighLevel",
          "what": "Create tasks, send welcome emails and notify the team after signing."
        },
        {
          "status": "AUTOMATION",
          "name": "Cross-Platform Data Sync",
          "Icon": FlowArrow,
          "id": "cross-platform-data-sync",
          "stack": "Zapier · GoHighLevel · Google Sheets",
          "what": "Sync customer and lead records across tools without duplicate entry."
        },
        {
          "status": "AUTOMATION",
          "name": "Notification & Handoff System",
          "Icon": FlowArrow,
          "id": "internal-notification-handoff-system",
          "stack": "n8n · Slack · GoHighLevel",
          "what": "Alert the right teammate when a lead, order or task needs attention."
        }
      ],
      "id": "automation-systems",
      "Icon": FlowArrow
    },
    {
      "name": "AI & workflow systems",
      "what": "Support research, qualification and content with AI.",
      "children": [
        {
          "status": "AI SYSTEM",
          "name": "AI Lead Qualification Assistant",
          "Icon": FlowArrow,
          "id": "ai-lead-qualification-assistant",
          "stack": "AI · GoHighLevel · n8n",
          "what": "Summarize lead intent and help sales prioritize the next conversation."
        },
        {
          "status": "AI SYSTEM",
          "name": "AI Knowledge Assistant",
          "Icon": FlowArrow,
          "id": "ai-knowledge-assistant",
          "stack": "AI · RAG · Knowledge Base",
          "what": "Find answers in internal documents through an AI knowledge workflow."
        },
        {
          "status": "AI SYSTEM",
          "name": "AI Content Repurposing Workflow",
          "Icon": FlowArrow,
          "id": "ai-content-repurposing-workflow",
          "stack": "AI · n8n · Content Workflow",
          "what": "Turn one source into social posts, captions and content variations."
        }
      ],
      "id": "ai-workflow-systems",
      "Icon": FlowArrow
    },
    {
      "name": "E-commerce operations",
      "what": "Keep Shopify and Amazon operations organized.",
      "children": [
        {
          "status": "E-COMMERCE",
          "name": "Shopify Store Operations",
          "Icon": FlowArrow,
          "id": "shopify-store-operations",
          "stack": "Shopify · Gorgias · Google Sheets",
          "what": "Manage listings, clean product data and support everyday store operations."
        },
        {
          "status": "E-COMMERCE",
          "name": "Product Listing Optimization",
          "Icon": FlowArrow,
          "id": "product-listing-optimization",
          "stack": "Shopify · Amazon · SEO",
          "what": "Refine titles, descriptions and categories for clearer product pages."
        },
        {
          "status": "E-COMMERCE",
          "name": "Amazon Seller Operations",
          "Icon": FlowArrow,
          "id": "amazon-seller-operations",
          "stack": "Amazon · Seller Central · Google Sheets",
          "what": "Maintain listings, organize catalog data and support recurring seller tasks."
        }
      ],
      "id": "e-commerce-operations",
      "Icon": FlowArrow
    },
    {
      "name": "Social media operations",
      "what": "Plan, repurpose and publish content consistently.",
      "children": [
        {
          "status": "CONTENT",
          "name": "Content Repurposing Pipeline",
          "Icon": FlowArrow,
          "id": "content-repurposing-pipeline",
          "stack": "AI · CapCut · Canva",
          "what": "Repurpose videos and long-form content into platform-ready posts."
        },
        {
          "status": "CONTENT",
          "name": "Social Content Workflow",
          "Icon": FlowArrow,
          "id": "social-content-workflow",
          "stack": "Notion · Canva · Social Platforms",
          "what": "Keep ideas, approvals, assets and publishing in one repeatable process."
        }
      ],
      "id": "social-media-operations",
      "Icon": FlowArrow
    }
  ],
  "id": "root",
  "Icon": FlowArrow
}