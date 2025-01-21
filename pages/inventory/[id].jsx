'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  ArrowLeft, Package, Clock, User,
  Edit, Trash2, ShoppingCart, Check, X
} from 'lucide-react'

export default function InventoryItemDetails() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [rollNumber, setRollNumber] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [itemIssues, setItemIssues] = useState([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const storedUserData = localStorage.getItem('userdata')
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    } else {
      router.push('/')
      return
    }

    const fetchItemDetails = async () => {
      // Ensure id is available and valid
      if (!id || id === 'undefined' || id === 'null') {
        setError('Invalid item ID')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`/api/inventory/${id}`)
        if (response.data) {
          setItem(response.data)
        } else {
          setError('Item not found')
        }
      } catch (error) {
        console.error('Error fetching item details:', error)
        setError('Failed to fetch item details')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if id is present
    if (id) {
      fetchItemDetails()
    }
  }, [id, router])

  // Fetch item issues when component mounts
  useEffect(() => {
    const fetchItemIssues = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/inventory/${id}/issues`)
          setItemIssues(response.data)
        } catch (error) {
          console.error('Error fetching item issues:', error)
        }
      }
    }
    fetchItemIssues()
  }, [id])

  const handleIssueItem = async () => {
    try {
      const response = await axios.post(`/api/issues/create`, {
        inventoryId: id,
        rollNumber,
        quantity
      })

      if (response.data) {
        // Refresh the issues list
        const issuesResponse = await axios.get(`/api/inventory/${id}/issues`)
        setItemIssues(issuesResponse.data)

        // Clear form
        setRollNumber('')
        setQuantity(1)

        // Show success message
        alert('Item issued successfully!')
      }
    } catch (error) {
      console.error('Error issuing item:', error)
      alert(error.response?.data?.message || 'Failed to issue item')
    }
  }

  const handleReturn = async (issueId) => {
    try {
      const response = await axios.post('/api/issues/return', { issueId })

      if (response.data) {
        // Refresh item details and issues
        const [itemResponse, issuesResponse] = await Promise.all([
          axios.get(`/api/inventory/${id}`),
          axios.get(`/api/inventory/${id}/issues`)
        ])

        setItem(itemResponse.data)
        setItemIssues(issuesResponse.data)
        alert('Item returned successfully!')
      }
    } catch (error) {
      console.error('Error returning item:', error)
      alert(error.response?.data?.message || 'Failed to return item')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await axios.delete(`/api/inventory/${id}`)
      
      if (response.status === 200) {
        alert('Item deleted successfully!')
        router.push('/inventory')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      const errorMessage = error.response?.data?.message || 'Failed to delete item'
      alert(errorMessage)
    } finally {
      setDeleting(false)
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  // Error State
  if (error || !item) {
    return (
      <div className="text-center py-12 min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">
          {error || 'Item not found'}
        </p>
        <button
          onClick={() => router.push('/inventory')}
          className="btn-primary"
        >
          Back to Inventory
        </button>
      </div>
    )
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

        {/* Admin Actions */}
        <div className="flex gap-3">
          <button
            className="btn-yellow flex items-center"
            onClick={() => router.push(`/inventory/edit/${id}`)}
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button
            className="btn-danger flex items-center gap-2 px-4 py-2"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>Delete Item</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Item Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <img
          src={item.img || '/img/default-item.png'}
          alt={item.title}
          className="max-h-96 object-contain rounded-2xl border border-gray-200 shadow-lg"
          onError={(e) => {
            e.target.src = '/img/default-item.png'
          }}
        />

        {/* Details Section */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {item.title}
            </h1>

            {/* Status Badge */}
            {item.quantity === 0 ? (
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-200">
                Out of Stock
              </span>
            ) : item.quantity === -1 ? (
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm border border-green-200">
                Available
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm border border-blue-200">
                {item.quantity} Available
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            {item.description || 'No description available'}
          </p>

          {/* Item Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                <span className="font-semibold">Quantity</span>
              </div>
              <p className="text-gray-700">
                {item.quantity === -1 ? 'Unlimited' : item.quantity}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2 text-green-500" />
                <span className="font-semibold">Returnable</span>
              </div>
              <p className="text-gray-700">
                {item.returnable ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Issue Form */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Issue Item</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="form-input w-full"
                required
              />
              {item.quantity !== -1 && (
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setQuantity(val > 0 ? val : 1)
                  }}
                  min="1"
                  max={item.quantity}
                  className="form-input w-full"
                />
              )}
              <button
                onClick={handleIssueItem}
                disabled={!rollNumber || item.quantity === 0}
                className="btn-primary w-full"
              >
                Issue Item
              </button>
            </div>
          </div>

          {/* Issues List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Issue History</h3>
            {itemIssues.length === 0 ? (
              <p className="text-gray-500">No issues found for this item</p>
            ) : (
              <div className="space-y-4">
                {itemIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Roll Number: {issue.rollNumber}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {issue.quantity} | Date: {new Date(issue.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-2 py-1 rounded-full text-xs flex items-center gap-1
                        ${issue.returned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      `}>
                        {issue.returned ? (
                          <>
                            <Check className="w-3 h-3" />
                            Returned
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                      {!issue.returned && (
                        <button
                          onClick={() => handleReturn(issue.id)}
                          className="btn-outline text-sm py-1 px-3 hover:bg-green-50"
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
