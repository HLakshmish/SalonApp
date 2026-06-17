require('dotenv').config();
const Fastify = require('fastify');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');

const fastify = Fastify({
  logger: true,
  ajv: {
    plugins: [require('@fastify/multipart').ajvFilePlugin]
  }
});

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Start the server
const start = async () => {
  try {
    // 0. Register CORS
    await fastify.register(require('@fastify/cors'), {
      origin: '*',
    });

    // 0.1 Register Multipart for file uploads
    await fastify.register(require('@fastify/multipart'));

    // Ensure uploads directory exists
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 0.2 Register Static for serving uploaded files
    await fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, 'uploads'),
      prefix: '/uploads/',
    });

    // 1. Register Swagger
    await fastify.register(require('@fastify/swagger'), {
      openapi: {
        info: {
          title: 'SalonApp API',
          description: 'API documentation for SalonApp backend',
          version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    // 1.1 Register JWT and Authenticate Decorator
    await fastify.register(require('@fastify/jwt'), {
      secret: process.env.JWT_SECRET || 'supersecret'
    });

    fastify.decorate('authenticate', async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });

    // 2. Register Swagger UI
    await fastify.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });

    // 3. Register Routes
    await fastify.register(require('./routes/auth'), { prisma });
    await fastify.register(require('./routes/salonOwner/createSalons'), { prisma });
    await fastify.register(require('./routes/salonOwner/seatsManagement'), { prisma });
    await fastify.register(require('./routes/salonOwner/servicesManagement'), { prisma });
    await fastify.register(require('./routes/salonOwner/employee'), { prisma });
    await fastify.register(require('./routes/customer/appointment'), { prisma });


    // Wait for plugins to initialize
    await fastify.ready();

    // Start listening
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
