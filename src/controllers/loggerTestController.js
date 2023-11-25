import logger from "../services/logger.js";

export const loggerTestController = async (req, res) => {
  try {
    logger.debug("Prueba logger tipo Debug");
    logger.http("Prueba logger tipo HTTP");
    logger.info("Prueba logger tipo Info");
    logger.warning("Prueba logger tipo Warning");
    logger.error("Prueba logger tipo Error");
    logger.fatal("Prueba logger tipo Fatal");
    res.status(200).send("Ésta es la prueba de logger")
  } catch (error) {
    logger.error(error);
  }
};
