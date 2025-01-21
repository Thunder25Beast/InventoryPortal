'use client'

import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

export default function LabInventoryLoginPage() {
  return (
    <div className='min-h-[90vh] flex items-center justify-center'>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-repeat"
          style={{ backgroundImage: 'url("/img/doraemon-pattern-light.png")', backgroundSize: '100px' }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Pocket Circle */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[var(--doraemon-blue)] rounded-full shadow-lg">
          <motion.img
            src="/img/welcome.gif"
            alt="Doraemon"
            className='rounded-full'
          />
        </div>

        {/* Content */}
        <div className="mt-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tech Inventory Portal
          </h1>

          {/* Login Button */}
          <motion.a
            className="group relative overflow-hidden bg-[var(--doraemon-blue)] hover:bg-[var(--doraemon-dark-blue)] text-white px-8 py-3 rounded-xl inline-flex items-center justify-center w-full font-medium transition-colors"
            href="https://sso.tech-iitb.org/project/40e664ff-16a1-4e8e-97c6-a54bfdf8ee11/ssocall"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login with SSO
          </motion.a>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
          </div>
        </div>
      </motion.div>
    </div>
  )
}
