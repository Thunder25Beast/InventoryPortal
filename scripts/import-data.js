const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const csv = require('csv-parse')
const path = require('path')
require('dotenv').config()

const prisma = new PrismaClient()

async function importData() {
  try {
    const csvFilePath = path.join(__dirname, 'db.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

    // Parse CSV data
    const records = await new Promise((resolve, reject) => {
      csv.parse(fileContent, {
        columns: true,
        trim: true,
        skip_empty_lines: true
      }, (err, records) => {
        if (err) reject(err)
        else resolve(records)
      })
    })

    console.log(`Found ${records.length} items to import`)

    for (const record of records) {
      try {
        // Clean up the data
        const title = record['Item Name'].trim()
        let quantity = parseInt(record['Quantity']) || 0
        const available = quantity !== -1

        // If quantity is -1, set it to 0
        if (quantity === -1) {
          quantity = 0
        }

        // First try to find the item
        const existingItem = await prisma.inventory.findUnique({
          where: { title }
        })

        if (existingItem) {
          // Update existing item
          await prisma.inventory.update({
            where: { id: existingItem.id },
            data: {
              quantity,
              available // Add available status
            }
          })
        } else {
          // Create new item
          await prisma.inventory.create({
            data: {
              title,
              quantity,
              available, // Add available status
              description: `${title} - Lab Equipment`,
              img: '/img/default-item.png',
              returnable: true
            }
          })
        }

        console.log(`Imported: ${title} (Quantity: ${quantity}, Available: ${available})`)
      } catch (error) {
        console.error(`Error importing ${record['Item Name']}:`, error)
      }
    }

    console.log('Import completed!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData() 