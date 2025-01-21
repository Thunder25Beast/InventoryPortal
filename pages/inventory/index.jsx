'use client'

import { useEffect, useState } from 'react'
import { LogOut, Search, User, Package, PlusCircle, Filter } from 'lucide-react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [userData, setUserData] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const storedUserData = localStorage.getItem('userdata')
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    } else {
      router.push('/')
    }
    fetchInventory()
  }, [router])

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/inventory/all')
      setItems(response.data)
      setFilteredItems(response.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  useEffect(() => {
    let filtered = items
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterType === 'available') {
      filtered = filtered.filter(item => item.quantity === -1 || item.quantity > 0)
    } else if (filterType === 'unavailable') {
      filtered = filtered.filter(item => item.quantity === 0)
    }
    setFilteredItems(filtered)
  }, [searchQuery, items, filterType])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tech Inventory Portal
            </h1>
            <p className="text-gray-500">
              Welcome, {userData?.name?.split(' ')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn-yellow hover:scale-[1.02] active:scale-[0.98] transition-transform"
            onClick={() => router.push('/inventory/add')}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Item
          </button>

          <button
            className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-transform"
            onClick={() => router.push('/profile')}
          >
            <User className="w-5 h-5 mr-2" />
            Profile
          </button>

          <button
            className="btn-danger hover:scale-[1.02] active:scale-[0.98] transition-transform"
            onClick={() => {
              localStorage.removeItem('userdata')
              router.push('/')
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex justify-center items-center w-full gap-2">
            <Search className="w-5 h-5" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              className={`btn-outline ${filterType === 'all' ? 'bg-blue-50' : ''}`}
              onClick={() => setFilterType('all')}
            >
              <Filter className="w-4 h-4 mr-2" />
              All
            </button>
            <button
              className={`btn-outline ${filterType === 'available' ? 'bg-blue-50' : ''}`}
              onClick={() => setFilterType('available')}
            >
              <Package className="w-4 h-4 mr-2" />
              Available
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 
                         overflow-hidden shadow-md hover:shadow-xl 
                         transition-all duration-300 
                         hover:-translate-y-1 
                         hover:border-blue-100"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-50 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={item.img || '/img/default-item.png'}
                  alt={item.title}
                  className="w-full h-full object-contain p-4 
                             transition-transform duration-300 
                             group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/img/default-item.png'
                  }}
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {item.quantity === 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 
                                     rounded-full text-xs font-medium 
                                     bg-red-50 text-red-600 
                                     border border-red-200">
                      Out of Stock
                    </span>
                  ) : item.quantity === -1 ? (
                    <span className="inline-flex items-center px-2.5 py-1 
                                     rounded-full text-xs font-medium 
                                     bg-green-50 text-green-600 
                                     border border-green-200">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 
                                     rounded-full text-xs font-medium 
                                     bg-blue-50 text-blue-600 
                                     border border-blue-200">
                      {item.quantity} Available
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 
                               group-hover:text-blue-700 
                               transition-colors duration-300 
                               truncate mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 
                              line-clamp-2 min-h-[2.5rem] 
                              group-hover:text-gray-700 
                              transition-colors duration-300">
                  {item.description || 'No description available'}
                </p>

                {/* Action Button */}
                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/inventory/${item.id}`)}
                    className="w-full inline-flex justify-center items-center 
                               px-4 py-2.5 text-sm font-medium 
                               rounded-lg text-white 
                               bg-blue-600 hover:bg-blue-700 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 
                               focus:ring-blue-500 
                               transition-all duration-300
                               group-hover:shadow-md
                               hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
