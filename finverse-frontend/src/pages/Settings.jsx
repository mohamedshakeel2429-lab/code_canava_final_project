import { useState } from 'react'
import { Save, Bell, Moon, Shield, CreditCard, User } from 'lucide-react'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: 'Alex M.', email: 'alex@example.com', currency: 'USD',
    notifications: true, darkMode: false, twoFactor: false,
    monthlyBudget: '4000', savingsGoal: '20',
  })

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleSave = () => {
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark-espresso)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Manage your account and preferences.</p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(124,146,116,0.1)', border: '1px solid var(--positive)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, color: 'var(--positive)', fontWeight: 600, fontSize: 14 }}>
          ✓ Settings saved successfully.
        </div>
      )}

      {[
        {
          title: 'Profile', icon: User,
          fields: [
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Email Address', key: 'email', type: 'email' },
            { label: 'Currency', key: 'currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'] },
          ]
        },
        {
          title: 'Budget Preferences', icon: CreditCard,
          fields: [
            { label: 'Monthly Budget ($)', key: 'monthlyBudget', type: 'number' },
            { label: 'Savings Goal (%)', key: 'savingsGoal', type: 'number' },
          ]
        },
      ].map(section => {
        const Icon = section.icon
        return (
          <div key={section.title} className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(121,85,72,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="var(--primary-brown)" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-espresso)' }}>{section.title}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {section.fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--beige)', fontSize: 14, background: 'var(--bg)', color: 'var(--text-primary)' }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--beige)', fontSize: 14, background: 'var(--bg)', color: 'var(--text-primary)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Toggles */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(121,85,72,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} color="var(--primary-brown)" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-espresso)' }}>Preferences</h3>
        </div>
        {[
          { label: 'Email Notifications', sublabel: 'Receive weekly spending summaries', key: 'notifications' },
          { label: 'Dark Mode', sublabel: 'Coming soon', key: 'darkMode' },
          { label: 'Two-Factor Authentication', sublabel: 'Adds an extra layer of security', key: 'twoFactor' },
        ].map(t => (
          <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--beige)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.sublabel}</div>
            </div>
            <button
              onClick={() => update(t.key, !form[t.key])}
              style={{
                width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: form[t.key] ? 'var(--primary-brown)' : 'var(--sand)',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: form[t.key] ? 23 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
        background: 'var(--primary-brown)', color: '#fff', border: 'none',
        borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer'
      }}>
        <Save size={16} /> Save Settings
      </button>
    </div>
  )
}
