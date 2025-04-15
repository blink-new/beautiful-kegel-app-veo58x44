
import { useState, useEffect } from 'react'
import { useKegel, ExerciseSession } from '../context/KegelContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { motion } from 'framer-motion'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { Activity } from 'lucide-react'

const WeeklyProgressChart = () => {
  const { sessions } = useKegel()
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [sessionsPerDay, setSessionsPerDay] = useState<number[]>([])
  const [maxSessions, setMaxSessions] = useState(0)

  useEffect(() => {
    // Generate array of dates for current week (Sunday to Saturday)
    const startDate = startOfWeek(new Date(), { weekStartsOn: 0 })
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    setWeekDays(days)

    // Count sessions for each day of the week
    const sessionsCount = days.map(day => {
      return sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return isSameDay(sessionDate, day)
      }).length
    })
    
    setSessionsPerDay(sessionsCount)
    setMaxSessions(Math.max(...sessionsCount, 1)) // Ensure at least 1 for scaling
  }, [sessions])

  const getBarHeight = (sessions: number) => {
    const minHeight = 15 // Minimum height in pixels
    const maxHeight = 100 // Maximum height in pixels
    
    if (sessions === 0) return minHeight
    return minHeight + ((sessions / maxSessions) * (maxHeight - minHeight))
  }

  const getDayLabel = (date: Date) => {
    return format(date, 'EEE')
  }

  const getBarColor = (sessions: number, index: number) => {
    if (sessions === 0) return 'bg-slate-200 dark:bg-slate-700'
    
    const colors = [
      'from-blue-400 to-blue-600',
      'from-indigo-400 to-indigo-600',
      'from-purple-400 to-purple-600',
      'from-violet-400 to-violet-600',
      'from-fuchsia-400 to-fuchsia-600',
      'from-pink-400 to-pink-600',
      'from-rose-400 to-rose-600'
    ]
    
    return `bg-gradient-to-t ${colors[index]}`
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-indigo-100 dark:border-indigo-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-transparent dark:from-indigo-900/20 dark:to-transparent" />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-end justify-between h-[120px] mt-4 mb-2 px-2">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div 
                className={`w-8 rounded-t-md ${getBarColor(sessionsPerDay[index], index)}`}
                style={{ height: 0 }}
                animate={{ height: getBarHeight(sessionsPerDay[index]) }}
                transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                {sessionsPerDay[index] > 0 && (
                  <motion.div 
                    className="flex justify-center items-center text-white font-medium text-xs w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                  >
                    {sessionsPerDay[index]}
                  </motion.div>
                )}
              </motion.div>
              <div className={`text-xs mt-2 font-medium ${
                isToday(day) 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {getDayLabel(day)}
                {isToday(day) && (
                  <motion.div 
                    className="h-1 w-1 bg-indigo-500 rounded-full mx-auto mt-1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklyProgressChart