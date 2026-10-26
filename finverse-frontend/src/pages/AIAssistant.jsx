import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap, RefreshCw, Sparkles } from 'lucide-react'
import api from '../api/client'

const SUGGESTED_PROMPTS = [
  'How can I reduce my monthly expenses?',
  'Help me create a budget plan.',
  'How do I build an emergency fund?',
  'Explain investment options for beginners.',
  "What is the 50/30/20 budgeting rule?",
  'How can I improve my financial health score?'
]

const DEMO_RESPONSES = {
  reduce: `Here are practical, high-impact strategies to reduce your monthly expenses:

1. **Audit Subscriptions & Recurring Charges**
   • Cancel recurring services not used in the past 30 days.
   • Look out for annual renewals and streaming overlap.

2. **Optimize Food & Dining Expenses**
   • Discretionary food and delivery is often the largest flexible expense.
   • Preparing 3 meals a week at home can save $150–$300/month.

3. **Consolidate Utility & Transport Costs**
   • Review mobile phone plans and home internet bandwidth tiers.
   • Group errands and combine trips to reduce rideshare and fuel costs.

4. **Apply the 24-Hour Purchase Rule**
   • For any non-essential purchase exceeding $50, delay 24 hours to eliminate impulse spending.

*Your current spending breakdown shows the highest potential savings in dining out and entertainment.*`,

  budget: `Here is a custom budget structure based on the **50/30/20 framework**:

• **50% Needs ($2,900 target based on $5,800 income)**
  - Housing, utilities, groceries, transport, health, and minimum debt commitments.
  - Your current essential commitments: ~$1,385 (Well within limit! ✅)

• **30% Wants ($1,740 target)**
  - Dining out, hobbies, subscriptions, leisure, shopping.
  - Your current flexible expenses: ~$900 (Balanced ✅)

• **20% Savings & Future Wealth ($1,160 target)**
  - Emergency fund contributions, index funds, retirement investments.
  - Your actual current savings: $2,380 (~41% savings rate — Excellent! 🌟)

*Would you like assistance allocating your surplus into specific financial goals?*`,

  emergency: `Building your emergency reserve is step one for financial peace of mind:

1. **Calculate Your Target**
   • Aim for 3 to 6 months of essential living expenses ($6,000 – $12,000 for your profile).
   • You currently have $6,200 saved in your Emergency Fund goal (41% complete!).

2. **Choose the Right Vehicle**
   • Park your reserve in a High-Yield Savings Account (HYSA) earning 4%–5% APY.
   • Keep it separate from your daily checking account to resist casual spending.

3. **Automate Payday Contributions**
   • Set up a recurring transfer on payday ($200–$500/month) so you save before spending.

4. **Strictly Define "Emergency"**
   • Valid: Job loss, unexpected medical bill, urgent car repair.
   • Invalid: Vacations, tech upgrades, flash sales.`,

  invest: `Here is a beginner-friendly overview of core investment instruments:

🔵 **Low Risk (Capital Preservation)**
• **High-Yield Savings & Money Market Accounts** (~4%–5% APY) — Ideal for short-term goals.
• **Treasury Bills & Government Bonds** — Guaranteed fixed yield, highly secure.

🟡 **Moderate Risk (Long-Term Wealth Accumulation)**
• **Broad-Market Index Funds (e.g. S&P 500 ETFs / Total Market ETFs like VOO, VTI)**
  - Low expense ratio, broad diversification across 500+ top companies.
  - Historically delivers ~7%–10% annualized long-term return before inflation.
• **Target Date Retirement Funds** — Automatically rebalance as you age.

🔴 **Higher Risk (Growth & Volatility)**
• **Individual Stocks** — Higher potential return but requires company research and carries single-company risk.
• **Real Estate Investment Trusts (REITs)** — Exposure to real estate without property management.

⚠️ *Educational disclaimer: Not personalized investment advice. Consult a certified financial planner for individual portfolio allocation.*`,

  rule503020: `The **50/30/20 Rule** divides after-tax income into 3 clear buckets:

1. **50% Needs**: Essential survival costs (Rent, utilities, groceries, basic transport, insurance).
2. **30% Wants**: Lifestyle enhancements (Dining out, streaming, travel, entertainment).
3. **20% Savings**: Emergency fund, debt reduction beyond minimums, and retirement investing.

**How You Compare:**
Your current savings rate is **41%**, which significantly exceeds the standard 20% benchmark. You are on track for accelerated wealth accumulation!`,

  default: `Thank you for your question! Here are key financial pillars to guide your decision:

1. **Maintain Positive Cash Flow**: Consistently keep expenses below your net monthly income.
2. **Grow Liquid Reserves**: Maintain at least 3 months of essential expenses in a safe, high-yield account.
3. **Automate Wealth Building**: Invest surplus cash systematically every month to harness compound interest.
4. **Track & Review**: Regularly review spending categories to eliminate unnoticed waste.

*Running in demo mode. Connect a Groq API key in your server environment to unlock live AI responses.*`
}

function getLocalDemoResponse(query) {
  const q = (query || '').toLowerCase()
  if (q.includes('reduc') || q.includes('cut') || q.includes('save') || q.includes('lower') || q.includes('expense')) {
    return DEMO_RESPONSES.reduce
  }
  if (q.includes('budget') || q.includes('plan')) {
    return DEMO_RESPONSES.budget
  }
  if (q.includes('emergency') || q.includes('buffer')) {
    return DEMO_RESPONSES.emergency
  }
  if (q.includes('invest') || q.includes('stock') || q.includes('fund') || q.includes('market') || q.includes('beginner')) {
    return DEMO_RESPONSES.invest
  }
  if (q.includes('50/30/20') || q.includes('rule') || q.includes('50') || q.includes('30')) {
    return DEMO_RESPONSES.rule503020
  }
  return DEMO_RESPONSES.default
}

function FormattedContent({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} style={{ height: '8px' }} />
        }
        // Bold headers or list items
        let formatted = line
        const hasBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ')
        const isNumbered = /^\d+\./.test(line.trim())

        return (
          <div
            key={idx}
            style={{
              paddingLeft: hasBullet || isNumbered ? '12px' : '0',
              fontWeight: line.startsWith('**') && line.endsWith('**') ? 700 : 400
            }}
          >
            {line}
          </div>
        )
      })}
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      alignItems: 'flex-start'
    }}>
      {!isUser && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--dark-espresso), var(--primary-brown))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(59,42,36,0.15)'
        }}>
          <Bot size={18} color="#FFFDF9" />
        </div>
      )}

      <div style={{
        maxWidth: '82%',
        padding: '14px 18px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser ? 'var(--primary-brown)' : 'var(--card-bg)',
        border: isUser ? 'none' : '1.5px solid var(--beige)',
        color: isUser ? '#FFFDF9' : 'var(--text-primary)',
        fontSize: '14px',
        lineHeight: 1.6,
        boxShadow: 'var(--shadow)'
      }}>
        <FormattedContent text={msg.content} />

        {/* Source Badges */}
        {!isUser && (
          <div style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--beige)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {msg.source === 'groq+serpapi' && (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(124,146,116,0.12)', color: 'var(--positive)', padding: '2px 7px', borderRadius: '6px', fontWeight: 600 }}>
                  ⚡ Groq AI (LLaMA 3.3)
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(198,161,91,0.14)', color: 'var(--gold)', padding: '2px 7px', borderRadius: '6px', fontWeight: 600 }}>
                  🌐 SerpAPI Web Intel
                </span>
              </>
            )}
            {msg.source === 'groq' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(124,146,116,0.12)', color: 'var(--positive)', padding: '2px 7px', borderRadius: '6px', fontWeight: 600 }}>
                ⚡ Groq AI (LLaMA 3.3)
              </span>
            )}
            {msg.isDemo && (
              <span style={{ color: 'var(--text-secondary)' }}>
                ⚠ Offline Educational Mode
              </span>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'var(--beige)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <User size={18} color="var(--primary-brown)" />
        </div>
      )}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello Alex! 👋 I'm **FINVERSE AI**, your personal wealth and budgeting assistant.\n\nI can analyze your spending patterns, explain budgeting frameworks (like the 50/30/20 rule), assist with savings goals, or provide beginner investment guidance.\n\nWhat financial question can I help you with today?`,
      isDemo: false
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    try {
      if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch {
      // Safe fallback
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim()
    if (!textToSend || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: textToSend }])
    setLoading(true)

    try {
      const response = await api.post('/ai/chat/', { message: textToSend })
      const answer = response.data.response || response.data.message || 'No response received.'
      const source = response.data.source || 'groq'
      const sourceIsDemo = source === 'demo'
      if (sourceIsDemo) setDemoMode(true)

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: answer, isDemo: sourceIsDemo, source }
      ])
    } catch {
      // Backend unreachable or offline — use educational demo response gracefully
      setDemoMode(true)
      await new Promise(r => setTimeout(r, 600))
      const fallbackAnswer = getLocalDemoResponse(textToSend)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: fallbackAnswer, isDemo: true, source: 'demo' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 130px)',
      minHeight: '520px'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '12px',
        flexShrink: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dark-espresso)' }}>
              AI Financial Assistant
            </h1>
            <span className="demo-badge">Finverse Intelligence</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '3px' }}>
            Get instant guidance on expenses, cash flow, debt reduction, and investment principles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {demoMode ? (
            <span className="demo-badge">⚠ Offline Demo Mode</span>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(124,146,116,0.12)',
                padding: '5px 11px',
                borderRadius: '99px'
              }}>
                <Zap size={13} color="var(--positive)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--positive)' }}>
                  ⚡ Groq Active
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(198,161,91,0.14)',
                padding: '5px 11px',
                borderRadius: '99px'
              }}>
                <span style={{ fontSize: '12px' }}>🌐</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)' }}>
                  SerpAPI Active
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div style={{ marginBottom: '14px', flexShrink: 0 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={12} color="var(--gold)" />
            Suggested Questions
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SUGGESTED_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={{
                  padding: '7px 13px',
                  borderRadius: '99px',
                  fontSize: '12px',
                  border: '1.5px solid var(--beige)',
                  background: 'var(--card-bg)',
                  color: 'var(--primary-brown)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-brown)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--beige)'}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Conversation Box */}
      <div
        className="card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          marginBottom: '16px',
          minHeight: '260px',
          background: 'var(--card-bg)'
        }}
      >
        {messages.map((m, idx) => (
          <MessageBubble key={idx} msg={m} />
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--dark-espresso), var(--primary-brown))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot size={18} color="#FFFDF9" />
            </div>
            <div style={{
              padding: '12px 18px',
              borderRadius: '4px 18px 18px 18px',
              background: 'var(--card-bg)',
              border: '1.5px solid var(--beige)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Analyzing finances</span>
              <RefreshCw size={14} color="var(--primary-brown)" style={{ animation: 'spin 1.5s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field & Submit Action */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask a question about your finances, budget, or investments…"
          disabled={loading}
          style={{
            flex: 1,
            padding: '13px 18px',
            borderRadius: '12px',
            border: '1.5px solid var(--beige)',
            fontSize: '14px',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(59,42,36,0.04)'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          style={{
            padding: '13px 20px',
            borderRadius: '12px',
            border: 'none',
            background: input.trim() && !loading ? 'var(--primary-brown)' : 'var(--beige)',
            color: input.trim() && !loading ? '#FFFDF9' : 'var(--text-secondary)',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '14px',
            transition: 'all 0.15s ease'
          }}
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>

      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        flexShrink: 0
      }}>
        ⚠️ Educational financial information only. Never provides guaranteed returns or personalized advisory.
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
