import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
  status: 'pending' | 'completed' | 'cancelled'
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 8))
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Deploy Mission Control', date: '2026-04-08', time: '14:00', description: 'Complete Feature 1', status: 'completed' },
    { id: '2', title: 'Add Chat API', date: '2026-04-08', time: '16:00', description: 'Integrate real models', status: 'completed' },
    { id: '3', title: 'Build Calendar', date: '2026-04-08', time: '18:00', description: 'Feature 3', status: 'pending' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', description: '' })

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { id: Date.now().toString(), ...newEvent, status: 'pending' }])
      setNewEvent({ title: '', date: '', time: '', description: '' })
      setShowForm(false)
    }
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">{monthName}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 transition-colors text-cyan-400"
        >
          <Plus size={20} /> New Event
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
            />
          </div>
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <button
            onClick={addEvent}
            className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 font-semibold"
          >
            Add Event
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 border border-cyan-500/20 rounded-lg p-6 bg-black/40">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-cyan-500/10 rounded">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="text-sm text-cyan-400 hover:text-cyan-300">Today</button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-cyan-500/10 rounded">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500">{day}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {blanks.map(i => <div key={`blank-${i}`} />)}
            {days.map(day => {
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = events.filter(e => e.date === dateStr)
              return (
                <div key={day} className="aspect-square border border-gray-700 rounded p-2 hover:border-cyan-500/50 cursor-pointer bg-gray-900/20">
                  <div className="text-xs font-semibold mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(evt => (
                      <div key={evt.id} className="text-xs bg-cyan-500/20 rounded px-1 py-0.5 truncate">{evt.title}</div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Upcoming</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.filter(e => new Date(e.date) >= currentDate).map(evt => (
              <div key={evt.id} className="border border-gray-700 rounded p-3 space-y-1 hover:border-cyan-500/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{evt.title}</p>
                    <p className="text-xs text-gray-500">{evt.date} {evt.time}</p>
                  </div>
                  <button onClick={() => deleteEvent(evt.id)} className="text-red-400 hover:text-red-300">
                    <X size={16} />
                  </button>
                </div>
                {evt.description && <p className="text-xs text-gray-400">{evt.description}</p>}
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    evt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    evt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
