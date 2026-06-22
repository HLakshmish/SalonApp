async function seatsManagementRoutes(fastify, options) {
  const { prisma } = options;

  // Params schema for salonId
  const salonParamsSchema = {
    type: 'object',
    properties: { salonId: { type: 'number' } }
  };

  // Params schema for seat id
  const seatParamsSchema = {
    type: 'object',
    properties: { id: { type: 'number' } }
  };

  // Add Seat
  fastify.post('/api/salons/:salonId/seats', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Add a new seat to a salon',
      tags: ['Seats'],
      security: [{ bearerAuth: [] }],
      params: salonParamsSchema,
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    const { name, description, isActive } = request.body;

    // Check if salon exists and belongs to user
    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) return reply.status(404).send({ error: 'Salon not found' });
    if (salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to add seats to this salon' });

    try {
      const seat = await prisma.seat.create({
        data: {
          name,
          description,
          isActive: isActive !== undefined ? isActive : true,
          salonId: Number(salonId)
        }
      });
      reply.status(201).send({ message: 'Seat added successfully', seat });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get Seats by Salon
  fastify.get('/api/salons/:salonId/seats', {
    schema: {
      description: 'Get all seats for a salon (public)',
      tags: ['Seats'],
      params: salonParamsSchema
    }
  }, async (request, reply) => {
    const { salonId } = request.params;

    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) return reply.status(404).send({ error: 'Salon not found' });

    const seats = await prisma.seat.findMany({
      where: { salonId: Number(salonId) }
    });
    return seats;
  });

  // Edit Seat
  fastify.put('/api/seats/:id', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Edit a seat',
      tags: ['Seats'],
      security: [{ bearerAuth: [] }],
      params: seatParamsSchema,
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, description, isActive } = request.body;

    try {
      const existingSeat = await prisma.seat.findUnique({ where: { id: Number(id) }, include: { salon: true } });
      if (!existingSeat) return reply.status(404).send({ error: 'Seat not found' });
      if (existingSeat.salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to modify this seat' });
      const updatedSeat = await prisma.seat.update({
        where: { id: Number(id) },
        data: { name, description, isActive }
      });
      reply.send({ message: 'Seat updated successfully', seat: updatedSeat });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Seat not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Disable/Enable Seat
  fastify.patch('/api/seats/:id/toggle-status', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Toggle seat active status (Disable/Enable)',
      tags: ['Seats'],
      security: [{ bearerAuth: [] }],
      params: seatParamsSchema,
      body: {
        type: 'object',
        required: ['isActive'],
        properties: {
          isActive: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { isActive } = request.body;

    try {
      const existingSeat = await prisma.seat.findUnique({ where: { id: Number(id) }, include: { salon: true } });
      if (!existingSeat) return reply.status(404).send({ error: 'Seat not found' });
      if (existingSeat.salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to modify this seat' });
      const updatedSeat = await prisma.seat.update({
        where: { id: Number(id) },
        data: { isActive }
      });
      reply.send({ message: `Seat ${isActive ? 'enabled' : 'disabled'} successfully`, seat: updatedSeat });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Seat not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Delete Seat
  fastify.delete('/api/seats/:id', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Delete a seat',
      tags: ['Seats'],
      security: [{ bearerAuth: [] }],
      params: seatParamsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const existingSeat = await prisma.seat.findUnique({ where: { id: Number(id) }, include: { salon: true } });
      if (!existingSeat) return reply.status(404).send({ error: 'Seat not found' });
      if (existingSeat.salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to delete this seat' });
      await prisma.seat.delete({
        where: { id: Number(id) }
      });
      reply.send({ message: 'Seat deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Seat not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = seatsManagementRoutes;
