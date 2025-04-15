
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'

// Pages
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExerciseSession from './pages/ExerciseSession'
import History from './pages/History'
import Settings from './pages/Settings'
import Achievements from './pages/Achievements'

// Context
import { KegelProvider } from './context/KegelContext'
import { AchievementsProvider } from './context/AchievementsContext'
import AchievementPopup from './components/AchievementPopup'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="kegel-app-theme">
      <KegelProvider>
        <AchievementsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="exercise" element={<ExerciseSession />} />
                <Route path="history" element={<History />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
          <AchievementPopup />
        </AchievementsProvider>
      </KegelProvider>
    </ThemeProvider>
  )
}

export default App