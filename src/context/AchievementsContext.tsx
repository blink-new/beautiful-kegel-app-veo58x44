
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useKegel, ExerciseSession } from './KegelContext'
import { Achievement } from '../components/AchievementBadge'

interface AchievementsContextType {
  achievements: Achievement[]
  checkAchievements: () => void
  getUnlockedCount: () => number
  getLatestUnlocked: () => Achievement | null
  hasNewAchievement: boolean
  clearNewAchievementFlag: () => void
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined)

const defaultAchievements: Achievement[] = [
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Complete your first exercise session',
    icon: 'zap',
    color: 'blue',
    unlocked: false
  },
  {
    id: 'streak-3',
    title: 'Consistency',
    description: 'Maintain a 3-day streak',
    icon: 'target',
    color: 'purple',
    unlocked: false,
    progress: 0,
    goal: 3
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'award',
    color: 'indigo',
    unlocked: false,
    progress: 0,
    goal: 7
  },
  {
    id: 'sessions-10',
    title: 'Dedicated',
    description: 'Complete 10 exercise sessions',
    icon: 'trophy',
    color: 'amber',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  {
    id: 'sessions-30',
    title: 'Expert',
    description: 'Complete 30 exercise sessions',
    icon: 'medal',
    color: 'rose',
    unlocked: false,
    progress: 0,
    goal: 30
  },
  {
    id: 'all-exercises',
    title: 'Explorer',
    description: 'Try all default exercise types',
    icon: 'star',
    color: 'teal',
    unlocked: false,
    progress: 0,
    goal: 3
  },
  {
    id: 'custom-exercise',
    title: 'Innovator',
    description: 'Create your own custom exercise',
    icon: 'heart',
    color: 'pink',
    unlocked: false
  }
]

export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const { sessions, streakDays, exercises } = useKegel()
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('kegel-achievements')
    return saved ? JSON.parse(saved) : defaultAchievements
  })
  
  const [hasNewAchievement, setHasNewAchievement] = useState(false)
  
  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('kegel-achievements', JSON.stringify(achievements))
  }, [achievements])
  
  const checkAchievements = () => {
    let updated = false
    const newAchievements = [...achievements]
    
    // First session achievement
    const firstSessionAchievement = newAchievements.find(a => a.id === 'first-session')
    if (firstSessionAchievement && !firstSessionAchievement.unlocked && sessions.length > 0) {
      firstSessionAchievement.unlocked = true
      updated = true
    }
    
    // Streak achievements
    const streak3Achievement = newAchievements.find(a => a.id === 'streak-3')
    if (streak3Achievement) {
      streak3Achievement.progress = streakDays
      if (!streak3Achievement.unlocked && streakDays >= 3) {
        streak3Achievement.unlocked = true
        updated = true
      }
    }
    
    const streak7Achievement = newAchievements.find(a => a.id === 'streak-7')
    if (streak7Achievement) {
      streak7Achievement.progress = streakDays
      if (!streak7Achievement.unlocked && streakDays >= 7) {
        streak7Achievement.unlocked = true
        updated = true
      }
    }
    
    // Sessions count achievements
    const sessions10Achievement = newAchievements.find(a => a.id === 'sessions-10')
    if (sessions10Achievement) {
      sessions10Achievement.progress = sessions.length
      if (!sessions10Achievement.unlocked && sessions.length >= 10) {
        sessions10Achievement.unlocked = true
        updated = true
      }
    }
    
    const sessions30Achievement = newAchievements.find(a => a.id === 'sessions-30')
    if (sessions30Achievement) {
      sessions30Achievement.progress = sessions.length
      if (!sessions30Achievement.unlocked && sessions.length >= 30) {
        sessions30Achievement.unlocked = true
        updated = true
      }
    }
    
    // Try all default exercises
    const allExercisesAchievement = newAchievements.find(a => a.id === 'all-exercises')
    if (allExercisesAchievement) {
      // Get unique exercise IDs from sessions
      const uniqueExerciseIds = new Set(sessions.map(session => session.exerciseId))
      // Count how many of the default exercises have been tried
      const defaultExerciseIds = ['quick-1', 'endurance-1', 'custom-1']
      const triedDefaultCount = defaultExerciseIds.filter(id => uniqueExerciseIds.has(id)).length
      
      allExercisesAchievement.progress = triedDefaultCount
      if (!allExercisesAchievement.unlocked && triedDefaultCount >= 3) {
        allExercisesAchievement.unlocked = true
        updated = true
      }
    }
    
    // Custom exercise achievement
    const customExerciseAchievement = newAchievements.find(a => a.id === 'custom-exercise')
    if (customExerciseAchievement) {
      const hasCustomExercise = exercises.some(ex => 
        !['quick-1', 'endurance-1', 'custom-1'].includes(ex.id)
      )
      
      if (!customExerciseAchievement.unlocked && hasCustomExercise) {
        customExerciseAchievement.unlocked = true
        updated = true
      }
    }
    
    if (updated) {
      setAchievements(newAchievements)
      setHasNewAchievement(true)
    }
  }
  
  // Check achievements whenever relevant data changes
  useEffect(() => {
    checkAchievements()
  }, [sessions, streakDays, exercises])
  
  const getUnlockedCount = () => {
    return achievements.filter(a => a.unlocked).length
  }
  
  const getLatestUnlocked = () => {
    const unlocked = achievements.filter(a => a.unlocked)
    if (unlocked.length === 0) return null
    return unlocked[unlocked.length - 1]
  }
  
  const clearNewAchievementFlag = () => {
    setHasNewAchievement(false)
  }
  
  return (
    <AchievementsContext.Provider value={{
      achievements,
      checkAchievements,
      getUnlockedCount,
      getLatestUnlocked,
      hasNewAchievement,
      clearNewAchievementFlag
    }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export const useAchievements = () => {
  const context = useContext(AchievementsContext)
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider')
  }
  return context
}