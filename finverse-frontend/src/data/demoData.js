// Demo data used when backend is unavailable
export const DEMO_OVERVIEW = {
  monthly_income: 5800,
  total_expenses: 3420,
  cash_flow: 2380,
  savings_rate: 41,
  health_score: 72,
  health_label: 'Financially Growing',
}

export const DEMO_EXPENSE_CATEGORIES = [
  { name: 'Housing', value: 1200, color: '#795548' },
  { name: 'Food', value: 620, color: '#C6A15B' },
  { name: 'Transport', value: 310, color: '#7C9274' },
  { name: 'Utilities', value: 185, color: '#D8C3A5' },
  { name: 'Entertainment', value: 280, color: '#C47B63' },
  { name: 'Health', value: 150, color: '#EDE2D0' },
  { name: 'Other', value: 675, color: '#78675B' },
]

export const DEMO_MONTHLY_CHART = [
  { month: 'May', income: 5800, expenses: 3100 },
  { month: 'Jun', income: 5800, expenses: 3380 },
  { month: 'Jul', income: 6200, expenses: 3500 },
  { month: 'Aug', income: 5800, expenses: 3280 },
  { month: 'Sep', income: 5800, expenses: 3600 },
  { month: 'Oct', income: 5800, expenses: 3420 },
]

export const DEMO_TRANSACTIONS = [
  { id: 1, description: 'Rent', category: 'Housing', amount: 1200, date: '2026-10-01', type: 'expense' },
  { id: 2, description: 'Salary', category: 'Income', amount: 5800, date: '2026-10-01', type: 'income' },
  { id: 3, description: 'Grocery Store', category: 'Food', amount: 145, date: '2026-10-03', type: 'expense' },
  { id: 4, description: 'Netflix', category: 'Entertainment', amount: 18, date: '2026-10-05', type: 'expense' },
  { id: 5, description: 'Electricity Bill', category: 'Utilities', amount: 95, date: '2026-10-06', type: 'expense' },
  { id: 6, description: 'Gym Membership', category: 'Health', amount: 50, date: '2026-10-07', type: 'expense' },
  { id: 7, description: 'Restaurant Dinner', category: 'Food', amount: 68, date: '2026-10-09', type: 'expense' },
  { id: 8, description: 'Freelance Payment', category: 'Income', amount: 450, date: '2026-10-12', type: 'income' },
  { id: 9, description: 'Uber', category: 'Transport', amount: 22, date: '2026-10-14', type: 'expense' },
  { id: 10, description: 'Online Course', category: 'Education', amount: 39, date: '2026-10-15', type: 'expense' },
]

export const DEMO_INSIGHTS = [
  {
    id: 1, category: 'Housing', amount: 1200, classification: 'essential',
    reason: 'Primary housing — non-negotiable essential expense.',
    suggestion: 'Consider refinancing or looking for a roommate if needed.',
    savings: null,
  },
  {
    id: 2, category: 'Food', amount: 620, classification: 'flexible',
    reason: 'Food is essential, but discretionary dining (restaurants, delivery) adds up.',
    suggestion: 'Meal planning can reduce this by 20–30%.',
    savings: 150,
  },
  {
    id: 3, category: 'Entertainment', amount: 280, classification: 'review',
    reason: 'Multiple subscriptions and outings — worth reviewing for overlap.',
    suggestion: 'Audit active subscriptions. Consider sharing plans.',
    savings: 80,
  },
  {
    id: 4, category: 'Transport', amount: 310, classification: 'flexible',
    reason: 'Mix of essential commuting and discretionary ride-hailing.',
    suggestion: 'Replacing some rides with public transport could save $60–80/month.',
    savings: 70,
  },
  {
    id: 5, category: 'Health', amount: 150, classification: 'essential',
    reason: 'Investing in your health has long-term financial and personal value.',
    suggestion: 'Check if employer benefits cover any of these costs.',
    savings: null,
  },
]

export const DEMO_GOALS = [
  { id: 1, name: 'Emergency Fund', target: 15000, current: 6200, deadline: '2027-06-01', color: '#7C9274' },
  { id: 2, name: 'Vacation to Japan', target: 4500, current: 1800, deadline: '2027-03-01', color: '#C6A15B' },
  { id: 3, name: 'New Laptop', target: 1800, current: 1200, deadline: '2026-12-01', color: '#795548' },
]

export const DEMO_RECOMMENDATIONS = [
  { text: 'Your savings rate of 41% is excellent — above the 20% recommended benchmark.', positive: true },
  { text: 'Dining out accounts for 30% of your food budget. Meal prepping 3 days/week could save ~$120/month.', positive: false },
  { text: 'You have 4 streaming subscriptions. Reviewing these could free up $35–50/month.', positive: false },
  { text: 'Emergency fund is 41% funded — great progress! Target: 3–6 months of expenses ($10k–$20k).', positive: true },
]
