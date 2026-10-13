export default function ReceptionIcon({ tool }: { tool: string }) {
  const paths: Record<string, string> = {
    Webhook: 'M6 9a4 4 0 1 1 8 0 M10 13l6 10 M18 24a4 4 0 1 0 8 0 M22 20l-7-11 M6 9l-3 14 M3 23h15',
    'Careers website': 'M3 4h26v24H3z M3 10h26 M9 16h14 M9 21h9',
    'Chat Trigger': 'M3 4h26v20H11l-8 5z M8 10h16 M8 16h10',
    'AI Agent': 'M6 9h20v18H6z M16 3v6 M11 15v3 M21 15v3 M11 23h10 M2 14v8 M30 14v8',
    OpenRouter: 'M3 16h10 M13 16l8-10h8 M13 16l8 10h8 M24 2l5 4-5 4 M24 22l5 4-5 4',
    'Supabase (pgvector)': 'M4 7c0-6 24-6 24 0s-24 6-24 0z M4 7v18c0 6 24 6 24 0V7 M4 16c0 6 24 6 24 0',
    'Google Drive': 'M12 3h8l11 20-4 7H5l-4-7z M12 3l-7 27 M20 3L5 30 M1 23h30',
    'Text Splitter': 'M5 3h22v26H5z M10 8h12 M10 13h12 M10 20h5 M19 20h3 M10 25h12',
    Embeddings: 'M4 5h5v5H4z M23 5h5v5h-5z M14 22h5v5h-5z M9 8l6 14 M23 8l-6 14 M9 8h14',
    Gmail: 'M3 7h26v20H3z M3 7l13 10L29 7',
    'Google Calendar': 'M5 5h22v24H5z M5 11h22 M11 2v6 M21 2v6 M11 17h4v7 M19 17h3v7',
    Airtable: 'M3 8l13-5 13 5-13 5z M3 12l11 4v13L3 24z M18 16l11-4v12l-11 5z',
    'Code (JavaScript)': 'M11 4H8v9l-4 3 4 3v9h3 M21 4h3v9l4 3-4 3v9h-3',
    If: 'M7 4v12h18 M18 9l7 7-7 7 M7 16v12',
    Vapi: 'M10 9a6 6 0 0 1 12 0v6a6 6 0 0 1-12 0z M6 14v2a10 10 0 0 0 20 0v-2 M16 26v4',
    'Respond to Webhook': 'M13 7L4 16l9 9 M4 16h17a7 7 0 0 1 7 7',
  }
  return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[tool] ?? paths.Vapi} /></svg>
}
