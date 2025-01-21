const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const items = [
    {
      title: 'Test Item 1',
      description: 'Description for test item 1',
      img: '/img/item1.jpg',
      quantity: 5,
      returnable: true,
    },
    {
      title: 'Test Item 2',
      description: 'Description for test item 2',
      img: '/img/item2.jpg',
      quantity: 3,
      returnable: false,
    },
  ]

  for (const item of items) {
    await prisma.inventory.create({
      data: item,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 