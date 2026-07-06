import { motion } from 'framer-motion'

const ease = [0.25, 1, 0.5, 1]

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  )
}
