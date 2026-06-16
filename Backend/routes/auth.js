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
          token: { type: 'string' },
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

      // Generate token
      const token = fastify.jwt.sign({ id: userWithoutPassword.id, email: userWithoutPassword.email });

      reply.status(201).send({
        message: 'User registered successfully',
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  const loginSchema = {
    description: 'Login a user',
    tags: ['User'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Successful login',
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    },
  };

  fastify.post('/api/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const { password: _, createdAt, updatedAt, ...userWithoutPassword } = user;

      // Generate token
      const token = fastify.jwt.sign({ id: userWithoutPassword.id, email: userWithoutPassword.email });

      reply.status(200).send({
        message: 'Login successful',
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = authRoutes;
