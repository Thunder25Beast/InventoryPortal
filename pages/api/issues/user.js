import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Fetch all issues with inventory details
    const issues = await prisma.issue.findMany({
      include: {
        inventory: true
      },
      orderBy: {
        issueDate: 'desc'
      }
    })

    return res.status(200).json(issues)
  } catch (error) {
    console.error('Error fetching user issues:', error)
    return res.status(500).json({
      message: 'Failed to fetch issues',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 