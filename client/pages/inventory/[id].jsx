'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, LogOut, Package } from 'lucide-react';

export default function ItemDetailsPage() {
  const router = useRouter();
  const { id } = router.query;  

  const [item, setItem] = useState(null);
  const [issuedStudents, setIssuedStudents] = useState([]);
  const [newIssue, setNewIssue] = useState({
    userId: '',
    daysToReturn: '',
  });

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/inventory/item/${id}`);
      setItem(response.data.item);
      setIssuedStudents(response.data.issuedStudents);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/inventory/item/${id}/issue`, newIssue);
      alert('Item successfully issued!');
      setNewIssue({ userId: '', daysToReturn: '' }); 
      fetchItemDetails(); 
    } catch (error) {
      console.error('Error issuing item:', error);
      alert('Failed to issue item.');
    }
  };

  if (!item) {
    return <div>Loading item details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
        <header className="flex justify-between items-center mb-6 p-4 bg-white bg-opacity-90 shadow-md rounded-lg border-4 border-blue-300">
          <div className="flex items-center">
            <img
              src="/img/logo.png"
              alt="Doraemon"
              className="h-6 md:h-8 align-top mr-4"
            />
          </div>


        <div className="flex flex-col sm:flex-row align-middle items-center gap-x-4 gap-y-2">
          {/* Inventory Button */}
          <motion.button
            className="bg-green-400 text-black py-2 px-6 border-2 border-green-800 rounded-full hover:bg-green-500 transition duration-200 flex items-center"
            onClick={() => router.push('/inventory')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package className="mr-2" />
            Inventory
          </motion.button>

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
      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
        <img src={item.img} alt={item.title} className="w-64 h-64 object-cover rounded-lg mb-4" />
        <p className="text-lg">{item.description}</p>
        <p className="mt-4 text-blue-700 font-semibold">
          Have to Return: {item.returnable ? 'Yes' : 'No'}
        </p>
        <p className="text-blue-700 font-semibold">
          Quantity Available: {item.quantity}
        </p>
      </div>

      {/* Issued Students List */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Students Who Issued This Item</h2>
        {issuedStudents.length === 0 ? (
          <p>No students have issued this item yet.</p>
        ) : (
          <ul className="space-y-4">
            {issuedStudents.map((issued) => (
              <li key={issued.id} className="border-b pb-4">
                <p><strong>Name:</strong> {issued.User.name}</p>
                <p><strong>Roll Number:</strong> {issued.User.rollNumber}</p>
                <p><strong>Department:</strong> {issued.User.department}</p>
                <p><strong>Degree:</strong> {issued.User.degree}</p>
                <p><strong>Issue Date:</strong> {new Date(issued.issueDate).toLocaleDateString()}</p>
                <p><strong>Days to Return:</strong> {issued.daysToReturn}</p>
                <p><strong>Status:</strong> {issued.returned ? 'Returned' : 'Not Returned'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form to Issue Item */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Issue This Item</h2>
        <form onSubmit={handleIssueSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Student Roll Number
            </label>
            <input
              type="text"
              className="border-2 border-gray-300 p-2 w-full rounded-lg"
              value={newIssue.userId}
              onChange={(e) => setNewIssue({ ...newIssue, userId: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Days to Return
            </label>
            <input
              type="number"
              className="border-2 border-gray-300 p-2 w-full rounded-lg"
              value={newIssue.daysToReturn}
              onChange={(e) => setNewIssue({ ...newIssue, daysToReturn: e.target.value })}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Issue Item
          </motion.button>
        </form>
      </div>
    </div>
  );
}
