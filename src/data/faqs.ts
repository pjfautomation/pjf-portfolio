export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
    a: 'I build and configure GoHighLevel systems, including CRM pipelines, lead follow-up and nurture workflows. I also connect tools with n8n, Make.com and Zapier, with Shopify and Amazon VA support as additional services.',
  },
  {
    q: 'How fast can you start?',
    a: 'Send the current process, tools and outcome you want. We can then define the right scope for a setup, integration or operations project.',
  },
  {
    q: 'How much do you charge?',
    a: 'Pricing depends on the system, workflow and level of ongoing support. Contact me with the details and I can help define the scope before quoting.',
  },
  {
    q: 'Where are you based?',
    a: 'I am based in Bacoor, Cavite, Philippines and can coordinate remotely with client teams.',
  },
  {
    q: 'What happens after I write?',
    a: 'Your message goes to philipjeidf@gmail.com. Include your tools, process and goal so we can identify a practical next step.',
  },
]
