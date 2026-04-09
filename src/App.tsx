import { useState, useRef, useEffect } from 'react'
import { Send, Settings2, Calendar, FileText, Image, Zap, MessageCircle } from 'lucide-react'
import ChatPage from './pages/ChatPage'
import Calendar from './pages/Calendar'
import Memory from './pages/Memory'
import Images from './pages/Images'
import SubAgents from './pages/SubAgents'

type Page = 'chat' | 'calendar' | 'memory' | 'images' | 'agents'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat')
  const [showSettings, setShowSettings] = useState(false)

  const navItems = [
    { id: 'chat' as Page, label: 'Chat', icon: MessageCircle },
    { id: 'calendar' as Page, label: 'Calendar', icon: Calendar },
    { id: 'memory' as Page, label: 'Memory', icon: FileText },
    { id: 'images' as Page, label: 'Images', icon: Image },
    { id: 'agents' as Page, label: 'Agents', icon: Zap },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPage />
      case 'calendar':
        return <Calendar />
      case 'memory':
        return <Memory />
      case 'images':
        return <Images />
      case 'agents':
        return <SubAgents />
      default:
        return <ChatPage />
    }
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
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

      {/* Navigation Tabs */}
      <div className="border-b border-cyan-500/20 bg-black/20 px-4 flex gap-2 overflow-x-auto">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                currentPage === item.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderPage()}
      </div>
    </div>
  )
}
