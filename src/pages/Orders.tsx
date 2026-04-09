import { useState } from 'react'
import { Plus, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  doorStyle: string
  lineItems: { sku: string; qty: number }[]
  status: 'pending' | 'submitting' | 'submitted' | 'error'
  createdAt: string
  submittedAt?: string
  error?: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', orderNumber: 'TEST-MC-001', doorStyle: 'SW', lineItems: [{ sku: 'W3630', qty: 1 }], status: 'submitted', createdAt: '2026-04-09', submittedAt: '2026-04-09 08:05' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newOrder, setNewOrder] = useState({
    orderNumber: '',
    doorStyle: 'SW',
    qty: 1,
    sku: 'W3630',
  })

  const submitOrder = async () => {
    if (!newOrder.orderNumber || !newOrder.sku) return

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: newOrder.orderNumber,
      doorStyle: newOrder.doorStyle,
      lineItems: [{ sku: newOrder.sku, qty: newOrder.qty }],
      status: 'submitting',
      createdAt: new Date().toLocaleDateString(),
    }

    setOrders([...orders, order])
    setNewOrder({ orderNumber: '', doorStyle: 'SW', qty: 1, sku: 'W3630' })
    setShowForm(false)

    // Simulate submission
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'submitted', submittedAt: new Date().toLocaleTimeString() } : o))
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="text-green-400" size={20} />
      case 'submitting': return <Clock className="text-yellow-400 animate-spin" size={20} />
      case 'error': return <AlertCircle className="text-red-400" size={20} />
      default: return <Clock className="text-gray-400" size={20} />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Order Submission</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400"
        >
          <Plus size={20} /> New Order
        </button>
      </div>

      {showForm && (
        <div className="border border-cyan-500/20 rounded-lg p-6 bg-black/40 space-y-4">
          <input
            type="text"
            placeholder="Order Number (e.g., PO-2026-001)"
            value={newOrder.orderNumber}
            onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newOrder.doorStyle}
              onChange={(e) => setNewOrder({ ...newOrder, doorStyle: e.target.value })}
              className="bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
            >
              <option>SW - Shaker White</option>
              <option>SN - Shaker Natural</option>
              <option>SD - Shaker Dark</option>
              <option>BW - Beaded White</option>
            </select>
            <input
              type="text"
              placeholder="SKU (e.g., W3630)"
              value={newOrder.sku}
              onChange={(e) => setNewOrder({ ...newOrder, sku: e.target.value })}
              className="bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
            />
          </div>
          <input
            type="number"
            min="1"
            value={newOrder.qty}
            onChange={(e) => setNewOrder({ ...newOrder, qty: parseInt(e.target.value) })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <button
            onClick={submitOrder}
            className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-400 font-semibold flex items-center justify-center gap-2"
          >
            <Send size={18} /> Submit to 10%
          </button>
        </div>
      )}

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="border border-cyan-500/20 rounded-lg p-4 bg-black/40">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-white">{order.orderNumber}</p>
                <p className="text-sm text-gray-400">{order.doorStyle} • {order.lineItems.map(li => `${li.sku} x${li.qty}`).join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <span className={`text-sm font-semibold capitalize ${
                  order.status === 'submitted' ? 'text-green-400' :
                  order.status === 'submitting' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex justify-between">
              <span>Created: {order.createdAt}</span>
              {order.submittedAt && <span>Submitted: {order.submittedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
