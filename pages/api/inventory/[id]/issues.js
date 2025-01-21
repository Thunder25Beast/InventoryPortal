import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method, query } = req

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = query

  try {
    if (!id) {
      return res.status(400).json({ message: 'Item ID is required' })
    }

    // Fetch issues for specific inventory item
    const issues = await prisma.issue.findMany({
      where: { inventoryId: id },
      include: {
        inventory: true
      },
      orderBy: {
        issueDate: 'desc'
      }
    })

    return res.status(200).json(issues)
  } catch (error) {
    console.error('Error fetching item issues:', error)
    return res.status(500).json({
      message: 'Failed to fetch item issues',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 