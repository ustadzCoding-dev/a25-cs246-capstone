import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dicoding Capstone API',
      version: '1.0.0',
      description: 'API documentation for Dicoding Capstone Project Management System',
      contact: {
        name: 'API Support',
        email: 'support@devacademy.id',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.dicoding-capstone.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            dicodingId: {
              type: 'string',
              description: 'Dicoding student ID',
            },
            role: {
              type: 'string',
              enum: ['student', 'admin'],
              description: 'User role',
            },
            learningPath: {
              type: 'string',
              enum: ['Front-End', 'Back-End', 'Multi-Platform', 'React', 'Machine Learning'],
              description: 'Learning path',
            },
            isActive: {
              type: 'boolean',
              description: 'Account active status',
            },
            capstoneGroupId: {
              type: 'string',
              description: 'Capstone group ID (if member of a team)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Team: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Team ID',
            },
            capstoneGroupId: {
              type: 'string',
              description: 'Unique team identifier',
            },
            teamName: {
              type: 'string',
              description: 'Team name',
            },
            leaderId: {
              type: 'string',
              description: 'Team leader user ID',
            },
            members: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: 'Member user ID',
                  },
                  role: {
                    type: 'string',
                    enum: ['leader', 'member'],
                  },
                  joinedAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
            selectedUseCaseId: {
              type: 'string',
              description: 'Selected use case ID',
            },
            status: {
              type: 'string',
              enum: ['draft', 'pending', 'approved', 'rejected'],
              description: 'Team approval status',
            },
            submittedAt: {
              type: 'string',
              format: 'date-time',
            },
            approvedAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Validation errors (if any)',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Not authorized to access this route',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Forbidden - Insufficient permissions',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Validation failed',
                errors: [
                  {
                    field: 'email',
                    message: 'Email is required',
                  },
                ],
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Teams',
        description: 'Capstone team management',
      },
      {
        name: 'Use Cases',
        description: 'Capstone project use case management',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
