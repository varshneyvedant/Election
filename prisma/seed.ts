import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'System Administrator',
      role: 'admin',
    },
  })

  // Ensure an election record exists
  await prisma.election.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      isActive: false,
    },
  })

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
