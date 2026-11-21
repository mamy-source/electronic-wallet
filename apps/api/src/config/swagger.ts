import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MONEXA API",
      version: "1.0.0",
      description: "Documentation de l'API MONEXA",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);