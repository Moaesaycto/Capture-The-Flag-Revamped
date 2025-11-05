import './App.css'
import './components/styles/patterns.css'
import MainHeader from './components/main/MainHeader'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1">

      </main>
      <footer className="w-full bg-amber-400">Footer</footer>
    </div>
  )
}

export default App
