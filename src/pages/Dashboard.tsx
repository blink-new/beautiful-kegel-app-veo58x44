
import { useKegel } from '../context/KegelContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Flame, Award, Clock, Dumbbell } from 'lucide-react'

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
      <motion.div 
        className="flex flex-col space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome to KegelFit</h1>
        <p className="text-slate-600 dark:text-slate-300">Your personal pelvic floor trainer</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-100 dark:border-blue-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent dark:from-blue-900/20 dark:to-transparent" />
            <CardContent className="pt-6 relative">
              <div className="flex flex-col items-center justify-center">
                <motion.div 
                  className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Flame className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {streakDays}
                </motion.h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Day Streak</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-purple-100 dark:border-purple-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/20 dark:to-transparent" />
            <CardContent className="pt-6 relative">
              <div className="flex flex-col items-center justify-center">
                <motion.div 
                  className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-purple-600 dark:text-purple-400"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {totalSessions}
                </motion.h3>
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
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-teal-100 dark:border-teal-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-transparent dark:from-teal-900/20 dark:to-transparent" />
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
              Last Session
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
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
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
          <Dumbbell className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Quick Start
        </h2>
        
        {exercises.slice(0, 3).map((exercise, index) => (
          <motion.div 
            key={exercise.id} 
            variants={item}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-800/30 dark:to-transparent" />
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription>
                  {exercise.repetitions} reps • {exercise.contractTime}s contract • {exercise.relaxTime}s relax
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Link to={`/exercise?id=${exercise.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]">
                    <Clock className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        <motion.div 
          variants={item} 
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/settings">
            <Button variant="outline" className="mt-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              View All Exercises
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard