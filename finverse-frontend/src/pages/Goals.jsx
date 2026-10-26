import { useState } from 'react'
import { Plus, Target, Check, X } from 'lucide-react'
import { DEMO_GOALS } from '../data/demoData'

const STORAGE_KEY = 'finverse_goals'

function loadGoals() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null } catch { return null }
}
function saveGoals(g) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(g)) } catch {} }

const emptyGoal = { name: '', target: '', current: '', deadline: '', color: '#795548' }
const COLORS = ['#795548','#C6A15B','#7C9274','#C47B63','#78675B','#3B2A24']

const fmt = n => '$' + Number(n).toLocaleString()

function GoalCard({ goal, onUpdate, onDelete }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
  const remaining = goal.target - goal.current
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(goal.current))

  return (
    <div className="card fade-in" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: goal.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} color={goal.color} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--dark-espresso)' }}>{goal.name}</div>
            {goal.deadline && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Target: {goal.deadline}</div>}
          </div>
        </div>
        <button onClick={() => onDelete(goal.id)} style={{ background: 'rgba(196,123,99,0.1)', border: 'none', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: 'var(--warning)' }}>
          <X size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{fmt(goal.current)} saved</span>
        <span style={{ fontWeight: 700, color: 'var(--dark-espresso)' }}>{fmt(goal.target)} goal</span>
      </div>

      <div style={{ background: 'var(--beige)', borderRadius: 99, height: 10, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: pct >= 100 ? 'var(--positive)' : goal.color, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 18, color: goal.color }}>{pct}%</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 6 }}>
            {remaining > 0 ? `${fmt(remaining)} remaining` : '🎉 Goal achieved!'}
          </span>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--beige)', background: 'transparent', color: 'var(--primary-brown)', cursor: 'pointer', fontWeight: 600 }}>
            Update Progress
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Amount saved"
              style={{ width: 120, padding: '6px 10px', borderRadius: 8, border: '1.5px solid var(--sand)', fontSize: 13, background: 'var(--bg)' }} />
            <button onClick={() => { onUpdate(goal.id, +val); setEditing(false) }}
              style={{ background: 'var(--positive)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#fff' }}>
              <Check size={14} />
            </button>
            <button onClick={() => setEditing(false)}
              style={{ background: 'var(--beige)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Goals() {
  const [goals, setGoals] = useState(() => loadGoals() || DEMO_GOALS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyGoal)

  const save = (updated) => { setGoals(updated); saveGoals(updated) }

  const addGoal = () => {
    if (!form.name.trim() || !form.target || isNaN(+form.target)) return
    const updated = [...goals, { ...form, id: Date.now(), target: +form.target, current: +form.current || 0 }]
    save(updated); setShowForm(false); setForm(emptyGoal)
  }

  const updateProgress = (id, current) => {
    save(goals.map(g => g.id === id ? { ...g, current: Math.min(current, g.target) } : g))
  }

  const deleteGoal = (id) => {
    if (!window.confirm('Delete this goal?')) return
    save(goals.filter(g => g.id !== id))
  }

  const totalSaved = goals.reduce((a, g) => a + g.current, 0)
  const totalTarget = goals.reduce((a, g) => a + g.target, 0)

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark-espresso)' }}>Financial Goals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Track your progress toward your financial milestones.</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
          background: 'var(--primary-brown)', color: '#fff', border: 'none',
          borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer'
        }}>
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Overall progress */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark-espresso)' }}>Overall Goal Progress</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>${totalSaved.toLocaleString()} / ${totalTarget.toLocaleString()}</div>
        </div>
        <div style={{ background: 'var(--beige)', borderRadius: 99, height: 12, overflow: 'hidden' }}>
          <div style={{ width: totalTarget ? `${Math.min(100,(totalSaved/totalTarget)*100)}%` : '0%', height: '100%', background: 'linear-gradient(90deg, var(--primary-brown), var(--gold))', borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {goals.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          No goals yet. Create your first financial goal!
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {goals.map(g => <GoalCard key={g.id} goal={g} onUpdate={updateProgress} onDelete={deleteGoal} />)}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 440, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark-espresso)' }}>Create a Goal</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'var(--beige)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Goal Name', key: 'name', type: 'text', placeholder: 'e.g. Emergency Fund' },
                { label: 'Target Amount ($)', key: 'target', type: 'number', placeholder: '10000' },
                { label: 'Amount Saved So Far ($)', key: 'current', type: 'number', placeholder: '0' },
                { label: 'Target Date', key: 'deadline', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--beige)', fontSize: 14, background: 'var(--bg)' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Goal Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))} style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '2px solid transparent',
                      outline: form.color === c ? `2px solid ${c}` : 'none', cursor: 'pointer'
                    }} />
                  ))}
                </div>
              </div>
              <button onClick={addGoal} style={{ marginTop: 4, padding: 12, borderRadius: 10, border: 'none', background: 'var(--primary-brown)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
