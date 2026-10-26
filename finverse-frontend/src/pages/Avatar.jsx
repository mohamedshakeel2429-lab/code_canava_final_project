import { useState } from 'react'
import FinancialAvatar, { FINANCIAL_STAGES } from '../components/FinancialAvatar'
import { Sparkles, ShieldCheck, TrendingUp, Compass, Award } from 'lucide-react'

export default function Avatar() {
  const [stage, setStage] = useState(2) // Default to "Financially Growing" (Stage 3)
  const currentStage = FINANCIAL_STAGES[stage]

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Page Title & Intro */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--dark-espresso)', letterSpacing: '-0.02em' }}>
              Financial Avatar
            </h1>
            <span className="demo-badge">Interactive 3D</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Meet your personal wealth persona. Your avatar evolves dynamically as your financial resilience, savings rate, and net cash flow grow.
          </p>
        </div>
      </div>

      {/* Main Grid: Avatar Spotlight + Stage Selector & Insights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: 28,
        alignItems: 'start'
      }}>
        {/* Left: Reusable Interactive Financial Avatar */}
        <FinancialAvatar
          stageIndex={stage}
          size="large"
          showDetails={true}
          onStageChange={setStage}
        />

        {/* Right: Stage Exploration & Financial Evolution Pathway */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stage Progression Selector Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Compass size={18} color="var(--primary-brown)" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark-espresso)' }}>
                Select Stage to Preview Avatar Evolution
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FINANCIAL_STAGES.map((s, idx) => {
                const isSelected = stage === idx
                return (
                  <div
                    key={s.id}
                    onClick={() => setStage(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      padding: '16px',
                      borderRadius: '14px',
                      border: `1.5px solid ${isSelected ? s.color : 'var(--beige)'}`,
                      background: isSelected ? s.accentBg : '#FFFDF9',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? `0 4px 16px ${s.glowColor}` : 'none'
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: isSelected ? s.color : 'var(--beige)',
                      color: isSelected ? '#fff' : 'var(--dark-espresso)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--dark-espresso)' }}>
                          {s.name}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: s.color,
                          background: 'rgba(255,255,255,0.7)',
                          padding: '2px 8px',
                          borderRadius: 99
                        }}>
                          Score {s.scoreRange}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {s.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Milestone Achievements */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Award size={18} color="var(--gold)" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark-espresso)' }}>
                Stage {stage + 1} Metrics Summary
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>TARGET SAVINGS RATE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: currentStage.color, marginTop: 2 }}>
                  {stage === 0 ? '5% – 10%' : stage === 1 ? '10% – 20%' : stage === 2 ? '20% – 40%' : '40%+'}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>EMERGENCY RESERVE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: currentStage.color, marginTop: 2 }}>
                  {stage === 0 ? '$1,000 Buffer' : stage === 1 ? '1–3 Months' : stage === 2 ? '3–6 Months' : '6–12 Months'}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>INVESTMENT PROFILE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: currentStage.color, marginTop: 2 }}>
                  {stage === 0 ? 'Learning Basics' : stage === 1 ? 'Employer Match' : stage === 2 ? 'Diversified ETFs' : 'Multi-Asset Growth'}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>FINANCIAL CONFIDENCE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: currentStage.color, marginTop: 2 }}>
                  {stage === 0 ? 'Foundational' : stage === 1 ? 'Stabilized' : stage === 2 ? 'Accelerating' : 'Independent'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          div[style*="gridTemplateColumns: 'minmax(320px, 420px) 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
