'use client'

import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

export default function LabInventoryLoginPage() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <motion.div 
        className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg border-4 border-blue-300 w-full max-w-md text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="https://image.pngaaa.com/436/4948436-middle.png"
          alt="Doraemon"
          className="w-24 h-24 mx-auto mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Welcome to the Lab Inventory Portal
        </h1>
        <p className="text-blue-600 mb-6">
          Access Doraemon's 4D Pocket of Lab Tools!
        </p>

        <a 
          className="bg-yellow-400 text-blue-700 py-3 px-6 rounded-full hover:bg-yellow-500 transition duration-200 font-bold text-lg flex items-center justify-center w-full"
          href="https://sso.tech-iitb.org/project/40e664ff-16a1-4e8e-97c6-a54bfdf8ee11/ssocall"
        >
          <LogIn className="mr-2" /> 
          Login to Issue Tools
        </a>
      </motion.div>
    </div>
  )
}
