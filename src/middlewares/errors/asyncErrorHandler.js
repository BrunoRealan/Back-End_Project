export const asyncErrorHandler = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error,"este es el Handler");
    res.send({ status: "error", error: "Unhandled error" });
  }
};
