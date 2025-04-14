
import { useKegel } from '../context/KegelContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Flame, Award, Clock } from 'lucide-react'

const Dashboard = () => {
  const { exercises, streakDays, totalSessions, lastSessionDate } = useKegel()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome to KegelFit</h1>
        <p className="text-slate-600 dark:text-slate-300">Your personal pelvic floor trainer</p>
      </div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-100 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-2">
                  <Flame className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{streakDays}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Day Streak</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-purple-100 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-2">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalSessions}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Sessions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-teal-100 dark:border-teal-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
              Last Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300">{formatDate(lastSessionDate)}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Quick Start</h2>
        
        {exercises.slice(0, 3).map((exercise) => (
          <motion.div key={exercise.id} variants={item}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription>
                  {exercise.repetitions} reps • {exercise.contractTime}s contract • {exercise.relaxTime}s relax
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/exercise?id=${exercise.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        <motion.div variants={item} className="flex justify-center">
          <Link to="/settings">
            <Button variant="outline" className="mt-2">
              View All Exercises
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard