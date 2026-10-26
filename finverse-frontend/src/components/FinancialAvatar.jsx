import React from 'react'

export const FINANCIAL_STAGES = [
  {
    id: 0,
    name: 'Starting Out',
    scoreRange: '0–25',
    color: '#C47B63',
    glowColor: 'rgba(196, 123, 99, 0.4)',
    accentBg: 'rgba(196, 123, 99, 0.12)',
    badge: 'Stage 1',
    description: 'Building your financial foundations. Focus on recording every transaction, understanding your cash flow, and setting up your initial emergency buffer.',
    recommendation: 'Track 100% of discretionary spending and target a $1,000 beginner emergency reserve.',
    avatarAura: 'hue-rotate(330deg) saturate(0.9)',
    statusTag: 'Foundation Phase'
  },
  {
    id: 1,
    name: 'Building Stability',
    scoreRange: '26–50',
    color: '#C6A15B',
    glowColor: 'rgba(198, 161, 91, 0.45)',
    accentBg: 'rgba(198, 161, 91, 0.12)',
    badge: 'Stage 2',
    description: 'Establishing regular savings and eliminating high-interest debt. Cash flow is steady and predictable.',
    recommendation: 'Build emergency savings toward 3 months of essential expenses and pay down variable debts.',
    avatarAura: 'hue-rotate(20deg) saturate(1.1)',
    statusTag: 'Consistent Habit'
  },
  {
    id: 2,
    name: 'Financially Growing',
    scoreRange: '51–75',
    color: '#795548',
    glowColor: 'rgba(121, 85, 72, 0.45)',
    accentBg: 'rgba(121, 85, 72, 0.12)',
    badge: 'Stage 3',
    description: 'Saving more than 20% of monthly income. Emergency fund is robust and automated wealth accumulation has begun.',
    recommendation: 'Expand low-cost index investing and maximize tax-advantaged retirement accounts.',
    avatarAura: 'hue-rotate(0deg) saturate(1.15) brightness(1.02)',
    statusTag: 'Growth Mode'
  },
  {
    id: 3,
    name: 'Financially Secure',
    scoreRange: '76–100',
    color: '#7C9274',
    glowColor: 'rgba(124, 146, 116, 0.5)',
    accentBg: 'rgba(124, 146, 116, 0.15)',
    badge: 'Stage 4',
    description: 'High net savings rate, diverse assets, minimal bad liabilities, and strong resilience against financial shocks.',
    recommendation: 'Optimize portfolio diversification, tax strategy, and long-term legacy planning.',
    avatarAura: 'hue-rotate(85deg) saturate(1.25) brightness(1.05)',
    statusTag: 'Financial Freedom'
  }
]

export default function FinancialAvatar({
  stageIndex = 2,
  size = 'large',
  showDetails = true,
  onStageChange = null
}) {
  const currentStage = FINANCIAL_STAGES[stageIndex] || FINANCIAL_STAGES[2]
  const isCompact = size === 'compact'

  return (
    <div className="card fade-in" style={{
      padding: isCompact ? '18px' : '26px',
      position: 'relative',
      overflow: 'hidden',
      border: `1.5px solid ${currentStage.color}33`,
      background: 'var(--card-bg)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Background ambient lighting aura matching stage */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '320px',
        background: `radial-gradient(circle, ${currentStage.glowColor} 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
        filter: 'blur(35px)'
      }} />

      {/* Top Header Badge */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isCompact ? '12px' : '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: currentStage.color,
            color: '#FFFDF9',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '99px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            {currentStage.badge}
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}>
            {currentStage.statusTag}
          </span>
        </div>
        <span className="demo-badge" style={{ fontSize: '10px', padding: '2px 8px' }}>
          3D AVATAR
        </span>
      </div>

      {/* Avatar Visual Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: isCompact ? '6px 0 12px' : '10px 0 20px'
      }}>
        <div style={{
          position: 'relative',
          width: isCompact ? '160px' : '240px',
          height: isCompact ? '260px' : '380px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: `0 14px 34px -10px ${currentStage.glowColor}, 0 2px 10px rgba(59,42,36,0.08)`,
          border: `2px solid ${currentStage.color}66`,
          background: 'linear-gradient(180deg, #1f1b24 0%, #110d18 100%)'
        }}>
          {/* Avatar Character Image */}
          <img
            src="/avatar.jpg"
            alt="FINVERSE 3D Financial Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              filter: currentStage.avatarAura,
              transition: 'filter 0.5s ease'
            }}
            onError={(e) => {
              // fallback if direct image fails
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />

          {/* Fallback stylized avatar if image cannot load */}
          <div style={{
            display: 'none',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--dark-espresso), var(--primary-brown))',
            color: '#fff',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Finverse Avatar</div>
          </div>

          {/* Floating Stage Indicator on image */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(59, 42, 36, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(216, 195, 165, 0.25)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#D8C3A5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Health Score
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FAF7F0' }}>
                {stageIndex === 0 ? '22 / 100' : stageIndex === 1 ? '45 / 100' : stageIndex === 2 ? '72 / 100' : '92 / 100'}
              </span>
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: currentStage.color,
              boxShadow: `0 0 10px ${currentStage.color}`
            }} />
          </div>
        </div>
      </div>

      {/* Stage Details & Progression Info */}
      {showDetails && (
        <div style={{ position: 'relative', zIndex: 1, marginTop: '8px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '19px',
              fontWeight: 800,
              color: 'var(--dark-espresso)',
              marginBottom: '6px'
            }}>
              {currentStage.name}
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              maxWidth: '420px',
              margin: '0 auto'
            }}>
              {currentStage.description}
            </p>
          </div>

          {/* Progress bar across the 4 stages */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              <span>Financial Stage Progress</span>
              <span style={{ color: currentStage.color }}>
                {Math.round(((stageIndex + 1) / 4) * 100)}% Complete
              </span>
            </div>
            <div style={{
              height: '8px',
              background: 'var(--beige)',
              borderRadius: '99px',
              overflow: 'hidden',
              display: 'flex',
              gap: '3px',
              padding: '1px'
            }}>
              {FINANCIAL_STAGES.map((s, idx) => (
                <div
                  key={s.id}
                  style={{
                    flex: 1,
                    height: '100%',
                    borderRadius: '99px',
                    background: idx <= stageIndex ? currentStage.color : 'rgba(216, 195, 165, 0.4)',
                    transition: 'background 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actionable Next Step Card */}
          <div style={{
            background: currentStage.accentBg,
            borderLeft: `3px solid ${currentStage.color}`,
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            lineHeight: 1.5
          }}>
            <strong style={{ color: currentStage.color }}>Next Milestone: </strong>
            {currentStage.recommendation}
          </div>

          {/* Stage selection buttons */}
          {onStageChange && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              marginTop: '16px'
            }}>
              {FINANCIAL_STAGES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => onStageChange(idx)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: `1.5px solid ${stageIndex === idx ? s.color : 'var(--beige)'}`,
                    background: stageIndex === idx ? s.accentBg : 'transparent',
                    color: stageIndex === idx ? s.color : 'var(--text-secondary)',
                    fontWeight: stageIndex === idx ? 700 : 500,
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Stage {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
