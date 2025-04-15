
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Trophy, Zap, Target, Heart, Star, Medal } from 'lucide-react'
import { Card } from './ui/card'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: 'award' | 'trophy' | 'zap' | 'target' | 'heart' | 'star' | 'medal'
  color: string
  unlocked: boolean
  progress?: number
  goal?: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  onClick?: () => void
}

const AchievementBadge = ({ 
  achievement, 
  size = 'md', 
  showProgress = true,
  onClick
}: AchievementBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const getIcon = () => {
    switch (achievement.icon) {
      case 'award': return <Award className="h-full w-full" />
      case 'trophy': return <Trophy className="h-full w-full" />
      case 'zap': return <Zap className="h-full w-full" />
      case 'target': return <Target className="h-full w-full" />
      case 'heart': return <Heart className="h-full w-full" />
      case 'star': return <Star className="h-full w-full" />
      case 'medal': return <Medal className="h-full w-full" />
      default: return <Award className="h-full w-full" />
    }
  }
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-12 w-12'
      case 'lg': return 'h-20 w-20'
      default: return 'h-16 w-16'
    }
  }
  
  const getProgressPercentage = () => {
    if (!achievement.progress || !achievement.goal) return 0
    return Math.min(100, (achievement.progress / achievement.goal) * 100)
  }
  
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`relative ${getSizeClasses()}`}>
        {/* Background circle with progress */}
        {showProgress && achievement.progress !== undefined && achievement.goal !== undefined && !achievement.unlocked && (
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              className="dark:stroke-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={achievement.color}
              strokeWidth="4"
              strokeDasharray="302"
              strokeDashoffset={302 - (302 * getProgressPercentage()) / 100}
              transform="rotate(-90 50 50)"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
        )}
        
        {/* Icon container */}
        <div 
          className={`absolute inset-0 rounded-full flex items-center justify-center ${
            achievement.unlocked 
              ? `bg-${achievement.color}-100 dark:bg-${achievement.color}-900/30` 
              : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <div className={`${
            achievement.unlocked 
              ? `text-${achievement.color}-500 dark:text-${achievement.color}-400` 
              : 'text-slate-400 dark:text-slate-600'
          } ${size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'}`}>
            {getIcon()}
          </div>
        </div>
        
        {/* Glow effect for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div 
            className={`absolute inset-0 rounded-full bg-${achievement.color}-500/20 dark:bg-${achievement.color}-500/30 blur-md -z-10`}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
        
        {/* Sparkle effect for unlocked achievements */}
        {achievement.unlocked && (
          <div className="absolute -top-1 -right-1">
            <motion.div
              className={`h-4 w-4 text-${achievement.color}-500`}
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182c.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506c-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452c-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116.001-1.46c-.107-.345-.345-.624-.822-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882c.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45c.28-.213.46-.536.82-1.182l.328-.588Z" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-2 text-center shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <h4 className="font-medium text-sm">{achievement.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
              
              {!achievement.unlocked && achievement.progress !== undefined && achievement.goal !== undefined && (
                <p className="text-xs mt-1 font-medium">
                  Progress: {achievement.progress}/{achievement.goal}
                </p>
              )}
            </Card>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white dark:border-t-slate-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AchievementBadge