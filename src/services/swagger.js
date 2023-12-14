import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ecommerce Backend API",
      version: "1.0.0",
      description: "API of a faked e-commerce to study backend in Coder House",
      contact: {
        name: "Bruno Realán",
      },
    },
  },
  apis: [`${__dirname}../../utils/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

router.use("/", swaggerUI.serve, swaggerUI.setup(specs));

export default router;
