import React, { useEffect, useState } from 'react'
import { FetchUserData } from '../../api/auth'
import { useRouter } from 'next/router'  

function Redirect() {
  const [userdata, setUserdata] = useState(null)
  const router = useRouter()  
  
  const { accessid } = router.query 
  
  useEffect(() => {
    if (!accessid) return;  
    
    const fetchData = async () => {
      try {
        const data = await FetchUserData(accessid)  
        setUserdata(data)
        console.log(data)
        localStorage.setItem('userdata', JSON.stringify(data)) 
        
        router.push('/inventory') 
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    fetchData()
  }, [accessid])  
  
  return (
    <div>Redirecting...</div>
  )
}

export default Redirect
