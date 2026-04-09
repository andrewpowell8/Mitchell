import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors())
app.use(express.json())

// Model mapping
const MODEL_MAP = {
  haiku: 'anthropic/claude-haiku-4-5',
  sonnet: 'anthropic/claude-sonnet-4-6',
  opus: 'anthropic/claude-opus-4-6',
  gpt4o: 'openai/gpt-4o',
}

// Store conversation history per session
const conversations = new Map()

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, model, sessionId } = req.body
  
  if (!message || !model) {
    return res.status(400).json({ error: 'Missing message or model' })
  }

  const sid = sessionId || 'default'
  const modelName = MODEL_MAP[model] || 'anthropic/claude-haiku-4-5'

  try {
    // Get or create conversation history
    if (!conversations.has(sid)) {
      conversations.set(sid, [])
    }
    const history = conversations.get(sid)

    // Add user message to history
    history.push({ role: 'user', content: message })

    // In production, this would call OpenClaw's sessions_send
    // For now, return a simulated response
    const response = `[${model}] Processing your message...`

    // Add assistant response to history
    history.push({ role: 'assistant', content: response })

    res.json({ 
      response,
      model,
      sessionId: sid,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get conversation history
app.get('/api/conversation/:sessionId', (req, res) => {
  const history = conversations.get(req.params.sessionId) || []
  res.json({ messages: history })
})

// Clear conversation
app.post('/api/conversation/clear', (req, res) => {
  const { sessionId } = req.body
  conversations.delete(sessionId || 'default')
  res.json({ cleared: true })
})

// Serve static files
const distPath = path.join(__dirname, 'dist')
app.use('/', express.static(distPath))

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

const PORT = process.env.PORT || 5173
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mission Control running on port ${PORT}`)
})
