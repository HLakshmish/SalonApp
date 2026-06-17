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
    const res = await prisma.salon.create({
      data: {
        name: 'new look',
        address: 'udupi',
        city: 'udupi',
        state: 'karnataka',
        pincode: '567666',
        phoneNumber: '6567654567',
        description: 'string',
        operatingHours: JSON.parse('{"monday":{"open":"09:00","close":"18:00"},"sunday":{"closed":true}}'),
        ownerId: 1,
        photosUrls: []
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
