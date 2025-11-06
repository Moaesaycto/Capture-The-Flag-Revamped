import './components/styles/patterns.css'
import MainHeader from './components/main/MainHeader'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainFooter from './components/main/MainFooter'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </main>
      <MainFooter />
    </div>
  )
}

export default App
