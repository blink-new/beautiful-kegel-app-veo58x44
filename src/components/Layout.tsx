
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import AnimatedBackground from './AnimatedBackground'
import { motion } from 'framer-motion'

const Layout = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <motion.main 
        className="container mx-auto px-4 py-6 max-w-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default Layout