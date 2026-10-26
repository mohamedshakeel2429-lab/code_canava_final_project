import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Filter, Check, X } from 'lucide-react'
import api from '../api/client'
import { DEMO_TRANSACTIONS } from '../data/demoData'

const CATEGORIES = ['Income', 'Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Other']
const fmt = n => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })

const STORAGE_KEY = 'finverse_transactions'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null } catch { return null }
}
function saveLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

const emptyForm = { description: '', category: 'Food', amount: '', date: new Date().toISOString().slice(0,10), type: 'expense' }

export default function Transactions() {
  const [txs, setTxs] = useState([])
  const [demo, setDemo] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendAvail, setBackendAvail] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/transactions/')
        setTxs(res.data.results || res.data)
        setBackendAvail(true)
      } catch {
        const local = loadLocal()
        if (local) { setTxs(local) } else {
          const d = DEMO_TRANSACTIONS.map((t,i) => ({...t}))
          setTxs(d); saveLocal(d)
        }
        setDemo(true)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = filterCat === 'All' ? txs : txs.filter(t => t.category === filterCat)

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (tx) => { setForm({ ...tx, amount: String(tx.amount) }); setEditId(tx.id); setShowForm(true) }

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.amount || isNaN(+form.amount)) return
    const payload = { ...form, amount: parseFloat(form.amount) }

    if (backendAvail) {
      try {
        if (editId) {
          const r = await api.patch(`/transactions/${editId}/`, payload)
          setTxs(prev => prev.map(t => t.id === editId ? r.data : t))
        } else {
          const r = await api.post('/transactions/', payload)
          setTxs(prev => [r.data, ...prev])
        }
        setShowForm(false); return
      } catch { setBackendAvail(false); setDemo(true) }
    }

    // Local fallback
    if (editId) {
      const updated = txs.map(t => t.id === editId ? { ...t, ...payload } : t)
      setTxs(updated); saveLocal(updated)
    } else {
      const newTx = { ...payload, id: Date.now() }
      const updated = [newTx, ...txs]
      setTxs(updated); saveLocal(updated)
    }
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    if (backendAvail) {
      try { await api.delete(`/transactions/${id}/`); setTxs(prev => prev.filter(t => t.id !== id)); return }
      catch { setBackendAvail(false); setDemo(true) }
    }
    const updated = txs.filter(t => t.id !== id)
    setTxs(updated); saveLocal(updated)
  }

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: 40 }}>Loading transactions…</div>

  const income = txs.filter(t => t.type === 'income').reduce((a, t) => a + +t.amount, 0)
  const expenses = txs.filter(t => t.type === 'expense').reduce((a, t) => a + +t.amount, 0)

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark-espresso)' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {txs.length} records · {demo ? 'Stored locally' : 'Synced with server'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {demo && <span className="demo-badge">📱 LOCAL STORAGE</span>}
          <button onClick={openAdd} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
            background: 'var(--primary-brown)', color: '#fff', border: 'none',
            borderRadius: 10, fontWeight: 600, fontSize: 14
          }}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Income', value: fmt(income), color: 'var(--positive)' },
          { label: 'Total Expenses', value: fmt(expenses), color: 'var(--warning)' },
          { label: 'Net Cash Flow', value: fmt(income - expenses), color: income > expenses ? 'var(--positive)' : 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} color="var(--text-secondary)" />
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            padding: '5px 12px', borderRadius: 99, fontSize: 13, border: '1.5px solid',
            borderColor: filterCat === c ? 'var(--primary-brown)' : 'var(--beige)',
            background: filterCat === c ? 'var(--primary-brown)' : 'transparent',
            color: filterCat === c ? '#fff' : 'var(--text-secondary)',
            fontWeight: filterCat === c ? 600 : 400, cursor: 'pointer'
          }}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--beige)' }}>
              {['Date', 'Description', 'Category', 'Type', 'Amount', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--dark-espresso)', fontSize: 12, letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td></tr>
            )}
            {filtered.map((tx, i) => (
              <tr key={tx.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--beige)' : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#faf5ee'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{tx.date}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{tx.description}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: 'var(--beige)', padding: '3px 10px', borderRadius: 99, fontSize: 12, color: 'var(--primary-brown)', fontWeight: 500 }}>{tx.category}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: tx.type === 'income' ? 'var(--positive)' : 'var(--warning)' }}>
                    {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: tx.type === 'income' ? 'var(--positive)' : 'var(--text-primary)' }}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(tx)} style={{ background: 'var(--beige)', border: 'none', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: 'var(--primary-brown)' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(tx.id)} style={{ background: 'rgba(196,123,99,0.12)', border: 'none', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: 'var(--warning)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 460, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark-espresso)' }}>{editId ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'var(--beige)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Description', key: 'description', type: 'text', placeholder: 'e.g. Grocery Store' },
                { label: 'Amount', key: 'amount', type: 'number', placeholder: '0.00' },
                { label: 'Date', key: 'date', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--beige)', fontSize: 14, background: 'var(--bg)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--beige)', fontSize: 14, background: 'var(--bg)', color: 'var(--text-primary)' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Type</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['income', 'expense'].map(t => (
                    <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{
                      flex: 1, padding: '9px', borderRadius: 10, border: '1.5px solid',
                      borderColor: form.type === t ? (t === 'income' ? 'var(--positive)' : 'var(--warning)') : 'var(--beige)',
                      background: form.type === t ? (t === 'income' ? 'rgba(124,146,116,0.1)' : 'rgba(196,123,99,0.1)') : 'transparent',
                      color: form.type === t ? (t === 'income' ? 'var(--positive)' : 'var(--warning)') : 'var(--text-secondary)',
                      fontWeight: 600, fontSize: 13, textTransform: 'capitalize'
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} style={{
                marginTop: 4, padding: '12px', borderRadius: 10, border: 'none',
                background: 'var(--primary-brown)', color: '#fff', fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
              }}>
                <Check size={16} /> {editId ? 'Save Changes' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
