import prisma from '../../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const item = await prisma.inventory.findUnique({
        where: { id },
      })

      const issuedStudents = await prisma.issue.findMany({
        where: { inventoryId: id },
        include: {
          user: true,
        },
      })

      res.status(200).json({ item, issuedStudents })
    } catch (error) {
      console.error('Error fetching item details:', error)
      res.status(500).json({ message: 'Error fetching item details' })
    }
  }
} 