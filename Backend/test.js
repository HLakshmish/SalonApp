const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.appointment.create({
  data: {
    startTime: new Date(),
    endTime: new Date(),
    customerName: 'test',
    customerGender: 'test',
    customerPhone: 'test',
    customerEmail: 'test',
    customerCity: 'test',
    customerAddress: 'test',
    userId: null,
    salonId: 1,
    seatId: 1,
    services: {
      connect: [{id: 1}]
    }
  }
}).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
