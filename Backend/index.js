require('dotenv').config();
const Fastify = require('fastify');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const fastify = Fastify({ logger: true });

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

    // 1. Register Swagger
    await fastify.register(require('@fastify/swagger'), {
      openapi: {
        info: {
          title: 'SalonApp API',
          description: 'API documentation for SalonApp backend',
          version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
      },
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
