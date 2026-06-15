const bcrypt = require('bcrypt');

async function authRoutes(fastify, options) {
  const { prisma } = options;

  const registerSchema = {
    description: 'Register a new user',
    tags: ['User'],
    body: {
      type: 'object',
      required: ['name', 'email', 'phone', 'password'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        password: { type: 'string' },
      },
    },
    response: {
      201: {
        description: 'Successful registration',
        type: 'object',
        properties: {
          message: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  };

  fastify.post('/api/register', { schema: registerSchema }, async (request, reply) => {
    const { name, email, phone, password } = request.body;

    if (!name || !email || !phone || !password) {
      return reply.status(400).send({ error: 'Name, email, phone, and password are required' });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(409).send({ error: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
        },
      });

      // Don't send back the password
      const { password: _, ...userWithoutPassword } = newUser;

      reply.status(201).send({
        message: 'User registered successfully',
        user: userWithoutPassword,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = authRoutes;
