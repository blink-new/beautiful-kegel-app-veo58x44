
import { useState } from 'react'
import { useKegel } from '../context/KegelContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { motion } from 'framer-motion'
import { Calendar, Clock, BarChart3 } from 'lucide-react'

const History = () => {
  const { sessions, getExerciseById } = useKegel()
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Filter sessions by selected month and year
  const filteredSessions = sortedSessions.filter(session => {
    const date = new Date(session.date)
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
  })
  
  // Group sessions by date
  const groupedSessions: Record<string, typeof sessions> = {}
  
  filteredSessions.forEach(session => {
    const date = new Date(session.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
    
    if (!groupedSessions[date]) {
      groupedSessions[date] = []
    }
    
    groupedSessions[date].push(session)
  })
  
  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Get month name
  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString('default', { month: 'long' })
  }
  
  // Handle month change
  const changeMonth = (increment: number) => {
    let newMonth = selectedMonth + increment
    let newYear = selectedYear
    
    if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    } else if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    }
    
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Exercise History</h1>
        <p className="text-slate-600 dark:text-slate-300">Track your progress over time</p>
      </div>
      
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Monthly Overview
            </CardTitle>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span className="font-medium">
                {getMonthName(selectedMonth)} {selectedYear}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            {filteredSessions.length > 0 ? (
              <div className="w-full h-24 flex items-end space-x-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const date = new Date(selectedYear, selectedMonth, day)
                  if (date.getMonth() !== selectedMonth) return null
                  
                  const dayStr = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })
                  
                  const sessionsForDay = groupedSessions[dayStr] || []
                  const height = sessionsForDay.length > 0 ? 
                    Math.min(100, 20 + (sessionsForDay.length * 20)) : 0
                  
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full rounded-t-sm ${
                          sessionsForDay.length > 0 
                            ? 'bg-blue-500 dark:bg-blue-600' 
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className={`text-xs mt-1 ${
                        date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear()
                          ? 'font-bold text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {day}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No exercises completed this month</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Session History
        </h2>
        
        {Object.keys(groupedSessions).length > 0 ? (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {Object.entries(groupedSessions).map(([date, sessions]) => (
              <motion.div key={date} variants={item}>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{date}</h3>
                
                <div className="space-y-3">
                  {sessions.map(session => {
                    const exercise = getExerciseById(session.exerciseId)
                    
                    return (
                      <Card key={session.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{exercise?.name || 'Unknown Exercise'}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {session.repetitionsDone} repetitions
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
                              <p className="font-medium">{formatTime(session.duration)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No exercise history for this month. Start exercising to track your progress!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default History