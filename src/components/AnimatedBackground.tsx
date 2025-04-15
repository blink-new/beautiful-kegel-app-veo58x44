
import { motion } from 'framer-motion'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950" />
      
      {/* Animated circles */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/20 dark:bg-blue-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-teal-200/20 dark:bg-teal-500/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Added new animated elements */}
      <motion.div 
        className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full bg-pink-200/20 dark:bg-pink-500/10 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -15, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute top-2/3 right-1/4 w-48 h-48 rounded-full bg-amber-200/20 dark:bg-amber-500/10 blur-3xl"
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 25, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Subtle floating particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white dark:bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default AnimatedBackground