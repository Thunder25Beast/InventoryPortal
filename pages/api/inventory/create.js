import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { title, description, quantity, img, returnable, available } = req.body

  try {
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    // Check for duplicate title
    const existingItem = await prisma.inventory.findUnique({
      where: { title }
    })

    if (existingItem) {
      return res.status(400).json({ message: 'Item with this title already exists' })
    }

    // Create new item
    const item = await prisma.inventory.create({
      data: {
        title,
        description: description || '',
        quantity: parseInt(quantity) || 0,
        img: img || '/img/default-item.png',
        returnable: Boolean(returnable),
        available: Boolean(available)
      }
    })

    return res.status(201).json(item)
  } catch (error) {
    console.error('Error creating item:', error)
    return res.status(500).json({
      message: 'Failed to create item',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 