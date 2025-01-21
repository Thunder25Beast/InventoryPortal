import React from 'react'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-blue-500 relative overflow-hidden">
      {children}
    </div>
  )
}

export default Layout