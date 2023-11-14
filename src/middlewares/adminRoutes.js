const adminRoutes = (req, res, next) => {
  if (!req.session.role || req.session.role !== "admin") {
    console.log("No tienes las credenciales necesarias de administrador.");
    return res
      .status(401)
      .send(
        "No tienes las credenciales necesarias para realizar la solicitud."
      );
  }
  next();
};

export default adminRoutes;
