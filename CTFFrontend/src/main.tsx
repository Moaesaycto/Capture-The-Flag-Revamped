import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/contexts/AuthContext.tsx'
import { GameProvider } from './components/contexts/GameContext.tsx'
import { MessageProvider } from './components/contexts/MessageContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <MessageProvider>
              <App />
          </MessageProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
