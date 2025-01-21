import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const items = await prisma.inventory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    res.status(200).json(items)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    res.status(500).json({ 
      message: 'Error fetching inventory',
      error: error.message 
    })
  }
} 