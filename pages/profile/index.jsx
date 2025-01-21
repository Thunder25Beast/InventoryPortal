// components/Profile.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [issuedItems, setIssuedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchUserData = async (roll) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${roll}`);
      setUser(response.data.user);
      setIssuedItems(response.data.issuedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userdata');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      console.log(parsedData);
      setUser(parsedData);
      fetchUserData(parsedData.roll);
    }
  }, []);

  if (loading) {
    return(
      <div className="container mx-auto flex justify-center items-center h-screen">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white bg-opacity-90 shadow-md rounded-lg border-4 border-blue-300">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/img/logo.png"
            alt="Doraemon"
            className="h-6 md:h-8 align-top mr-4"
          />
        </div>

        {/* Inventory Button */}
        <div className="flex flex-col sm:flex-row align-middle items-center gap-x-4 gap-y-2">
          <motion.button
            className="bg-green-400 text-black py-2 px-6 border-2 border-green-800 rounded-full hover:bg-green-500 transition duration-200 flex items-center"
            onClick={() => router.push('/inventory')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package className="mr-2" />
            Inventory
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
        <h1 className="text-3xl font-bold mb-4">Profile</h1>

        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold pr-4">Name</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td className="font-bold pr-4">Roll No</td>
              <td>{user.rollNumber}</td>
            </tr>
            <tr>
              <td className="font-bold pr-4">Department</td>
              <td>{user.department}</td>
            </tr>
            <tr>
              <td className="font-bold pr-4">Degree</td>
              <td>{user.degree}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Issued Items */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Issued Items</h2>
        {issuedItems.length === 0 ? (
          <p>No items issued.</p>
        ) : (
          <ul className="space-y-4">
            {issuedItems.map((item) => (
              <li key={item.id} className="border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img src={item.Inventory.img} alt={item.Inventory.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-xl font-bold">{item.Inventory.title}</h3>
                    <p>{item.Inventory.description}</p>
                    <p><strong>Issue Date:</strong> {new Date(item.issueDate).toLocaleDateString()}</p>
                    <p><strong>Return Date:</strong> {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'Not returned yet'}</p>
                    <p><strong>Status:</strong> {item.returned ? 'Returned' : 'Not Returned'}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
