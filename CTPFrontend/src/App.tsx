import './components/styles/patterns.css'
import MainHeader from './components/main/MainHeader'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainFooter from './components/main/MainFooter'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full">
        <MainHeader />
        <main className="flex-1 w-full flex">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <MainFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
