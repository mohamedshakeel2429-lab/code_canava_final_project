import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import SpendingInsights from './pages/SpendingInsights'
import Goals from './pages/Goals'
import AIAssistant from './pages/AIAssistant'
import Avatar from './pages/Avatar'
import Settings from './pages/Settings'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="insights" element={<SpendingInsights />} />
            <Route path="goals" element={<Goals />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="ai" element={<Navigate to="/assistant" replace />} />
            <Route path="ai-assistant" element={<Navigate to="/assistant" replace />} />
            <Route path="avatar" element={<Avatar />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
