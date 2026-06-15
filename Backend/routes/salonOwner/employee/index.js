async function employeeRoutes(fastify, options) {
  const { prisma } = options;

  // Params schema for salonId
  const salonParamsSchema = {
    type: 'object',
    properties: { salonId: { type: 'number' } }
  };

  // Params schema for employee id
  const employeeParamsSchema = {
    type: 'object',
    properties: { id: { type: 'number' } }
  };

  // Add Employee
  fastify.post('/api/salons/:salonId/employees', {
    schema: {
      description: 'Add a new employee to a salon',
      tags: ['Employees'],
      params: salonParamsSchema,
      body: {
        type: 'object',
        required: ['name', 'phone', 'role', 'experience'],
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string' },
          experience: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { salonId } = request.params;
    const { name, phone, role, experience } = request.body;

    // Check if salon exists
    const salon = await prisma.salon.findUnique({ where: { id: Number(salonId) } });
    if (!salon) return reply.status(404).send({ error: 'Salon not found' });

    try {
      const employee = await prisma.employee.create({
        data: {
          name,
          phone,
          role,
          experience,
          salonId: Number(salonId)
        }
      });
      reply.status(201).send({ message: 'Employee added successfully', employee });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get Employees by Salon
  fastify.get('/api/salons/:salonId/employees', {
    schema: {
      description: 'Get all employees for a salon',
      tags: ['Employees'],
      params: salonParamsSchema
    }
  }, async (request, reply) => {
    const { salonId } = request.params;

    const employees = await prisma.employee.findMany({
      where: { salonId: Number(salonId) }
    });
    return employees;
  });

  // Edit Employee
  fastify.put('/api/employees/:id', {
    schema: {
      description: 'Edit an employee',
      tags: ['Employees'],
      params: employeeParamsSchema,
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string' },
          experience: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, phone, role, experience } = request.body;

    try {
      const updatedEmployee = await prisma.employee.update({
        where: { id: Number(id) },
        data: { name, phone, role, experience }
      });
      reply.send({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Employee not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Delete Employee
  fastify.delete('/api/employees/:id', {
    schema: {
      description: 'Delete an employee',
      tags: ['Employees'],
      params: employeeParamsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      await prisma.employee.delete({
        where: { id: Number(id) }
      });
      reply.send({ message: 'Employee deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') return reply.status(404).send({ error: 'Employee not found' });
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

module.exports = employeeRoutes;
