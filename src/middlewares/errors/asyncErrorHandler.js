export const asyncErrorHandler = async (req, res, next) => {
  console.log("asyncErrorHandler en acción");
  try {
    await next();
  } catch (error) {
    console.log("Este es el Handler", error);
    res.send({ status: "error", error: "Unhandled error" });
  }
};
