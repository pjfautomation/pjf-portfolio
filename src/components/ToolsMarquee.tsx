const tools = [
  { name: 'GoHighLevel', iconPath: '/icons/gohighlevel.png' },
  { name: 'n8n', iconPath: '/icons/thesvg/n8n.svg' },
  { name: 'Make', iconPath: '/icons/thesvg/make.svg' },
  { name: 'Zapier', iconPath: '/icons/thesvg/zapier.svg' },
  { name: 'Shopify', iconPath: '/icons/thesvg/shopify.svg' },
  { name: 'Claude', iconPath: '/icons/thesvg/claude.svg' },
  { name: 'ChatGPT', iconPath: '/icons/thesvg/openai-chatgpt.svg' },
  { name: 'WordPress', iconPath: '/icons/thesvg/wordpress.svg' },
  { name: 'Twilio', iconPath: '/icons/thesvg/twilio.svg' },
  { name: 'Meta', iconPath: '/icons/thesvg/meta.svg' },
  { name: 'Google Ads', iconPath: '/icons/thesvg/google-ads.svg' },
  { name: 'Gmail', iconPath: '/icons/thesvg/gmail.svg' },
  { name: 'Google Sheets', iconPath: '/icons/thesvg/google-sheets.svg' },
  { name: 'Google Calendar', iconPath: '/icons/thesvg/google-calendar.svg' },
  { name: 'Stripe', iconPath: '/icons/thesvg/stripe.svg' },
] as const
/** Brand SVGs are saved locally; source URLs live in icons/thesvg/sources.json.
 * HighLevel retains its existing mark because the catalog does not include it. */

export default function ToolsMarquee() {
  return (
    <section className="tools-marquee" aria-label="Tools I work with" tabIndex={0}>
      <div className="tools-marquee__track" aria-hidden="true">
        {/* Each group includes the trailing gap, keeping the reset seamless. */}
        {[0, 1].map((copy) => (
          <div className="tools-marquee__group" key={copy}>
            {tools.map((tool) => (
              <div className="tools-marquee__item" key={tool.name}>
                <img className="tools-marquee__img" src={tool.iconPath} alt="" decoding="async" width={26} height={26} />
                <span className="tools-marquee__label">{tool.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {tools.map((tool) => <li key={tool.name}>{tool.name}</li>)}
      </ul>
    </section>
  )
}
