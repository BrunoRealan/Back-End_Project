import logger from "../services/logger.js";

const userRoutes = (req, res, next) => {
  if (
    req.session.isLogged !== true ||
    !(req.session.role === "user" || req.session.role === "premium")
  ) {
    logger.warning("No tienes las credenciales necesarias de usuario.");
    return res
      .status(401)
      .send(
        "No tienes las credenciales necesarias para realizar la solicitud."
      );
  }
  next();
};

export default userRoutes;
