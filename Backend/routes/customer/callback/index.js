async function callbackRoutes(fastify, options) {
  const { prisma } = options;

  // POST /api/callbacks - Create a callback request
  fastify.post('/api/callbacks', {
    schema: {
      description: 'Create a callback request',
      tags: ['Callback'],
      body: {
        type: 'object',
        required: ['name', 'phoneNumber', 'email', 'services', 'purpose', 'dateTime'],
        properties: {
          name: { type: 'string' },
          phoneNumber: { type: 'string' },
          email: { type: 'string', format: 'email' },
          services: { type: 'string' },
          purpose: { type: 'string' },
          dateTime: { type: 'string', format: 'date-time' },
          message: { type: 'string' },
          status: { type: 'string', default: 'pending' },
          salonId: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const { name, phoneNumber, email, services, purpose, dateTime, message, salonId, status } = request.body;

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return reply.status(400).send({ error: 'Name must contain characters and spaces only (no numbers or special characters)' });
    }

    try {
      const callbackRequest = await prisma.callbackRequest.create({
        data: {
          name,
          phoneNumber,
          email,
          services,
          purpose,
          dateTime: new Date(dateTime),
          message,
          status: status || 'pending',
          salonId: salonId || null
        }
      });
      reply.status(201).send({ message: 'Callback request created successfully', callbackRequest });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET /api/salons/:salonId/callbacks - Get callbacks for a salon (Owner)
  fastify.get('/api/salons/:salonId/callbacks', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Get callback requests for a salon',
      tags: ['Callback'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { salonId: { type: 'number' } }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    
    try {
      const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
      if (!salon) return reply.status(404).send({ error: 'Salon not found' });
      if (salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized' });

      const callbacks = await prisma.callbackRequest.findMany({
        where: { salonId: Number(salonId) },
        orderBy: { createdAt: 'desc' }
      });
      return callbacks;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // PATCH /api/callbacks/:id/status - Update status of a callback
  fastify.patch('/api/callbacks/:id/status', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Update callback request status',
      tags: ['Callback'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'number' } }
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'completed'] }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;

    try {
      const existingCallback = await prisma.callbackRequest.findUnique({ where: { id: Number(id) }, include: { salon: true } });
      if (!existingCallback) return reply.status(404).send({ error: 'Callback request not found' });
      if (existingCallback.salon && existingCallback.salon.ownerId !== request.user.id) {
         return reply.status(403).send({ error: 'Unauthorized' });
      }

      const updatedCallback = await prisma.callbackRequest.update({
        where: { id: Number(id) },
        data: { status }
      });
      reply.send({ message: 'Status updated successfully', callbackRequest: updatedCallback });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE /api/callbacks/:id - Delete a callback
  fastify.delete('/api/callbacks/:id', {
    preValidation: [fastify.authorizeSalonOwner],
    schema: {
      description: 'Delete a callback request',
      tags: ['Callback'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'number' } }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const existingCallback = await prisma.callbackRequest.findUnique({ where: { id: Number(id) }, include: { salon: true } });
      if (!existingCallback) return reply.status(404).send({ error: 'Callback request not found' });
      if (existingCallback.salon && existingCallback.salon.ownerId !== request.user.id) {
         return reply.status(403).send({ error: 'Unauthorized' });
      }

      await prisma.callbackRequest.delete({
        where: { id: Number(id) }
      });
      reply.send({ message: 'Callback request deleted successfully' });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = callbackRoutes;
