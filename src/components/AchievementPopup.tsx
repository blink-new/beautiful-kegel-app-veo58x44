
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements } from '../context/AchievementsContext'
import AchievementBadge from './AchievementBadge'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

const AchievementPopup = () => {
  const { hasNewAchievement, getLatestUnlocked, clearNewAchievementFlag } = useAchievements()
  const [showPopup, setShowPopup] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  
  useEffect(() => {
    if (hasNewAchievement) {
      setShowPopup(true)
      setShowConfetti(true)
      
      // Hide confetti after 3 seconds
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      
      // Hide popup after 5 seconds
      const popupTimer = setTimeout(() => {
        setShowPopup(false)
        clearNewAchievementFlag()
      }, 5000)
      
      return () => {
        clearTimeout(confettiTimer)
        clearTimeout(popupTimer)
      }
    }
  }, [hasNewAchievement, clearNewAchievementFlag])
  
  const achievement = getLatestUnlocked()
  
  if (!achievement) return null
  
  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
        />
      )}
      
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-72 sm:w-80"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 text-white text-center">
                <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <AchievementBadge achievement={achievement} size="md" showProgress={false} />
                  
                  <div>
                    <h4 className="font-bold text-lg">{achievement.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AchievementPopup