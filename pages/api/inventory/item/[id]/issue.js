import prisma from '../../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query
  const { userId, daysToReturn } = req.body

  try {
    const newIssue = await prisma.issue.create({
      data: {
        userId,
        inventoryId: id,
        daysToReturn: parseInt(daysToReturn),
      },
    })

    // Update inventory quantity
    await prisma.inventory.update({
      where: { id },
      data: {
        quantity: {
          decrement: 1
        }
      }
    })

    res.status(200).json(newIssue)
  } catch (error) {
    console.error('Error issuing item:', error)
    res.status(500).json({ message: 'Error issuing item' })
  }
} 