'use client'

import { useEffect, useState } from 'react'
import { LogOut, Search, User, Package, PlusCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [userData, setUserData] = useState(null) 

  const router = useRouter()

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/inventory/all')
      const data = response.data
      setItems(data)
      setFilteredItems(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  useEffect(() => {
    const storedUserData = localStorage.getItem('userdata');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    }
    fetchInventory();
  }, [])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items)
      return
    }
    
    setFilteredItems(
      items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, items])

  const handleFilter = (filter) => {
    if (filter === 'all') {
      setFilteredItems(items)
    } else if (filter === 'available') {
      setFilteredItems(items.filter(item => item.quantity > 0))
    } else {
      setFilteredItems(items)
    }
  }

  return (
    <div className="container mx-auto p-4">

      <div className="container relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 p-4 bg-white bg-opacity-90 shadow-md rounded-lg border-4 border-blue-300">
          <div className="flex items-center">
            <img
              src="/img/logo.png"
              alt="Doraemon"
              className="h-6 md:h-8 align-top mr-4"
            />
            <h1 className="text-2xl h-full font-bold mt-2 align-bottom text-blue-700">
              Welcome, {userData ? userData.name.split(' ')[0] : 'Guest'}
            </h1>
          </div>


        <div className="flex flex-col sm:flex-row align-middle items-center gap-x-4 gap-y-2">
          {/* Profile Button */}
          <motion.button
            className="bg-yellow-400 text-blue-700 py-2 px-6 rounded-full hover:bg-yellow-500 border-2 border-yellow-600 transition duration-200 flex items-center"
            onClick={() => router.push('/profile')} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="mr-2" />
            Profile
          </motion.button>

          {/* Logout Button */}
          <motion.button
            className="bg-red-400 text-black py-2 px-6 border-2 border-red-800 rounded-full hover:bg-red-500 transition duration-200 flex items-center"
            onClick={() => {
              localStorage.removeItem('userdata');
              router.push('/');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="mr-2" />
            Logout
          </motion.button>
        </div>
        </header>

        {/* ----------------------------------------------------------------------------------------------- */}
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            className="border-4 border-blue-300 p-3 w-full rounded-full shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-12 bg-white bg-opacity-90"
            placeholder="Search for gadgets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <motion.button 
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-200 flex items-center"
            onClick={() => handleFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Package className="mr-2" />
            All Gadgets
          </motion.button>
          <motion.button 
            className="bg-green-500 text-white py-3 px-6 rounded-full hover:bg-green-600 transition duration-200 flex items-center"
            onClick={() => handleFilter('available')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Package className="mr-2" />
            Available Gadgets
          </motion.button>
          <motion.button 
            className="bg-yellow-400 text-white py-3 px-6 rounded-full hover:bg-yellow-500 transition duration-200 flex items-center"
            onClick={() => router.push('/items/add')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="mr-2" />
            Add Gadget
          </motion.button>
        </div>

        {/* ------------------------------------------------------------------------------------- */}
        {/* Inventory List */}
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-12"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredItems.map(item => (
              <motion.div 
                key={item.id} 
                className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300 border-4 border-blue-300 hover:border-blue-500"
                variants={{
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-full h-48 mb-4">
                  <img src={item.img} alt={item.title} layout="fill" objectFit="cover" className="rounded-t-lg" />
                </div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-blue-900 font-semibold mb-4">Available: {item.quantity}</p>
                <motion.button 
                  className="bg-yellow-400 text-blue-700 py-2 px-6 rounded-full hover:bg-yellow-500 transition duration-200 w-full font-bold"
                  onClick={() => router.push(`inventory/${item.id}`)} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Check Out Gadget
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
