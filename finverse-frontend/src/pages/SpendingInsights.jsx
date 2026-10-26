import { useState } from 'react'
import { DEMO_INSIGHTS } from '../data/demoData'
import { CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react'

const CLASS_CONFIG = {
  essential: { label: 'Essential', color: 'var(--positive)', bg: 'rgba(124,146,116,0.1)', icon: CheckCircle },
  flexible:  { label: 'Flexible',  color: 'var(--gold)',     bg: 'rgba(198,161,91,0.1)',  icon: RotateCcw },
  review:    { label: 'Review',    color: 'var(--warning)',  bg: 'rgba(196,123,99,0.1)',  icon: AlertTriangle },
}

const fmt = n => '$' + Number(n).toLocaleString()

export default function SpendingInsights() {
  const [insights, setInsights] = useState(DEMO_INSIGHTS)

  const cycleClass = (id) => {
    const order = ['essential', 'flexible', 'review']
    setInsights(prev => prev.map(ins => {
      if (ins.id !== id) return ins
      const idx = order.indexOf(ins.classification)
      return { ...ins, classification: order[(idx + 1) % order.length] }
    }))
  }

  const totalSavings = insights.reduce((a, i) => a + (i.savings || 0), 0)

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark-espresso)' }}>Spending Insights</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Your expenses classified and analysed to find savings opportunities.
          </p>
        </div>
        <span className="demo-badge">⚠ DEMO MODE</span>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {Object.entries(CLASS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon
          const count = insights.filter(i => i.classification === key).length
          const total = insights.filter(i => i.classification === key).reduce((a, i) => a + i.amount, 0)
          return (
            <div key={key} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={cfg.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{fmt(total)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{count} {count === 1 ? 'category' : 'categories'}</div>
            </div>
          )
        })}
      </div>

      {totalSavings > 0 && (
        <div style={{ background: 'rgba(124,146,116,0.1)', border: '1px solid rgba(124,146,116,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={18} color="var(--positive)" />
          <span style={{ fontSize: 14, color: 'var(--positive)', fontWeight: 600 }}>
            Potential monthly savings identified: {fmt(totalSavings)}/month ({fmt(totalSavings * 12)}/year)
          </span>
        </div>
      )}

      {/* Insight cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map(ins => {
          const cfg = CLASS_CONFIG[ins.classification]
          const Icon = cfg.icon
          return (
            <div key={ins.id} className="card fade-in" style={{ padding: 22, borderLeft: `4px solid ${cfg.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark-espresso)' }}>{ins.category}</h3>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                    {ins.savings && (
                      <span style={{ fontSize: 12, color: 'var(--positive)', fontWeight: 500, background: 'rgba(124,146,116,0.08)', padding: '3px 8px', borderRadius: 99 }}>
                        Save ~{fmt(ins.savings)}/mo
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{fmt(ins.amount)}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>/month</span></div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Analysis: </strong>{ins.reason}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--primary-brown)', fontWeight: 500 }}>
                    💡 {ins.suggestion}
                  </div>
                </div>
                <button
                  onClick={() => cycleClass(ins.id)}
                  title="Change classification"
                  style={{
                    padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--beige)',
                    background: 'transparent', fontSize: 12, color: 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 500, flexShrink: 0
                  }}
                >
                  Reclassify ↻
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
