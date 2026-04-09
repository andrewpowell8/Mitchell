import { useState } from 'react'
import { Play, Pause, Trash2, Plus, Activity } from 'lucide-react'

interface Agent {
  id: string
  name: string
  task: string
  model: string
  status: 'running' | 'idle' | 'error'
  uptime: string
  lastRun: string
  output: string[]
}

export default function SubAgents() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Order Monitor', task: 'Monitor 10% Cabinetry orders', model: 'haiku', status: 'idle', uptime: '2h 34m', lastRun: '2026-04-08 16:45', output: ['✓ Checked 5 orders', '✓ Found 2 status changes'] },
    { id: '2', name: 'Voice Bot', task: 'Handle phone interactions', model: 'sonnet', status: 'running', uptime: '45m', lastRun: 'Now', output: ['Call in progress...', 'Processing customer inquiry'] },
    { id: '3', name: 'Data Sync', task: 'Sync CRM with 10 Percent', model: 'haiku', status: 'idle', uptime: '1h 20m', lastRun: '2026-04-08 15:30', output: ['✓ Synced 12 orders', '✓ Updated shipment status'] },
  ])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newAgent, setNewAgent] = useState({ name: '', task: '', model: 'haiku' })

  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'running' ? 'idle' : 'running' } : a))
  }

  const deleteAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id))
    if (selectedAgent?.id === id) setSelectedAgent(null)
  }

  const addAgent = () => {
    if (newAgent.name && newAgent.task) {
      const agent: Agent = {
        id: Date.now().toString(),
        name: newAgent.name,
        task: newAgent.task,
        model: newAgent.model,
        status: 'idle',
        uptime: '0m',
        lastRun: 'Never',
        output: ['Agent created'],
      }
      setAgents([...agents, agent])
      setNewAgent({ name: '', task: '', model: 'haiku' })
      setShowForm(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Sub-Agents</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400"
        >
          <Plus size={20} /> Spawn Agent
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
          <input
            type="text"
            placeholder="Agent name"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <textarea
            placeholder="Task description"
            value={newAgent.task}
            onChange={(e) => setNewAgent({ ...newAgent, task: e.target.value })}
            className="w-full h-20 bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <select
            value={newAgent.model}
            onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          >
            <option value="haiku">Claude Haiku (Fast)</option>
            <option value="sonnet">Claude Sonnet (Balanced)</option>
            <option value="opus">Claude Opus (Powerful)</option>
          </select>
          <button
            onClick={addAgent}
            className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 font-semibold"
          >
            Spawn Agent
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="lg:col-span-2 space-y-4">
          {agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAgent?.id === agent.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.task}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id) }}
                    className={`p-2 rounded transition-colors ${
                      agent.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {agent.status === 'running' ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAgent(agent.id) }}
                    className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Model</p>
                  <p className="text-white font-semibold">{agent.model}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'running' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <p className="text-white capitalize">{agent.status}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="text-white">{agent.uptime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Panel */}
        {selectedAgent && (
          <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-cyan-400 mb-4">{selectedAgent.name}</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Task</p>
                  <p className="text-sm text-white">{selectedAgent.task}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="text-sm text-white">{selectedAgent.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Run</p>
                  <p className="text-sm text-white">{selectedAgent.lastRun}</p>
                </div>
              </div>

              {/* Output Log */}
              <div className="border border-gray-700 rounded p-3 bg-black/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
                  <Activity size={16} /> Output
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  {selectedAgent.output.map((line, i) => (
                    <p key={i} className="font-mono">{line}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleAgent(selectedAgent.id)}
                className={`w-full mt-4 py-2 rounded border font-semibold transition-colors ${
                  selectedAgent.status === 'running'
                    ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30'
                    : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
                }`}
              >
                {selectedAgent.status === 'running' ? 'Stop Agent' : 'Start Agent'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
