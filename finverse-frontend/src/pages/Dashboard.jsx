import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity, ChevronRight } from 'lucide-react'
import api from '../api/client'
import {
  DEMO_OVERVIEW, DEMO_EXPENSE_CATEGORIES, DEMO_MONTHLY_CHART,
  DEMO_TRANSACTIONS, DEMO_RECOMMENDATIONS
} from '../data/demoData'

const fmt = n => '$' + Number(n).toLocaleString()

function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <div className="card fade-in" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
        {trend && <div style={{ fontSize: 12, color: trend > 0 ? 'var(--positive)' : 'var(--warning)', marginTop: 2 }}>
          {trend > 0 ? '↑' : '↓'} vs last month
        </div>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card" style={{ padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [expCats, setExpCats] = useState(null)
  const [monthlyData, setMonthlyData] = useState(null)
  const [recentTx, setRecentTx] = useState(null)
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ovRes, txRes] = await Promise.all([
          api.get('/dashboard/overview/'),
          api.get('/transactions/?limit=5'),
        ])
        setOverview(ovRes.data)
        setExpCats(ovRes.data.expense_categories || DEMO_EXPENSE_CATEGORIES)
        setMonthlyData(ovRes.data.monthly_chart || DEMO_MONTHLY_CHART)
        setRecentTx(txRes.data.results || txRes.data || DEMO_TRANSACTIONS.slice(0, 5))
      } catch {
        setOverview(DEMO_OVERVIEW)
        setExpCats(DEMO_EXPENSE_CATEGORIES)
        setMonthlyData(DEMO_MONTHLY_CHART)
        setRecentTx(DEMO_TRANSACTIONS.slice(0, 5))
        setDemo(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading dashboard…</div>
    </div>
  )

  const ov = overview
  const healthPct = ov.health_score || 72

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark-espresso)', marginBottom: 4 }}>Good morning, Alex 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's your financial overview for October 2026.</p>
        </div>
        {demo && <span className="demo-badge">⚠ DEMO MODE — Sample Data</span>}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Monthly Income" value={fmt(ov.monthly_income)} icon={DollarSign} color="var(--positive)" trend={2} />
        <StatCard label="Total Expenses" value={fmt(ov.total_expenses)} icon={TrendingDown} color="var(--warning)" />
        <StatCard label="Cash Flow" value={fmt(ov.cash_flow)} icon={TrendingUp} color="var(--primary-brown)" trend={5} />
        <StatCard label="Savings Rate" value={`${ov.savings_rate}%`} icon={Percent} color="var(--gold)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Pie */}
        <div className="card fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--dark-espresso)' }}>Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expCats} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {expCats.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="card fade-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--dark-espresso)' }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="var(--positive)" radius={[6,6,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--warning)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Recent transactions */}
        <div className="card fade-in" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark-espresso)' }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ fontSize: 13, color: 'var(--primary-brown)', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 500 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentTx.map((tx, i) => (
              <div key={tx.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentTx.length - 1 ? '1px solid var(--beige)' : 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: tx.type === 'income' ? 'rgba(124,146,116,0.15)' : 'rgba(196,123,99,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16
                }}>
                  {tx.type === 'income' ? '↑' : '↓'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx.category} · {tx.date}</div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: tx.type === 'income' ? 'var(--positive)' : 'var(--text-primary)', flexShrink: 0 }}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Health + Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Health & Avatar */}
          <div className="card fade-in" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={16} color="var(--primary-brown)" />
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark-espresso)' }}>Financial Health</h3>
              </div>
              <Link to="/avatar" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-brown)', display: 'flex', alignItems: 'center', gap: 2 }}>
                View Avatar →
              </Link>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                position: 'relative',
                width: 68,
                height: 84,
                borderRadius: 14,
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid var(--gold)',
                boxShadow: '0 4px 12px rgba(121, 85, 72, 0.2)',
                background: '#1f1b24'
              }}>
                <img
                  src="/avatar.jpg"
                  alt="Financial Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-brown)', lineHeight: 1 }}>{healthPct}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, margin: '2px 0 6px' }}>out of 100 health score</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(121, 85, 72, 0.1)',
                  color: 'var(--primary-brown)',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6
                }}>
                  {ov.health_label || 'Financially Growing'}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--beige)', borderRadius: 99, height: 8, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ width: `${healthPct}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--primary-brown), var(--gold))' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'right' }}>
              Stage 3: Financially Growing
            </div>
          </div>

          {/* Recommendations */}
          <div className="card fade-in" style={{ padding: 22, flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark-espresso)', marginBottom: 14 }}>💡 Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_RECOMMENDATIONS.map((r, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: r.positive ? 'rgba(124,146,116,0.08)' : 'rgba(196,123,99,0.08)',
                  borderLeft: `3px solid ${r.positive ? 'var(--positive)' : 'var(--warning)'}`,
                  fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5
                }}>
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
          div[style*="gridTemplateColumns: '1fr 340px'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
