function getTzComponents(date, timeZone = 'Asia/Kolkata') {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const map = new Map(parts.map(p => [p.type, p.value]));
  
  return {
    year: parseInt(map.get('year')),
    month: parseInt(map.get('month')),
    day: parseInt(map.get('day')),
    hour: parseInt(map.get('hour')),
    minute: parseInt(map.get('minute')),
    second: parseInt(map.get('second'))
  };
}

function getTzDayOfWeek(date, timeZone = 'Asia/Kolkata') {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long'
  });
  return formatter.format(date).toLowerCase();
}

function createDateInTz(year, month, day, hour, minute, timeZone = 'Asia/Kolkata') {
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const tzParts = getTzComponents(utcDate, timeZone);
  const diffMs = utcDate.getTime() - Date.UTC(tzParts.year, tzParts.month - 1, tzParts.day, tzParts.hour, tzParts.minute);
  return new Date(utcDate.getTime() + diffMs);
}

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
          'customerName', 'customerGender', 'customerPhone', 'customerCity', 'customerAddress'
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
          customerEmail: {
            anyOf: [
              { type: 'string', format: 'email' },
              { type: 'string', const: '' }
            ]
          },
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

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(customerName)) {
      return reply.status(400).send({ error: 'Customer name must contain characters and spaces only (no numbers or special characters)' });
    }

    const cityRegex = /^[a-zA-Z\s]+$/;
    if (!cityRegex.test(customerCity)) {
      return reply.status(400).send({ error: 'City must contain characters and spaces only (no numbers or special characters)' });
    }
    
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

      // 3.5 Check operating hours
      if (salon.operatingHours) {
        const dayOfWeek = getTzDayOfWeek(start);
        const daySchedule = salon.operatingHours[dayOfWeek];

        if (daySchedule && daySchedule.closed) {
          return reply.status(400).send({ error: 'Salon is closed on this day' });
        }

        if (daySchedule && daySchedule.open && daySchedule.close) {
          const startTz = getTzComponents(start);
          const startTimeString = `${startTz.hour.toString().padStart(2, '0')}:${startTz.minute.toString().padStart(2, '0')}`;

          const endTz = getTzComponents(end);
          const endTimeString = `${endTz.hour.toString().padStart(2, '0')}:${endTz.minute.toString().padStart(2, '0')}`;

          if (startTimeString < daySchedule.open || endTimeString > daySchedule.close) {
             return reply.status(400).send({ error: `Appointment time is outside operating hours (${daySchedule.open} - ${daySchedule.close})` });
          }
        }
      }

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
          customerEmail: customerEmail || '',
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
      reply.status(500).send({ error: 'Internal Server Error', details: error.message, stack: error.stack });
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
      // 1. Fetch seat and its salon to get operating hours
      const seat = await prisma.seat.findUnique({
        where: { id: Number(seatId) },
        include: { salon: { select: { operatingHours: true } } }
      });

      if (!seat) return reply.status(404).send({ error: 'Seat not found' });

      let isClosed = false;
      let operatingHoursForDate = null;

      if (seat.salon.operatingHours) {
        const [year, month, day] = date.split('-').map(Number);
        const dateUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const dayOfWeek = getTzDayOfWeek(dateUtc);
        
        operatingHoursForDate = seat.salon.operatingHours[dayOfWeek];
        if (operatingHoursForDate && operatingHoursForDate.closed) {
          isClosed = true;
        }
      }

      // 2. Fetch scheduled appointments
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

      // 3. Calculate available time slots
      let availableSlots = [];
      
      if (!isClosed) {
        let openTime;
        let closeTime;
        
        if (operatingHoursForDate && operatingHoursForDate.open && operatingHoursForDate.close) {
          const [year, month, day] = date.split('-').map(Number);
          const [openH, openM] = operatingHoursForDate.open.split(':').map(Number);
          const [closeH, closeM] = operatingHoursForDate.close.split(':').map(Number);
          openTime = createDateInTz(year, month, day, openH, openM);
          closeTime = createDateInTz(year, month, day, closeH, closeM);
        } else {
          const [year, month, day] = date.split('-').map(Number);
          openTime = createDateInTz(year, month, day, 0, 0);
          closeTime = createDateInTz(year, month, day, 23, 59);
        }

        let currentTime = openTime;
        for (const app of appointments) {
          const appStart = new Date(app.startTime);
          const appEnd = new Date(app.endTime);
          
          if (currentTime < appStart) {
            availableSlots.push({
              startTime: currentTime,
              endTime: appStart
            });
          }
          if (currentTime < appEnd) {
            currentTime = appEnd;
          }
        }
        
        if (currentTime < closeTime) {
          availableSlots.push({
            startTime: currentTime,
            endTime: closeTime
          });
        }
      }

      reply.send({ 
        isClosed,
        operatingHours: operatingHoursForDate,
        bookedSlots: appointments,
        availableSlots
      });
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
      // 0. Get the salon operating hours
      const salon = await prisma.salon.findUnique({
        where: { id: Number(salonId) },
        select: { operatingHours: true }
      });

      if (!salon) return reply.status(404).send({ error: 'Salon not found' });

      let isClosed = false;
      let operatingHoursForDate = null;

      if (date && salon.operatingHours) {
        const [year, month, day] = date.split('-').map(Number);
        const dateUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const dayOfWeek = getTzDayOfWeek(dateUtc);
        
        operatingHoursForDate = salon.operatingHours[dayOfWeek];
        if (operatingHoursForDate && operatingHoursForDate.closed) {
          isClosed = true;
        }
      }

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

        let availableSlots = [];
        if (date && !isClosed) {
          let openTime;
          let closeTime;
          
          if (operatingHoursForDate && operatingHoursForDate.open && operatingHoursForDate.close) {
            const [year, month, day] = date.split('-').map(Number);
            const [openH, openM] = operatingHoursForDate.open.split(':').map(Number);
            const [closeH, closeM] = operatingHoursForDate.close.split(':').map(Number);
            openTime = createDateInTz(year, month, day, openH, openM);
            closeTime = createDateInTz(year, month, day, closeH, closeM);
          } else {
            const [year, month, day] = date.split('-').map(Number);
            openTime = createDateInTz(year, month, day, 0, 0);
            closeTime = createDateInTz(year, month, day, 23, 59);
          }

          let currentTime = openTime;
          for (const app of bookedSlots) {
            const appStart = new Date(app.startTime);
            const appEnd = new Date(app.endTime);
            
            if (currentTime < appStart) {
              availableSlots.push({ startTime: currentTime, endTime: appStart });
            }
            if (currentTime < appEnd) {
              currentTime = appEnd;
            }
          }
          if (currentTime < closeTime) {
            availableSlots.push({ startTime: currentTime, endTime: closeTime });
          }
        }

        return {
          ...seat,
          bookedSlots,
          availableSlots
        };
      });

      reply.send({ 
        isClosed,
        operatingHours: date ? operatingHoursForDate : salon.operatingHours,
        seats: seatsWithAvailability 
      });
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

  // Get logged-in user's appointments
  fastify.get('/api/appointments/me', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Get all appointments for the logged-in user',
      tags: ['Appointments'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const appointments = await prisma.appointment.findMany({
        where: { userId: request.user.id },
        include: {
          salon: { select: { name: true, address: true, city: true, phoneNumber: true } },
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

  // Get appointments by salonId
  fastify.get('/api/appointments/salon/:salonId', {
    schema: {
      description: 'Get all appointments for a specific salon',
      tags: ['Appointments'],
      params: {
        type: 'object',
        required: ['salonId'],
        properties: { salonId: { type: 'number' } }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    try {
      const appointments = await prisma.appointment.findMany({
        where: { salonId: Number(salonId) },
        include: {
          user: { select: { name: true, email: true, phone: true } },
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

  // Get appointments for all salons owned by the logged-in owner
  fastify.get('/api/appointments/owner/salons', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Get all appointments for salons owned by the logged-in owner',
      tags: ['Appointments'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const ownerId = request.user.id;
      
      // Find all salons owned by this user
      const ownedSalons = await prisma.salon.findMany({
        where: { ownerId: ownerId },
        select: { id: true }
      });
      
      const salonIds = ownedSalons.map(salon => salon.id);
      
      if (salonIds.length === 0) {
        return reply.send([]);
      }

      // Find all appointments for these salons
      const appointments = await prisma.appointment.findMany({
        where: { salonId: { in: salonIds } },
        include: {
          salon: { select: { name: true, address: true, city: true } },
          seat: { select: { name: true } },
          services: { select: { service_name: true, price: true, duration_minutes: true } },
          user: { select: { name: true, email: true, phone: true } }
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
