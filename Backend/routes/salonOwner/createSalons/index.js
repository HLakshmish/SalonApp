const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

async function salonOwnerRoutes(fastify, options) {
  const { prisma } = options;

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Schema for GET, PUT, DELETE
  const paramsSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' }
    }
  };

  fastify.post('/api/salons', {
    preValidation: [fastify.authenticate],
    validatorCompiler: () => () => true, // Bypass strict schema validation for multipart
    schema: {
      description: 'Create a new salon',
      tags: ['Salon'],
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          pincode: { type: 'string' },
          phoneNumber: { type: 'string' },
          description: { type: 'string' },
          operatingHours: { type: 'string', description: 'JSON string of operating hours' },
          logo: { type: 'string', format: 'binary' },
          banner: { type: 'string', format: 'binary' },
          photos: {
            type: 'array',
            items: { type: 'string', format: 'binary' }
          }
        },
        required: ['name', 'address', 'city', 'state', 'pincode', 'phoneNumber']
      }
    }
  }, async (request, reply) => {
    try {
      const parts = request.parts();
      let salonData = {};
      let photosUrls = [];

      for await (const part of parts) {
        if (part.file) {
          const filename = `${Date.now()}-${part.filename}`;
          const filepath = path.join(uploadsDir, filename);
          await pump(part.file, fs.createWriteStream(filepath));
          
          const fileUrl = `/uploads/${filename}`;
          if (part.fieldname === 'logo') {
            salonData.logoUrl = fileUrl;
          } else if (part.fieldname === 'banner') {
            salonData.bannerUrl = fileUrl;
          } else if (part.fieldname === 'photos') {
            photosUrls.push(fileUrl);
          }
        } else {
          if (!['logo', 'banner', 'photos'].includes(part.fieldname)) {
            if (part.fieldname === 'operatingHours') {
              try {
                salonData[part.fieldname] = JSON.parse(part.value);
              } catch (e) {
                return reply.status(400).send({ error: 'Invalid JSON for operatingHours' });
              }
            } else {
              salonData[part.fieldname] = part.value;
            }
          }
        }
      }

      salonData.photosUrls = photosUrls;
      salonData.ownerId = request.user.id; // Link salon to the authenticated user

      const salon = await prisma.salon.create({
        data: salonData
      });

      reply.status(201).send({ message: 'Salon created successfully', salon });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get All Salons (GET) - Publicly accessible
  fastify.get('/api/salons', {
    schema: {
      description: 'Get all salons (public)',
      tags: ['Salon'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: true
          }
        }
      }
    }
  }, async (request, reply) => {
    // Return all salons with owner details
    const salons = await prisma.salon.findMany({
      include: {
        owner: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
    return salons;
  });

  // Get Single Salon (GET)
  fastify.get('/api/salons/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Get a salon by ID',
      tags: ['Salon'],
      security: [{ bearerAuth: [] }],
      params: paramsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const salon = await prisma.salon.findUnique({
      where: { id: Number(id) },
      include: {
        owner: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    if (!salon) return reply.status(404).send({ error: 'Salon not found' });
    if (salon.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to view this salon' });
    
    return salon;
  });

  fastify.put('/api/salons/:id', {
    preValidation: [fastify.authenticate],
    validatorCompiler: () => () => true, // Bypass strict schema validation for multipart
    schema: {
      description: 'Update a salon',
      tags: ['Salon'],
      security: [{ bearerAuth: [] }],
      params: paramsSchema,
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          pincode: { type: 'string' },
          phoneNumber: { type: 'string' },
          description: { type: 'string' },
          operatingHours: { type: 'string', description: 'JSON string of operating hours' },
          logo: { type: 'string', format: 'binary' },
          banner: { type: 'string', format: 'binary' },
          photos: {
            type: 'array',
            items: { type: 'string', format: 'binary' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    
    const existing = await prisma.salon.findUnique({ where: { id: Number(id) } });
    if (!existing) return reply.status(404).send({ error: 'Salon not found' });
    if (existing.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to edit this salon' });

    try {
      const parts = request.parts();
      let updateData = {};
      let photosUrls = [];

      for await (const part of parts) {
        if (part.file) {
          const filename = `${Date.now()}-${part.filename}`;
          const filepath = path.join(uploadsDir, filename);
          await pump(part.file, fs.createWriteStream(filepath));
          
          const fileUrl = `/uploads/${filename}`;
          if (part.fieldname === 'logo') {
            updateData.logoUrl = fileUrl;
          } else if (part.fieldname === 'banner') {
            updateData.bannerUrl = fileUrl;
          } else if (part.fieldname === 'photos') {
            photosUrls.push(fileUrl);
          }
        } else {
          if (!['logo', 'banner', 'photos'].includes(part.fieldname)) {
            if (part.fieldname === 'operatingHours') {
              try {
                updateData[part.fieldname] = JSON.parse(part.value);
              } catch (e) {
                return reply.status(400).send({ error: 'Invalid JSON for operatingHours' });
              }
            } else {
              updateData[part.fieldname] = part.value;
            }
          }
        }
      }

      if (photosUrls.length > 0) {
        updateData.photosUrls = existing.photosUrls ? [...existing.photosUrls, ...photosUrls] : photosUrls;
      }

      // Remove undefined fields just in case
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const updatedSalon = await prisma.salon.update({
        where: { id: Number(id) },
        data: updateData
      });

      reply.send({ message: 'Salon updated successfully', salon: updatedSalon });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Delete Salon (DELETE)
  fastify.delete('/api/salons/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      description: 'Delete a salon',
      tags: ['Salon'],
      security: [{ bearerAuth: [] }],
      params: paramsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const existing = await prisma.salon.findUnique({ where: { id: Number(id) } });
      if (!existing) return reply.status(404).send({ error: 'Salon not found' });
      if (existing.ownerId !== request.user.id) return reply.status(403).send({ error: 'Unauthorized to delete this salon' });

      await prisma.salon.delete({
        where: { id: Number(id) }
      });
      reply.send({ message: 'Salon deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ error: 'Salon not found' });
      }
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = salonOwnerRoutes;
