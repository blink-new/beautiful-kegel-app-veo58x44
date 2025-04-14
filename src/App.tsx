
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'

// Pages
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExerciseSession from './pages/ExerciseSession'
import History from './pages/History'
import Settings from './pages/Settings'

// Context
import { KegelProvider } from './context/KegelContext'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="kegel-app-theme">
      <KegelProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="exercise" element={<ExerciseSession />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </KegelProvider>
    </ThemeProvider>
  )
}

export default App