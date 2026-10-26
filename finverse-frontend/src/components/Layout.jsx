import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target,
  Bot, User, Settings, Menu, X, Zap
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/insights', icon: PieChart, label: 'Spending Insights' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/avatar', icon: User, label: 'My Avatar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const currentPage = NAV.find(n => location.pathname.startsWith(n.to))?.label || 'FINVERSE'

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 40, display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--dark-espresso)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
        zIndex: 50,
        transition: 'transform 0.3s ease',
      }}
        className={`sidebar ${open ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--gold), var(--primary-brown))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '0.02em' }}>FINVERSE</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.08em' }}>AI FINANCE</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                marginBottom: 2,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <NavLink
          to="/avatar"
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none'
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--gold)',
            flexShrink: 0,
            background: '#1f1b24'
          }}>
            <img src="/avatar.jpg" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Alex M.</div>
            <div style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 500 }}>Stage 3 · Growing</div>
          </div>
        </NavLink>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar (mobile) */}
        <header style={{
          display: 'none',
          padding: '14px 20px',
          background: 'var(--card-bg)',
          borderBottom: '1px solid var(--beige)',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }} className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--gold), var(--primary-brown))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={15} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--dark-espresso)' }}>FINVERSE</span>
          </div>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'flex', padding: 4 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            left: 0; top: 0; bottom: 0;
            transform: translateX(-100%);
            z-index: 50;
          }
          .sidebar-open { transform: translateX(0) !important; }
          .mobile-overlay { display: block !important; }
          .mobile-header { display: flex !important; }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
