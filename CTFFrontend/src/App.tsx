import './components/styles/patterns.css'
import MainHeader from './components/main/MainHeader'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainFooter from './components/main/MainFooter'
import MessagesPage from './pages/MessagesPage'
import SettingsPage from './pages/SettingsPage'
import { useAuthContext } from './components/contexts/AuthContext'
import type { JSX } from 'react'

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-neutral-950">
      <MainHeader />
      <main className="flex-1 min-h-0 w-full flex bg-neutral-900 max-w-6xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <MainFooter />
    </div>
  )
}


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { me } = useAuthContext();

  if (!me) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default App
