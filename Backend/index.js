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
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });

    // 0.1 Register Multipart for file uploads
    await fastify.register(require('@fastify/multipart'));

    // Ensure uploads directory exists
    const fs = require('fs');
    const os = require('os');
    const isVercel = process.env.VERCEL === '1';
    const uploadsDir = isVercel ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 0.2 Register Static for serving uploaded files
    await fastify.register(require('@fastify/static'), {
      root: uploadsDir,
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

    fastify.decorate('authorizeSalonOwner', async function (request, reply) {
      try {
        await request.jwtVerify();
        if (request.user.role !== 'salon owner' && request.user.role !== 'Admin') {
          return reply.status(403).send({ error: 'Forbidden: Requires salon owner role' });
        }
        
        // Block salon owners without an active subscription
        if (request.user.role === 'salon owner') {
          const activeSub = await prisma.subscription.findFirst({
            where: { 
              user_id: request.user.id, 
              status: 'active',
              end_date: { gt: new Date() }
            }
          });
          if (!activeSub) {
            return reply.status(402).send({ error: 'Payment Required: Please purchase a subscription to access this feature.', requiresPayment: true });
          }
        }
      } catch (err) {
        reply.send(err);
      }
    });

    fastify.decorate('authorizeAdmin', async function (request, reply) {
      try {
        await request.jwtVerify();
        if (request.user.role !== 'Admin') {
          return reply.status(403).send({ error: 'Forbidden: Requires Admin role' });
        }
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
    await fastify.register(require('./routes/customer/callback'), { prisma });
    await fastify.register(require('./routes/admin/websiteDetails/index'), { prisma });
    await fastify.register(require('./routes/salonOwner/subscription/index'), { prisma });


    // Wait for plugins to initialize
    await fastify.ready();

    // Start listening
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Prisma client updated
