'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { ArrowLeft, Upload, Plus, Minus } from 'lucide-react'
import { use } from 'matter-js'

export default function AddInventoryItem() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: 1,
    img: '',
    returnable: true,
    available: true
  })

  const userData = JSON.parse(localStorage.getItem('userdata'))
  const isUserAdmin = userData?.isAdmin

  useEffect(() => {
    if (!isUserAdmin) {
      router.push('/inventory')
    }
  }, [isUserAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/inventory/create', formData)
      if (response.data) {
        alert('Item added successfully!')
        router.push('/inventory')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      alert(error.response?.data?.message || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleQuantityChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      quantity: increment ? prev.quantity + 1 : Math.max(0, prev.quantity - 1)
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/inventory')}
          className="btn-outline flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Inventory
        </button>
      </div>

      {/* Add Item Form */}
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter item title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input min-h-[100px]"
                placeholder="Enter item description"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="form-label">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  className="form-input flex-grow"
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setFormData(prev => ({ ...prev, img: '' }))}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="form-label">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-outline p-2"
                  onClick={() => handleQuantityChange(false)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-input text-center"
                  min="0"
                />
                <button
                  type="button"
                  className="btn-outline p-2"
                  onClick={() => handleQuantityChange(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  Set to -1 for unlimited
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="returnable"
                  checked={formData.returnable}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Returnable</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Available</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Add Item
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
