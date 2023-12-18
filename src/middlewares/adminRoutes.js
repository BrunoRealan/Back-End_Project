import logger from "../services/logger.js";

const adminRoutes = (req, res, next) => {
  if (
    req.session.isLogged !== true ||
    !(req.session.role === "admin" || req.session.role === "premium")
  ) {
    logger.warning("No tienes las credenciales necesarias de administrador o usuario premium.");
    return res
      .status(401)
      .send(
        "No tienes las credenciales necesarias para realizar la solicitud."
      );
  }
  next();
};

export default adminRoutes;