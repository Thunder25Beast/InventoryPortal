export const isAdmin = (userData) => {
  // Check if user has admin role from SSO data
  if (!userData) return false

  // You can customize these conditions based on your SSO data structure
  return (
    userData.roles?.includes('admin') ||
    userData.isAdmin === true ||
    userData.department === 'ITC' // Or any other department that should have admin access
  )
}

export function isAdmin(request) {
  // Check if the user has admin status in localStorage
  // For server-side middleware, we'll check cookies instead
  const isAdminCookie = request.cookies.get('isAdmin')?.value
  return isAdminCookie === 'true'
}

export function clearAdminStatus() {
  localStorage.removeItem('isAdmin')
  // Also clear the cookie
  document.cookie = 'isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function setAdminStatus() {
  localStorage.setItem('isAdmin', 'true')
  // Also set a cookie for server-side checks
  document.cookie = 'isAdmin=true; path=/'
} 