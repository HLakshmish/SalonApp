async function servicesManagementRoutes(fastify, options) {
  const { prisma } = options;

  // Params schema for salonId
  const salonParamsSchema = {
    type: 'object',
    properties: { salonId: { type: 'number' } }
  };

  // Params schema for service id
  const serviceParamsSchema = {
    type: 'object',
    properties: { id: { type: 'number' } }
  };

  // Add Service
  fastify.post('/api/salons/:salonId/services', {
    schema: {
      description: 'Add a new service to a salon',
      tags: ['Services'],
      params: salonParamsSchema,
      body: {
        type: 'object',
        required: ['service_name', 'duration_minutes', 'price'],
        properties: {
          service_name: { type: 'string' },
          description: { type: 'string' },
          duration_minutes: { type: 'number' },
          price: { type: 'number' },
          status: { type: 'string', default: 'active' }
        }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    const { service_name, description, duration_minutes, price, status } = request.body;

    // Check if salon exists
    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) return reply.status(404).send({ error: 'Salon not found' });

    try {
      const service = await prisma.service.create({
        data: {
          service_name,
          description,
          duration_minutes,
          price,
          status: status || 'active',
          salonId: Number(salonId)
        }
      });
      reply.status(201).send({ message: 'Service added successfully', service });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get Services by Salon
  fastify.get('/api/salons/:salonId/services', {
    schema: {
      description: 'Get all services for a salon',
      tags: ['Services'],
      params: salonParamsSchema
    }
  }, async (request, reply) => {
    const { salonId } = request.params;

    const services = await prisma.service.findMany({
      where: { salonId: Number(salonId) }
    });
    return services;
  });

  // Edit Service
  fastify.put('/api/services/:id', {
    schema: {
      description: 'Edit a service',
      tags: ['Services'],
      params: serviceParamsSchema,
      body: {
        type: 'object',
        properties: {
          service_name: { type: 'string' },
          description: { type: 'string' },
          duration_minutes: { type: 'number' },
          price: { type: 'number' },
          status: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { service_name, description, duration_minutes, price, status } = request.body;

    try {
      const updatedService = await prisma.service.update({
        where: { id: Number(id) },
        data: { service_name, description, duration_minutes, price, status }
      });
      reply.send({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Service not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Toggle/Update Status
  fastify.patch('/api/services/:id/status', {
    schema: {
      description: 'Update service status',
      tags: ['Services'],
      params: serviceParamsSchema,
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['active', 'inactive'] }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { status } = request.body;

    try {
      const updatedService = await prisma.service.update({
        where: { id: Number(id) },
        data: { status }
      });
      reply.send({ message: `Service status updated to ${status}`, service: updatedService });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Service not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Delete Service
  fastify.delete('/api/services/:id', {
    schema: {
      description: 'Delete a service',
      tags: ['Services'],
      params: serviceParamsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      await prisma.service.delete({
        where: { id: Number(id) }
      });
      reply.send({ message: 'Service deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Service not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = servicesManagementRoutes;
