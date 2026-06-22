const Razorpay = require('razorpay');
const crypto = require('crypto');

async function subscriptionRoutes(fastify, options) {
  const { prisma } = options;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Get all active plans
  fastify.get('/api/subscription/plans', async (request, reply) => {
    try {
      let plans = await prisma.subscriptionPlan.findMany({ where: { is_active: true } });
      
      // Auto-create a default plan if none exist
      if (plans.length === 0) {
        const defaultPlan = await prisma.subscriptionPlan.create({
          data: {
            plan_name: 'Standard Plan',
            price: 999, // INR
            duration_days: 30,
            max_salons: 1
          }
        });
        plans = [defaultPlan];
      }
      
      reply.send(plans);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Create an order
  fastify.post('/api/subscription/create-order', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'planId'],
        properties: {
          userId: { type: 'number' },
          planId: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const { userId, planId } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: 'User not found' });

      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
      if (!plan) return reply.status(404).send({ error: 'Plan not found' });

      // Create a Razorpay order
      const options = {
        amount: Math.round(plan.price * 100), // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_user_${userId}_plan_${planId}`
      };

      const order = await razorpay.orders.create(options);

      // Create a pending payment record
      await prisma.payment.create({
        data: {
          user_id: userId,
          plan_id: planId,
          amount: plan.price,
          transaction_id: order.id,
          payment_status: 'pending'
        }
      });

      reply.send({ order, plan, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to create order' });
    }
  });

  // Verify Payment
  fastify.post('/api/subscription/verify', {
    schema: {
      body: {
        type: 'object',
        required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'userId', 'planId'],
        properties: {
          razorpay_order_id: { type: 'string' },
          razorpay_payment_id: { type: 'string' },
          razorpay_signature: { type: 'string' },
          userId: { type: 'number' },
          planId: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId } = request.body;

    try {
      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        // Payment is verified
        
        // Update payment status
        await prisma.payment.update({
          where: { transaction_id: razorpay_order_id },
          data: { payment_status: 'completed' }
        });

        // Create or extend subscription
        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + plan.duration_days);

        const subscription = await prisma.subscription.create({
          data: {
            user_id: userId,
            plan_id: planId,
            start_date: startDate,
            end_date: endDate,
            status: 'active'
          }
        });

        reply.send({ success: true, message: 'Payment verified successfully', subscription });
      } else {
        // Invalid signature
        await prisma.payment.update({
          where: { transaction_id: razorpay_order_id },
          data: { payment_status: 'failed' }
        });
        reply.status(400).send({ success: false, error: 'Invalid signature' });
      }
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Verification failed' });
    }
  });
  // Create a new subscription plan (Admin)
  fastify.post('/api/admin/subscription-plans', {
    preValidation: [fastify.authorizeAdmin],
    schema: {
      description: 'Create a new subscription plan (Admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['plan_name', 'price', 'duration_days', 'max_salons'],
        properties: {
          plan_name: { type: 'string' },
          price: { type: 'number' },
          duration_days: { type: 'number' },
          max_salons: { type: 'number' },
          is_active: { type: 'boolean', default: true }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { plan_name, price, duration_days, max_salons, is_active } = request.body;
      
      const newPlan = await prisma.subscriptionPlan.create({
        data: {
          plan_name,
          price,
          duration_days,
          max_salons,
          is_active: is_active !== undefined ? is_active : true
        }
      });
      
      reply.status(201).send({ message: 'Subscription plan created successfully', plan: newPlan });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
  // Get user's subscription
  fastify.get('/api/subscription/me', {
    preValidation: [fastify.authenticate], // use authenticate, not authorizeSalonOwner, so they can check it even if expired
    schema: {
      description: 'Get current user subscription details',
      tags: ['Subscription'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { user_id: request.user.id },
        include: {
          plan: true
        },
        orderBy: { created_at: 'desc' }
      });

      if (!subscription) {
        return reply.status(404).send({ message: 'No subscription found for this user', hasSubscription: false });
      }

      const isActive = subscription.status === 'active' && new Date(subscription.end_date) > new Date();

      reply.send({
        hasSubscription: true,
        isActive,
        subscription
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get subscription by userId (useful when user is not logged in due to 402 Payment Required)
  fastify.get('/api/subscription/user/:userId', {
    schema: {
      description: 'Get subscription details for a specific user ID',
      tags: ['Subscription'],
      params: {
        type: 'object',
        properties: { userId: { type: 'number' } }
      }
    }
  }, async (request, reply) => {
    const { userId } = request.params;
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { user_id: Number(userId) },
        include: { plan: true },
        orderBy: { created_at: 'desc' }
      });

      if (!subscription) {
        return reply.status(404).send({ message: 'No subscription found for this user', hasSubscription: false });
      }

      const isActive = subscription.status === 'active' && new Date(subscription.end_date) > new Date();

      reply.send({
        hasSubscription: true,
        isActive,
        subscription
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = subscriptionRoutes;
