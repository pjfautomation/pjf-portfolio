import type { WorkflowDefinition, WorkflowNode } from './workflows'

export type RagScenario = 'answer' | 'no-source' | 'add' | 'refresh' | 'archive'
export const RAG_SCENARIOS: { id: RagScenario; label: string; description: string }[] = [
  { id: 'answer', label: 'Ask a supported question', description: 'Find the policy in business documents and answer with a source.' },
  { id: 'no-source', label: 'No matching source', description: 'Explain when the documents do not support an answer.' },
  { id: 'add', label: 'Add a document', description: 'Index a new Google Drive file for the first time.' },
  { id: 'refresh', label: 'Update a document', description: 'A Google Drive edit replaces the document’s old knowledge chunks.' },
  { id: 'archive', label: 'Archive a document', description: 'Remove archived document chunks from future retrieval.' },
]
export const RAG_FIXTURE = {
  document: 'Appointment policy.pdf', fileId: 'drive_policy_104', folder: 'Business knowledge',
  question: 'How much notice do I need to reschedule a consultation?',
  missingQuestion: 'Do you offer a discount for a group of ten?',
  excerpt: 'Clients may reschedule a consultation with at least 24 hours’ notice. Contact the appointment desk to choose another available time.',
  updatedExcerpt: 'Clients may reschedule a consultation with at least 48 hours’ notice. Contact the appointment desk to choose another available time.',
  answer: 'You can reschedule with at least 24 hours’ notice. Contact the appointment desk to choose another available time. [1]',
  noAnswer: 'I couldn’t find a group discount policy in the available documents. Please contact the team to confirm; I won’t guess a price or discount.',
}
export const RAG_OUTPUTS = [
  { id: 'chat-trigger', label: 'Chat' }, { id: 'retrieval', label: 'Sources' },
  { id: 'answer', label: 'Answer' }, { id: 'no-answer', label: 'Answer' },
  { id: 'drive-trigger', label: 'Google Drive' }, { id: 'split-document', label: 'Chunks' },
  { id: 'upsert-vectors', label: 'Supabase' }, { id: 'remove-vectors', label: 'Supabase' },
]
const node = (id: string, title: string, tool: string, x: number, y: number, description: string, input: Record<string, unknown>, output: Record<string, unknown>, nodeType: WorkflowNode['nodeType'] = 'action'): WorkflowNode => ({ id, title, tool, x, y, description, input, output, nodeType, subtitle: tool, symbol: '◈' })
export const RAG_WORKFLOW: WorkflowDefinition = {
  id: 'basic-rag', title: 'Basic RAG System', platform: 'n8n', category: 'n8n knowledge assistant', canvasHeight: 1080,
  summary: 'A document-grounded chat assistant for repeat customer and staff questions. Google Drive changes refresh the knowledge base; archived documents leave retrieval. Try the simulated n8n replay.',
  tools: ['Chat Trigger', 'AI Agent', 'OpenRouter', 'Supabase (pgvector)', 'Google Drive', 'Text Splitter', 'Embeddings'],
  nodes: [
    node('chat-trigger', 'Receive question', 'Chat Trigger', 70, 130, 'Receive a customer or staff question. This replay uses a fixed sample question, not a connected chat service.', { session: 'session_demo_104' }, { question: RAG_FIXTURE.question }, 'trigger'),
    node('rag-agent', 'AI Agent', 'AI Agent', 350, 130, 'Ask the read-only retrieval tool for document evidence. Treat document text as evidence, not as instructions to perform actions.', { question: RAG_FIXTURE.question }, { tool: 'search_business_documents' }),
    node('retrieval', 'Search documents', 'Supabase (pgvector)', 650, 130, 'Retrieve active document chunks in the business knowledge collection. Archived sources are excluded.', { query: RAG_FIXTURE.question, collection: 'business_knowledge', active_only: true }, { matches: 1, source: RAG_FIXTURE.document, page: 2, excerpt: RAG_FIXTURE.excerpt }),
    node('source-check', 'Evidence found?', 'If', 900, 130, 'Use only retrieved evidence. If no source supports the question, return an honest no-answer response.', { matches: 1 }, { supported: true }, 'condition'),
    node('rag-model', 'Generate grounded answer', 'OpenRouter', 1180, 130, 'Generate a concise answer using the retrieved policy and retain the citation. The text in this demo is a hand-authored fixture.', { context: RAG_FIXTURE.excerpt }, { answer: RAG_FIXTURE.answer }),
    node('answer', 'Return cited answer', 'Respond to Webhook', 1470, 130, 'Return the answer and source reference to the chat viewer after generation completes.', { answer: RAG_FIXTURE.answer }, { answer: RAG_FIXTURE.answer, citations: [{ source: RAG_FIXTURE.document, page: 2, version: 'v1' }] }, 'response'),
    node('no-answer', 'Request team help', 'Respond to Webhook', 1180, 350, 'Return a no-source response without inventing a policy, discount or citation.', { matches: 0 }, { answer: RAG_FIXTURE.noAnswer, citations: [] }, 'response'),
    node('drive-trigger', 'Document changed', 'Google Drive', 70, 640, 'Detect a changed or archived file in the business knowledge folder. Each scenario starts from its own v1 fixture.', { file_id: RAG_FIXTURE.fileId }, { file: RAG_FIXTURE.document, event: 'updated', version: 'v2' }, 'trigger'),
    node('download-document', 'Read document', 'Google Drive', 350, 640, 'Read the updated document contents and retain its file ID and version.', { file_id: RAG_FIXTURE.fileId }, { text: RAG_FIXTURE.updatedExcerpt, version: 'v2' }),
    node('split-document', 'Split into chunks', 'Text Splitter', 650, 640, 'Split the document into searchable passages with source metadata. Four fixture chunks belong to the new version.', { document: RAG_FIXTURE.document, version: 'v2' }, { chunks: 4, excerpt: RAG_FIXTURE.updatedExcerpt }, 'transform'),
    node('embed-document', 'Embed document chunks', 'Embeddings', 900, 640, 'Create embeddings for the new passages using the same embedding configuration as retrieval. Vectors are simulated in this replay.', { chunks: 4 }, { embedded_chunks: 4 }),
    node('upsert-vectors', 'Replace document knowledge', 'Supabase (pgvector)', 1180, 640, 'Replace the old version’s three chunks with four v2 chunks using the stable file ID. Do not append duplicate copies on repeated updates.', { file_id: RAG_FIXTURE.fileId, version: 'v2' }, { removed_old_chunks: 3, active_chunks: 4, version: 'v2', status: 'Indexed' }),
    node('remove-vectors', 'Remove archived knowledge', 'Supabase (pgvector)', 350, 870, 'Remove all chunks belonging to the archived file. Future searches cannot retrieve its old policy.', { file_id: RAG_FIXTURE.fileId }, { removed_chunks: 3, active_chunks: 0, status: 'Archived' }),
    node('sync-complete', 'Record sync result', 'Code (JavaScript)', 1470, 640, 'Record the document sync outcome after the database action completes.', { file_id: RAG_FIXTURE.fileId }, { synced: true, file_id: RAG_FIXTURE.fileId }, 'transform'),
  ],
  edges: [
    { from: 'chat-trigger', to: 'rag-agent' }, { from: 'rag-agent', to: 'retrieval', label: 'Retrieval tool' },
    { from: 'retrieval', to: 'source-check' }, { from: 'source-check', to: 'rag-model', label: 'Evidence found' },
    { from: 'source-check', to: 'no-answer', label: 'No evidence' }, { from: 'rag-model', to: 'answer' },
    { from: 'drive-trigger', to: 'download-document', label: 'Added / updated' }, { from: 'drive-trigger', to: 'remove-vectors', label: 'Archived' },
    { from: 'download-document', to: 'split-document' }, { from: 'split-document', to: 'embed-document' },
    { from: 'embed-document', to: 'upsert-vectors' }, { from: 'upsert-vectors', to: 'sync-complete' }, { from: 'remove-vectors', to: 'sync-complete' },
  ],
}
export function ragPlan(scenario: RagScenario): string[] {
  if (scenario === 'refresh' || scenario === 'add') return ['drive-trigger', 'download-document', 'split-document', 'embed-document', 'upsert-vectors', 'sync-complete']
  if (scenario === 'archive') return ['drive-trigger', 'remove-vectors', 'sync-complete']
  return ['chat-trigger', 'rag-agent', 'retrieval', 'source-check', ...(scenario === 'no-source' ? ['no-answer'] : ['rag-model', 'answer'])]
}
