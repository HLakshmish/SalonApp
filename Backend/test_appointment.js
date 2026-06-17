
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const res = await prisma.appointment.create({
      data: {
        startTime: new Date(),
        endTime: new Date(),
        customerName: 'nanu',
        customerGender: 'male',
        customerPhone: '7876567876',
        customerEmail: 'user@example.com',
        customerCity: 'string',
        customerAddress: 'string',
        userId: null,
        salonId: 1,
        seatId: 1,
        services: {
          connect: [{ id: 1 }]
        }
      }
    });
    console.log('SUCCESS', res);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
