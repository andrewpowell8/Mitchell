import { useState, useRef, useEffect } from 'react'
import { Send, Settings2 } from 'lucide-react'

const MODELS = [
  { id: 'haiku', name: 'Claude Haiku', provider: 'anthropic', speed: 'Fast' },
  { id: 'sonnet', name: 'Claude Sonnet', provider: 'anthropic', speed: 'Balanced' },
  { id: 'opus', name: 'Claude Opus', provider: 'anthropic', speed: 'Powerful' },
  { id: 'gpt4o', name: 'GPT-4o', provider: 'openai', speed: 'Smart' },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  timestamp: Date
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState('haiku')
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function handleSend() {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          model: selectedModel,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          model: selectedModel,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Error connecting to API',
          timestamp: new Date(),
        }])
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const currentModel = MODELS.find(m => m.id === selectedModel)

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-black/40 p-4 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-cyan-400">Mission Control</h1>
          <p className="text-xs text-gray-500">Mitchell AI Command Center</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-cyan-500/10 rounded transition-colors"
        >
          <Settings2 size={20} className="text-cyan-400" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-cyan-500/20 bg-black/60 p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              AI Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded border transition-all text-left text-sm ${
                    selectedModel === model.id
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-gray-700 bg-black/40 text-gray-400 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="font-semibold">{model.name}</div>
                  <div className="text-xs opacity-75">{model.speed}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-5xl">🤖</div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-cyan-400">Ready to help</p>
                <p className="text-gray-500 text-sm">Using {currentModel?.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl rounded-lg p-4 space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-100'
                      : 'bg-gray-800/50 border border-gray-700/50 text-gray-100'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs opacity-50">
                    {msg.timestamp.toLocaleTimeString()}
                    {msg.model && ` • ${MODELS.find(m => m.id === msg.model)?.name}`}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-cyan-500/20 bg-black/40 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg transition-colors disabled:opacity-50 text-cyan-400"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
