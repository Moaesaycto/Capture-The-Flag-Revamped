import './components/styles/patterns.css'
import MainHeader from './components/main/MainHeader'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainFooter from './components/main/MainFooter'
import MessagesPage from './pages/MessagesPage'

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <MainHeader />
      <main className="flex-1 min-h-0 w-full flex bg-neutral-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/message" element={<MessagesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <MainFooter />
    </div>
  )
}

export default App
