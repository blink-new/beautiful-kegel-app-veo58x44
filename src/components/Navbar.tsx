
import { Link, useLocation } from 'react-router-dom'
import { Home, Activity, History, Settings, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { useAchievements } from '../context/AchievementsContext'
import { Badge } from './ui/badge'

const Navbar = () => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { getUnlockedCount } = useAchievements()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/exercise', icon: Activity, label: 'Exercise' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/achievements', icon: Award, label: 'Rewards', badge: getUnlockedCount() },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div 
            className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white font-bold">K</span>
          </motion.div>
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            KegelFit
          </motion.h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative overflow-hidden"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === "dark" ? 0 : 180 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-2 px-6 z-10">
        <ul className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <li key={item.path}>
                <Link to={item.path} className="flex flex-col items-center">
                  <div className="relative p-2">
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900"
                        initial={false}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <Icon className={`relative z-10 h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} />
                    
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-500"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar