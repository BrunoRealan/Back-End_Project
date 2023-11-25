import logger from "../../services/logger.js";

export const asyncErrorHandler = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    logger.error("Este es el Handler", error);
    res.send({ status: "error", error: "Unhandled error" });
  }
};
