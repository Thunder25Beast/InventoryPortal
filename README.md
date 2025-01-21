# Inventory Management System

A modern inventory management system built with Next.js, Prisma, and PostgreSQL. This application helps track and manage inventory items, user checkouts, and returns.

## Features

- User Management

  - Create and manage user profiles with name, roll number, department, and degree
  - Track user borrowing history
  - Unique roll number validation

- Inventory Management

  - Add, edit, and remove inventory items
  - Track item quantities
  - Image upload support
  - Returnable/non-returnable item designation

- Issue Management
  - Check out items to users
  - Set return deadlines
  - Track item returns
  - Automatic quantity updates on checkout/return

## Tech Stack

- **Frontend**: Next.js 15.0, React 19
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI Components**:
  - Framer Motion for animations
  - Lucide React for icons
  - Matter.js for physics animations
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:

```env
# Create a .env file and add:
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

### User

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  rollNumber  String   @unique
  department  String
  degree      String
  issues      Issue[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Inventory

```prisma
model Inventory {
  id          String   @id @default(uuid())
  title       String
  description String
  img         String
  quantity    Int
  returnable  Boolean  @default(true)
  issues      Issue[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Issue

```prisma
model Issue {
  id           String    @id @default(uuid())
  user         User      @relation(fields: [userId], references: [id])
  userId       String
  inventory    Inventory @relation(fields: [inventoryId], references: [id])
  inventoryId  String
  issueDate    DateTime  @default(now())
  daysToReturn Int
  returned     Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

## API Routes

- `/api/inventory` - Inventory CRUD operations
- `/api/users` - User management
- `/api/inventory/item/[id]/issue` - Item checkout endpoint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
