async function appointmentRoutes(fastify, options) {
  const { prisma } = options;

  fastify.post('/api/appointments', {
    schema: {
      description: 'Book an appointment for a seat (public)',
      tags: ['Appointments'],
      body: {
        type: 'object',
        required: [
          'salonId', 'seatId', 'serviceIds', 'startTime',
          'customerName', 'customerGender', 'customerPhone', 'customerEmail', 'customerCity', 'customerAddress'
        ],
        properties: {
          salonId: { type: 'number' },
          seatId: { type: 'number' },
          serviceIds: {
            type: 'array',
            items: { type: 'number' },
            minItems: 1
          },
          startTime: { type: 'string', format: 'date-time' },
          customerName: { type: 'string' },
          customerGender: { type: 'string' },
          customerPhone: { type: 'string' },
          customerEmail: { type: 'string', format: 'email' },
          customerCity: { type: 'string' },
          customerAddress: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { 
      salonId, seatId, serviceIds, startTime,
      customerName, customerGender, customerPhone, customerEmail, customerCity, customerAddress
    } = request.body;
    
    // Optional: if the user included a Bearer token and we want to attach the appointment to their account
    let userId = null;
    try {
      if (request.headers.authorization) {
        await request.jwtVerify();
        userId = request.user.id;
      }
    } catch (err) {
      // Ignore if token is invalid, allow guest booking
    }

    const start = new Date(startTime);

    if (isNaN(start.getTime())) {
      return reply.status(400).send({ error: 'Invalid startTime format' });
    }

    try {
      // 1. Validate salon and seat
      const salon = await prisma.salon.findUnique({ where: { id: salonId } });
      if (!salon) return reply.status(404).send({ error: 'Salon not found' });

      const seat = await prisma.seat.findUnique({ where: { id: seatId } });
      if (!seat || seat.salonId !== salonId) {
        return reply.status(404).send({ error: 'Seat not found in this salon' });
      }
      if (!seat.isActive) {
        return reply.status(400).send({ error: 'This seat is currently inactive and cannot be booked' });
      }

      // 2. Fetch services and calculate total duration
      const services = await prisma.service.findMany({
        where: {
          id: { in: serviceIds },
          salonId
        }
      });

      if (services.length !== serviceIds.length) {
        return reply.status(400).send({ error: 'One or more services are invalid or do not belong to this salon' });
      }

      let totalDurationMinutes = 0;
      services.forEach(service => {
        totalDurationMinutes += service.duration_minutes;
      });

      // 3. Calculate endTime
      const end = new Date(start.getTime() + totalDurationMinutes * 60000);

      // 4. Check for overlapping appointments on this seat
      const conflictingAppointments = await prisma.appointment.findMany({
        where: {
          seatId,
          status: 'scheduled',
          AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } }
          ]
        }
      });

      if (conflictingAppointments.length > 0) {
        return reply.status(409).send({ error: 'Seat is already booked for the selected time' });
      }

      // 5. Create the appointment
      const appointment = await prisma.appointment.create({
        data: {
          startTime: start,
          endTime: end,
          customerName,
          customerGender,
          customerPhone,
          customerEmail,
          customerCity,
          customerAddress,
          userId,
          salonId,
          seatId,
          services: {
            connect: serviceIds.map(id => ({ id }))
          }
        },
        include: {
          services: true,
          seat: true
        }
      });

      reply.status(201).send({
        message: 'Appointment booked successfully',
        appointment
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Check seat availability for a specific date
  fastify.get('/api/seats/:seatId/availability', {
    schema: {
      description: 'Get booked time slots for a seat on a specific date',
      tags: ['Appointments'],
      params: {
        type: 'object',
        required: ['seatId'],
        properties: { seatId: { type: 'number' } }
      },
      querystring: {
        type: 'object',
        required: ['date'],
        properties: {
          date: { type: 'string', format: 'date', description: 'YYYY-MM-DD' }
        }
      }
    }
  }, async (request, reply) => {
    const { seatId } = request.params;
    const { date } = request.query;

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    if (isNaN(startOfDay.getTime())) {
      return reply.status(400).send({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          seatId: Number(seatId),
          status: 'scheduled',
          startTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        select: {
          startTime: true,
          endTime: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });

      reply.send({ bookedSlots: appointments });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get ALL seats status for a salon on a specific date
  fastify.get('/api/salons/:salonId/seats-availability', {
    schema: {
      description: 'Get availability status for all seats in a salon for a specific date (public)',
      tags: ['Appointments'],
      params: {
        type: 'object',
        required: ['salonId'],
        properties: { salonId: { type: 'number' } }
      },
      querystring: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', description: 'YYYY-MM-DD (Optional, if omitted returns all scheduled times)' }
        }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    const { date } = request.query;

    let dateFilter = {};
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      
      if (isNaN(startOfDay.getTime())) {
        return reply.status(400).send({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }
      
      dateFilter = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    try {
      // 1. Get all active seats for the salon
      const seats = await prisma.seat.findMany({
        where: { salonId: Number(salonId), isActive: true },
        select: { id: true, name: true, description: true }
      });

      // 2. Get scheduled appointments for the salon (filtered by date if provided)
      const appointments = await prisma.appointment.findMany({
        where: {
          salonId: Number(salonId),
          status: 'scheduled',
          ...(date ? { startTime: dateFilter } : {})
        },
        select: {
          seatId: true,
          startTime: true,
          endTime: true
        }
      });

      // 3. Map appointments to their respective seats
      const seatsWithAvailability = seats.map(seat => {
        const bookedSlots = appointments
          .filter(app => app.seatId === seat.id)
          .map(app => ({
            startTime: app.startTime,
            endTime: app.endTime
          }))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        return {
          ...seat,
          bookedSlots
        };
      });

      reply.send({ seats: seatsWithAvailability });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get user's appointments (public, by email or phone)
  fastify.get('/api/appointments/my-appointments', {
    schema: {
      description: 'Get all appointments by customer email or phone',
      tags: ['Appointments'],
      querystring: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { email, phone } = request.query;

    if (!email && !phone) {
      return reply.status(400).send({ error: 'Please provide either email or phone to search for appointments' });
    }

    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          OR: [
            email ? { customerEmail: email } : undefined,
            phone ? { customerPhone: phone } : undefined
          ].filter(Boolean)
        },
        include: {
          salon: { select: { name: true, address: true, city: true } },
          seat: { select: { name: true } },
          services: { select: { service_name: true, price: true, duration_minutes: true } }
        },
        orderBy: { startTime: 'desc' }
      });
      reply.send(appointments);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = appointmentRoutes;
