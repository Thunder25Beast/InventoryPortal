import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { issueId } = req.body

  try {
    // Fetch issue with inventory
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { inventory: true }
    })

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    if (issue.returned) {
      return res.status(400).json({ message: 'Item already returned' })
    }

    // Update issue status
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { returned: true }
    })

    // Update inventory quantity if not unlimited
    if (issue.inventory.quantity !== -1) {
      await prisma.inventory.update({
        where: { id: issue.inventoryId },
        data: {
          quantity: issue.inventory.quantity + issue.quantity,
          available: true
        }
      })
    }

    return res.status(200).json(updatedIssue)
  } catch (error) {
    console.error('Error returning issue:', error)
    return res.status(500).json({
      message: 'Failed to return item',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 