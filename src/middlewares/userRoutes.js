import logger from "../services/logger.js";

const userRoutes = (req, res, next) => {
  if (
    req.session.isLogged !== true ||
    !(req.session.role === "user" || req.session.role === "premium")
  ) {
    logger.warning("No tienes las credenciales necesarias de usuario.");
    return res
      .status(401)
      .send({
        status: "failure",
        message:
          "You do not have the necessary credentials to make the request",
      });
  }
  next();
};

export default userRoutes;
