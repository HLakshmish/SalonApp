async function websiteDetailsRoutes(fastify, options) {
  const { prisma } = options;

  const websiteDetailsSchema = {
    type: 'object',
    properties: {
      websiteName: { type: 'string' },
      about: { type: 'string' },
      address: { type: 'string' },
      phoneNumber: { type: 'string' },
      email: { type: 'string' },
      websiteLink: { type: 'string' },
      instaLink: { type: 'string' },
      facebookLink: { type: 'string' }
    },
    required: ['websiteName']
  };

  // Create or Update (Upsert) Website Details
  fastify.post('/api/admin/website-details', {
    preValidation: [fastify.authorizeAdmin],
    schema: {
      description: 'Create or update website details (Admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      body: websiteDetailsSchema
    }
  }, async (request, reply) => {
    try {
      const data = request.body;
      
      // Assume there is only one settings record
      const existing = await prisma.websiteDetails.findFirst();
      
      let result;
      if (existing) {
        result = await prisma.websiteDetails.update({
          where: { id: existing.id },
          data
        });
      } else {
        result = await prisma.websiteDetails.create({
          data
        });
      }
      
      reply.status(200).send({ message: 'Website details saved successfully', data: result });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get Website Details (Public)
  fastify.get('/api/website-details', {
    schema: {
      description: 'Get website details (Public)',
      tags: ['Public']
    }
  }, async (request, reply) => {
    try {
      const details = await prisma.websiteDetails.findFirst();
      if (!details) {
        return reply.send({});
      }
      return details;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = websiteDetailsRoutes;
