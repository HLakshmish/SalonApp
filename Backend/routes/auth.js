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
        role: { type: 'string', enum: ['salon owner', 'Admin'] },
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
              role: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  };

  fastify.post('/api/register', { schema: registerSchema }, async (request, reply) => {
    const { name, email, phone, password, role } = request.body;

    if (!name || !email || !phone || !password) {
      return reply.status(400).send({ error: 'Name, email, phone, and password are required' });
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return reply.status(400).send({ error: 'Name must contain characters and spaces only (no numbers or special characters)' });
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
          role: role || 'salon owner',
        },
      });

      // Don't send back the password
      const { password: _, ...userWithoutPassword } = newUser;

      // Generate token
      const token = fastify.jwt.sign({ id: userWithoutPassword.id, email: userWithoutPassword.email, role: userWithoutPassword.role });

      // Check if they need to pay
      let requiresPayment = false;
      if (userWithoutPassword.role === 'salon owner') {
        requiresPayment = true;
      }

      reply.status(201).send({
        message: requiresPayment ? 'Registered successfully. Please complete payment to login.' : 'User registered successfully',
        token: requiresPayment ? null : token, // Don't give token if payment required to force them to pay first
        userId: userWithoutPassword.id,
        requiresPayment,
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
              role: { type: 'string' },
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

      // Check subscription for salon owner
      if (user.role === 'salon owner') {
        const activeSub = await prisma.subscription.findFirst({
          where: {
            user_id: user.id,
            status: 'active',
            end_date: { gt: new Date() }
          }
        });

        if (!activeSub) {
          return reply.status(402).send({ 
            error: 'Payment Required: You must purchase a subscription to log in.', 
            requiresPayment: true,
            userId: user.id
          });
        }
      }

      const { password: _, createdAt, updatedAt, ...userWithoutPassword } = user;

      // Generate token
      const token = fastify.jwt.sign({ id: userWithoutPassword.id, email: userWithoutPassword.email, role: userWithoutPassword.role });

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

  const forgotPasswordSchema = {
    description: 'Reset password using email and phone verification',
    tags: ['User'],
    body: {
      type: 'object',
      required: ['email', 'phone', 'newPassword'],
      properties: {
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Successful password reset',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      400: {
        description: 'Bad request',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  };

  fastify.post('/api/forgot-password', { schema: forgotPasswordSchema }, async (request, reply) => {
    const { email, phone, newPassword } = request.body;

    try {
      const user = await prisma.user.findFirst({
        where: { email, phone },
      });

      if (!user) {
        return reply.status(400).send({ error: 'User not found with matching email and phone number' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return reply.status(200).send({ message: 'Password reset successfully' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = authRoutes;
