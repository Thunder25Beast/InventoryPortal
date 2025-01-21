import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get roll number from query params
    const { roll } = req.query

    if (!roll) {
      return res.status(400).json({ message: 'Roll number is required' })
    }

    // Get all issues for the specific user
    const issues = await prisma.issue.findMany({
      where: {
        rollNumber: roll,
      },
      include: {
        inventory: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
    })

    // Format the response to match the frontend expectations
    const formattedIssues = issues.map(issue => ({
      id: issue.id,
      itemId: issue.inventoryId,
      itemName: issue.inventory.title,
      quantity: issue.quantity,
      issueDate: issue.issueDate,
      returned: issue.returned,
      returnDate: issue.returnDate,
      daysToReturn: issue.daysToReturn,
    }))

    return res.status(200).json(formattedIssues)
  } catch (error) {
    console.error('Error fetching user issues:', error)
    return res.status(500).json({ message: 'Error fetching issues' })
  }
} 