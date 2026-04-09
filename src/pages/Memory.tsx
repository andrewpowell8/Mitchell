import { useState } from 'react'
import { Search, Plus, Trash2, Edit2 } from 'lucide-react'

interface MemoryItem {
  id: string
  title: string
  content: string
  tags: string[]
  created: string
  updated: string
}

export default function Memory() {
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: '1', title: 'Mitchell Bot Setup', content: 'Order monitoring, voice bot, 10% Cabinetry integration', tags: ['setup', 'bots'], created: '2026-03-15', updated: '2026-04-08' },
    { id: '2', title: 'STL Cabinetry Details', content: 'Phone: 314-441-5620, Address: 1618 Country Club Plaza Drive', tags: ['company', 'contact'], created: '2026-03-20', updated: '2026-04-05' },
    { id: '3', title: 'Model Strategy', content: 'Haiku for routine, Sonnet for coding, Opus for analysis', tags: ['models', 'strategy'], created: '2026-03-25', updated: '2026-04-08' },
  ])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newMemory, setNewMemory] = useState({ title: '', content: '', tags: '' })
  const [editId, setEditId] = useState<string | null>(null)

  const filtered = memories.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  )

  const addMemory = () => {
    if (newMemory.title && newMemory.content) {
      if (editId) {
        setMemories(memories.map(m => m.id === editId ? {
          ...m,
          title: newMemory.title,
          content: newMemory.content,
          tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
          updated: new Date().toISOString().split('T')[0],
        } : m))
        setEditId(null)
      } else {
        setMemories([...memories, {
          id: Date.now().toString(),
          title: newMemory.title,
          content: newMemory.content,
          tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
          created: new Date().toISOString().split('T')[0],
          updated: new Date().toISOString().split('T')[0],
        }])
      }
      setNewMemory({ title: '', content: '', tags: '' })
      setShowForm(false)
    }
  }

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id))
  }

  const startEdit = (memory: MemoryItem) => {
    setNewMemory({ title: memory.title, content: memory.content, tags: memory.tags.join(', ') })
    setEditId(memory.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Memory Base</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setNewMemory({ title: '', content: '', tags: '' }) }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400"
        >
          <Plus size={20} /> New Memory
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newMemory.title}
            onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <textarea
            placeholder="Content"
            value={newMemory.content}
            onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
            className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newMemory.tags}
            onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <button
            onClick={addMemory}
            className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 font-semibold"
          >
            {editId ? 'Update Memory' : 'Add Memory'}
          </button>
        </div>
      )}

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(memory => (
          <div key={memory.id} className="border border-cyan-500/20 rounded-lg p-4 bg-black/40 space-y-3 hover:border-cyan-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-white flex-1">{memory.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => startEdit(memory)} className="text-cyan-400 hover:text-cyan-300">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteMemory(memory.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">{memory.content}</p>
            <div className="flex gap-2 flex-wrap">
              {memory.tags.map(tag => (
                <span key={tag} className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-600 flex justify-between">
              <span>Created: {memory.created}</span>
              <span>Updated: {memory.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
