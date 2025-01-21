import { motion } from 'framer-motion'
import { LogOut, User, Package, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { clearAdminStatus } from '@/utils/auth'

export default function Navbar({ userData }) {
  const router = useRouter()

  const handleLogout = () => {
    clearAdminStatus()
    router.push('/')
  }

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/inventory',
      show: true
    },
    {
      label: 'Profile',
      icon: User,
      href: '/profile',
      show: !!userData
    }
  ]

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b-2 border-[#2196f3] shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/inventory" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/img/logo.png"
                alt="Doraemon"
                width={40}
                height={40}
                className=""
              />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-[#2196f3]">
                Inventory Portal
              </h1>
              {userData && (
                <p className="text-sm text-gray-600">
                  Hi, {userData.name.split(' ')[0]}!
                </p>
              )}
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {navItems.map((item, index) => (
              item.show && (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full
                      ${router.pathname === item.href
                        ? 'bg-[#2196f3] text-white'
                        : 'text-gray-600 hover:bg-blue-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              )
            ))}

            {/* Logout Button */}
            {userData && (
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 