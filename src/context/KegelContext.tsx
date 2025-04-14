
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types
export type ExerciseType = 'quick' | 'endurance' | 'custom'

export interface Exercise {
  id: string
  type: ExerciseType
  contractTime: number // in seconds
  relaxTime: number // in seconds
  repetitions: number
  name: string
}

export interface ExerciseSession {
  id: string
  date: string
  exerciseId: string
  completed: boolean
  duration: number // in seconds
  repetitionsDone: number
}

interface KegelContextType {
  exercises: Exercise[]
  sessions: ExerciseSession[]
  addExercise: (exercise: Omit<Exercise, 'id'>) => void
  updateExercise: (id: string, exercise: Partial<Exercise>) => void
  deleteExercise: (id: string) => void
  addSession: (session: Omit<ExerciseSession, 'id'>) => void
  getExerciseById: (id: string) => Exercise | undefined
  getDefaultExercises: () => Exercise[]
  streakDays: number
  totalSessions: number
  lastSessionDate: string | null
}

const KegelContext = createContext<KegelContextType | undefined>(undefined)

// Default exercises
const defaultExercises: Exercise[] = [
  {
    id: 'quick-1',
    type: 'quick',
    contractTime: 3,
    relaxTime: 3,
    repetitions: 10,
    name: 'Quick Contractions'
  },
  {
    id: 'endurance-1',
    type: 'endurance',
    contractTime: 10,
    relaxTime: 5,
    repetitions: 5,
    name: 'Endurance Builder'
  },
  {
    id: 'custom-1',
    type: 'custom',
    contractTime: 5,
    relaxTime: 5,
    repetitions: 8,
    name: 'Balanced Routine'
  }
]

export const KegelProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('kegel-exercises')
    return saved ? JSON.parse(saved) : defaultExercises
  })
  
  const [sessions, setSessions] = useState<ExerciseSession[]>(() => {
    const saved = localStorage.getItem('kegel-sessions')
    return saved ? JSON.parse(saved) : []
  })

  // Calculate streak days
  const [streakDays, setStreakDays] = useState(0)
  const [lastSessionDate, setLastSessionDate] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('kegel-exercises', JSON.stringify(exercises))
  }, [exercises])

  useEffect(() => {
    localStorage.setItem('kegel-sessions', JSON.stringify(sessions))
    
    // Calculate streak and stats
    if (sessions.length > 0) {
      const sortedSessions = [...sessions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setLastSessionDate(sortedSessions[0].date)
      
      // Calculate streak
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const uniqueDates = new Set<string>()
      sortedSessions.forEach(session => {
        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0)
        uniqueDates.add(sessionDate.toISOString())
      })
      
      const uniqueDatesArray = Array.from(uniqueDates).map(dateStr => new Date(dateStr))
      uniqueDatesArray.sort((a, b) => b.getTime() - a.getTime())
      
      // Check if there's a session today
      const hasSessionToday = uniqueDatesArray.length > 0 && 
        uniqueDatesArray[0].getTime() === today.getTime()
      
      if (hasSessionToday) {
        streak = 1
        
        let checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - 1)
        
        for (let i = 1; i < uniqueDatesArray.length; i++) {
          if (uniqueDatesArray[i].getTime() === checkDate.getTime()) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        }
      }
      
      setStreakDays(streak)
    }
  }, [sessions])

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = {
      ...exercise,
      id: `exercise-${Date.now()}`
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (id: string, updatedExercise: Partial<Exercise>) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id ? { ...exercise, ...updatedExercise } : exercise
    ))
  }

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id))
  }

  const addSession = (session: Omit<ExerciseSession, 'id'>) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`
    }
    setSessions([...sessions, newSession])
  }

  const getExerciseById = (id: string) => {
    return exercises.find(exercise => exercise.id === id)
  }

  const getDefaultExercises = () => {
    return defaultExercises
  }

  const totalSessions = sessions.length

  return (
    <KegelContext.Provider value={{
      exercises,
      sessions,
      addExercise,
      updateExercise,
      deleteExercise,
      addSession,
      getExerciseById,
      getDefaultExercises,
      streakDays,
      totalSessions,
      lastSessionDate
    }}>
      {children}
    </KegelContext.Provider>
  )
}

export const useKegel = () => {
  const context = useContext(KegelContext)
  if (context === undefined) {
    throw new Error('useKegel must be used within a KegelProvider')
  }
  return context
}