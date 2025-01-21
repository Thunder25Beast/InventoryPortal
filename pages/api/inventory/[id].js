import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method, query } = req
  const { id } = query

  try {
    switch (method) {
      case 'GET':
        // Validate ID
        if (!id) {
          return res.status(400).json({ message: 'Item ID is required' })
        }

        // Fetch item with detailed information
        const itemDetails = await prisma.inventory.findUnique({
          where: { id }
        })

        // Check if item exists
        if (!itemDetails) {
          return res.status(404).json({ message: 'Item not found' })
        }

        return res.status(200).json(itemDetails)

      case 'PUT':
        const { title, description, quantity, img, returnable, available } = req.body

        // Validate required fields
        if (!title) {
          return res.status(400).json({ message: 'Title is required' })
        }

        // Check for duplicate title (excluding current item)
        const existingItem = await prisma.inventory.findFirst({
          where: {
            title,
            NOT: { id }
          }
        })

        if (existingItem) {
          return res.status(400).json({ message: 'Item with this title already exists' })
        }

        // Update item
        const updatedItem = await prisma.inventory.update({
          where: { id },
          data: {
            title,
            description: description || '',
            quantity: parseInt(quantity) || 0,
            img: img || '/img/default-item.png',
            returnable: Boolean(returnable),
            available: Boolean(available)
          }
        })

        return res.status(200).json(updatedItem)

      case 'DELETE':
        // Validate ID
        if (!id) {
          return res.status(400).json({ message: 'Item ID is required' })
        }

        // Check if item exists
        const itemToDelete = await prisma.inventory.findUnique({
          where: { id }
        })

        if (!itemToDelete) {
          return res.status(404).json({ message: 'Item not found' })
        }

        // Check for active issues
        const activeIssues = await prisma.issue.findFirst({
          where: {
            inventoryId: id,
            returned: false
          }
        })

        if (activeIssues) {
          return res.status(400).json({
            message: 'Cannot delete item with active issues. Please ensure all items are returned first.'
          })
        }

        // Delete all related issues first
        await prisma.$transaction([
          // Delete all issues
          prisma.issue.deleteMany({
            where: { inventoryId: id }
          }),
          // Delete the inventory item
          prisma.inventory.delete({
            where: { id }
          })
        ])

        return res.status(200).json({ message: 'Item deleted successfully' })

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ message: `Method ${method} Not Allowed` })
    }
  } catch (error) {
    console.error('Error in inventory API:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 