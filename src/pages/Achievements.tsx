
import { useState } from 'react'
import { useAchievements } from '../context/AchievementsContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { Trophy, Lock, Award } from 'lucide-react'
import AchievementBadge from '../components/AchievementBadge'

const Achievements = () => {
  const { achievements, getUnlockedCount } = useAchievements()
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)
  
  const unlockedCount = getUnlockedCount()
  const totalCount = achievements.length
  const unlockedPercentage = Math.round((unlockedCount / totalCount) * 100)
  
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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Achievements</h1>
        <p className="text-slate-600 dark:text-slate-300">Track your progress and earn rewards</p>
      </div>
      
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/20 dark:to-transparent" />
        <CardContent className="pt-6 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative h-16 w-16 mr-4">
                <Trophy className="h-16 w-16 text-amber-500" />
                <motion.div 
                  className="absolute inset-0 rounded-full bg-amber-500/20 blur-md -z-10"
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
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{unlockedCount} / {totalCount}</h2>
                <p className="text-slate-600 dark:text-slate-300">Achievements Unlocked</p>
              </div>
            </div>
            
            <div className="w-full sm:w-48 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${unlockedPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            All
          </TabsTrigger>
          <TabsTrigger value="unlocked" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Unlocked
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {achievements.map((achievement) => (
              <motion.div 
                key={achievement.id} 
                variants={item}
                className="flex flex-col items-center"
                onClick={() => setSelectedAchievement(achievement.id === selectedAchievement ? null : achievement.id)}
              >
                <AchievementBadge achievement={achievement} />
                
                {selectedAchievement === achievement.id && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
                    
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.goal !== undefined && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 dark:bg-blue-600"
                            style={{ width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 font-medium">
                          {achievement.progress}/{achievement.goal}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="unlocked">
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {achievements.filter(a => a.unlocked).map((achievement) => (
              <motion.div 
                key={achievement.id} 
                variants={item}
                className="flex flex-col items-center"
                onClick={() => setSelectedAchievement(achievement.id === selectedAchievement ? null : achievement.id)}
              >
                <AchievementBadge achievement={achievement} />
                
                {selectedAchievement === achievement.id && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {achievements.filter(a => a.unlocked).length === 0 && (
              <div className="col-span-full text-center py-8">
                <Lock className="h-12 w-12 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400">No achievements unlocked yet. Keep exercising!</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="locked">
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {achievements.filter(a => !a.unlocked).map((achievement) => (
              <motion.div 
                key={achievement.id} 
                variants={item}
                className="flex flex-col items-center"
                onClick={() => setSelectedAchievement(achievement.id === selectedAchievement ? null : achievement.id)}
              >
                <AchievementBadge achievement={achievement} />
                
                {selectedAchievement === achievement.id && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
                    
                    {achievement.progress !== undefined && achievement.goal !== undefined && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 dark:bg-blue-600"
                            style={{ width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 font-medium">
                          {achievement.progress}/{achievement.goal}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {achievements.filter(a => !a.unlocked).length === 0 && (
              <div className="col-span-full text-center py-8">
                <Trophy className="h-12 w-12 mx-auto mb-2 text-amber-500" />
                <p className="text-slate-500 dark:text-slate-400">Congratulations! You've unlocked all achievements!</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Achievements