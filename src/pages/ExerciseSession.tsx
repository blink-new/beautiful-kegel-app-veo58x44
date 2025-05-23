
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useKegel, Exercise } from '../context/KegelContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, ArrowLeft, CheckCircle2, Timer } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

const ExerciseSession = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getExerciseById, addSession } = useKegel()
  const { width, height } = useWindowSize()
  
  // Get exercise ID from URL params
  const params = new URLSearchParams(location.search)
  const exerciseId = params.get('id')
  
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentRep, setCurrentRep] = useState(1) // Start at 1
  const [phase, setPhase] = useState<'contract' | 'relax'>('contract')
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  // Load exercise data
  useEffect(() => {
    if (exerciseId) {
      const foundExercise = getExerciseById(exerciseId)
      if (foundExercise) {
        setExercise(foundExercise)
        setTimeLeft(foundExercise.contractTime)
        
        // Calculate total time
        const total = (foundExercise.contractTime + foundExercise.relaxTime) * foundExercise.repetitions
        setTotalTime(total)
      } else {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [exerciseId, getExerciseById, navigate])
  
  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Phase completed
            if (phase === 'contract') {
              // Contract phase completed - switch to relax phase
              setPhase('relax')
              return exercise?.relaxTime || 0
            } else {
              // Relax phase completed - increment rep counter
              const nextRep = currentRep + 1
              
              // Check if all reps are completed
              if (nextRep > (exercise?.repetitions || 0)) {
                // Exercise completed
                clearInterval(timerRef.current!)
                setIsCompleted(true)
                setShowConfetti(true)
                return 0
              }
              
              // Move to next rep
              setCurrentRep(nextRep)
              // Switch back to contract phase
              setPhase('contract')
              return exercise?.contractTime || 0
            }
          }
          return prev - 1
        })
        
        setElapsedTime(prev => prev + 1)
      }, 1000)
      
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now()
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, isPaused, phase, currentRep, exercise, isCompleted])
  
  // Handle exercise completion
  useEffect(() => {
    if (isCompleted && exercise) {
      const duration = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000)
      
      addSession({
        date: new Date().toISOString(),
        exerciseId: exercise.id,
        completed: true,
        duration,
        repetitionsDone: exercise.repetitions
      })
      
      toast({
        title: "Exercise Completed!",
        description: `Great job! You've completed ${exercise.repetitions} repetitions.`,
      })
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }
  }, [isCompleted, exercise, addSession, toast])
  
  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true)
      setIsPaused(false)
    } else {
      setIsPaused(!isPaused)
    }
  }
  
  const skipPhase = () => {
    if (phase === 'contract') {
      // Skip to relax phase
      setPhase('relax')
      setTimeLeft(exercise?.relaxTime || 0)
    } else {
      // Skip to next rep
      const nextRep = currentRep + 1
      
      // Check if this was the last rep
      if (nextRep > (exercise?.repetitions || 0)) {
        setIsCompleted(true)
        setShowConfetti(true)
      } else {
        // Move to next rep
        setCurrentRep(nextRep)
        setPhase('contract')
        setTimeLeft(exercise?.contractTime || 0)
      }
    }
  }
  
  const resetExercise = () => {
    setIsActive(false)
    setIsPaused(false)
    setCurrentRep(1) // Start at 1
    setPhase('contract')
    setTimeLeft(exercise?.contractTime || 0)
    setElapsedTime(0)
    setIsCompleted(false)
    startTimeRef.current = null
  }
  
  const getProgressPercentage = () => {
    if (!exercise) return 0
    return (elapsedTime / totalTime) * 100
  }
  
  const getPhaseProgressPercentage = () => {
    if (!exercise) return 0
    const total = phase === 'contract' ? exercise.contractTime : exercise.relaxTime
    return ((total - timeLeft) / total) * 100
  }
  
  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/50"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Timer className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading exercise...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
        />
      )}
      
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{exercise.name}</h1>
      </div>
      
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-800/30 dark:to-transparent" />
        <CardContent className="pt-6 pb-6 relative">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Progress</p>
                <p className="text-lg font-medium">
                  {currentRep} of {exercise.repetitions} reps
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Time</p>
                <p className="text-lg font-medium">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')} / 
                  {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
            
            <div className="relative h-2">
              <Progress value={getProgressPercentage()} className="h-2" />
              <motion.div 
                className="absolute top-0 h-2 w-2 rounded-full bg-white border-2 border-blue-500"
                style={{ left: `${getProgressPercentage()}%` }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <motion.div 
                  key="exercise"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    {/* Static circle that changes size based on phase */}
                    <div className="relative w-48 h-48">
                      <motion.div 
                        className={`absolute inset-0 rounded-full flex items-center justify-center 
                          ${phase === 'contract' 
                            ? 'bg-blue-100 dark:bg-blue-900/50' 
                            : 'bg-purple-100 dark:bg-purple-900/50'}`}
                        animate={{
                          scale: phase === 'contract' ? 0.8 : 1
                        }}
                        initial={{
                          scale: phase === 'contract' ? 1 : 0.8
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={phase === 'contract' ? '#3b82f6' : '#8b5cf6'}
                            strokeWidth="4"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * getPhaseProgressPercentage()) / 100}
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-300 ease-linear"
                          />
                        </svg>
                        
                        {/* Pulsing effect */}
                        <motion.div 
                          className={`absolute inset-0 rounded-full ${
                            phase === 'contract' 
                              ? 'bg-blue-500/20 dark:bg-blue-500/30' 
                              : 'bg-purple-500/20 dark:bg-purple-500/30'
                          }`}
                          animate={{ 
                            scale: phase === 'contract' ? [0.8, 0.9, 0.8] : [1, 1.1, 1],
                            opacity: [0.5, 0.7, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                        
                        <div className="text-center z-10">
                          <h2 className="text-5xl font-bold mb-2">{timeLeft}</h2>
                          <p className={`text-lg font-medium ${ 
                            phase === 'contract' 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-purple-600 dark:text-purple-400'
                          }`}>
                            {phase === 'contract' ? 'CONTRACT' : 'RELAX'}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={resetExercise}
                      className="rounded-full h-12 w-12 border-slate-300 dark:border-slate-600"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                      onClick={toggleTimer}
                      className={`rounded-full h-14 w-14 ${
                        isActive && !isPaused
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {isActive && !isPaused ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={skipPhase}
                      className="rounded-full h-12 w-12 border-slate-300 dark:border-slate-600"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 space-y-6"
                >
                  <motion.div 
                    className="bg-green-100 dark:bg-green-900/50 w-32 h-32 rounded-full flex items-center justify-center relative"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-green-500/20 dark:bg-green-500/30 blur-md"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 z-10" />
                  </motion.div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-1">Great job!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      You've completed {exercise.repetitions} repetitions
                    </p>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={resetExercise}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        Start Again
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/')}
                        className="w-full"
                      >
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-800/30 dark:to-transparent" />
        <CardContent className="pt-6 relative">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exercise Details</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <motion.div 
                className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">Contract</p>
                <p className="text-lg font-medium">{exercise.contractTime}s</p>
              </motion.div>
              
              <motion.div 
                className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">Relax</p>
                <p className="text-lg font-medium">{exercise.relaxTime}s</p>
              </motion.div>
              
              <motion.div 
                className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">Reps</p>
                <p className="text-lg font-medium">{exercise.repetitions}</p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExerciseSession