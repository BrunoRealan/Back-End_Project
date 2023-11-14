const userRoutes = (req, res, next) => {
  if (!req.session.role || req.session.role !== "user") {
    console.log("No tienes las credenciales necesarias de usuario.");
    return res
      .status(401)
      .send(
        "No tienes las credenciales necesarias para realizar la solicitud."
      );
  }
  next();
};

export default userRoutes;
