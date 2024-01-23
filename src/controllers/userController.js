import UserManager from "../managers/UserManager.js";
import logger from "../services/logger.js";

const userManager = new UserManager();

export const getAllUsers = async (req, res) => {
  try {
    const users = await userManager.getAllUsers();
    res.status(200).send({ status: "success", payload: users });
  } catch (error) {
    logger.error(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uId;
    const user = await userManager.deleteOne(userId);
    if (user === undefined) {
      logger.warning("No se pudo eliminar el usuario");
      return;
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
  }
};

export const deleteOldUsers = async (req, res) => {
  try {
    const usersToDelete = await userManager.usersToDelete();
    await userManager.sendMailToDeleteUsers(usersToDelete);
    await userManager.deleteUsers(usersToDelete);
    return res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
  }
};

export const register = async (req, res) => {
  res.redirect("/login");
};

export const login = async (req, res) => {
  if (!req.user) {
    res.status(400).send("Tus datos no son correctos");
  }
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.cart = req.user.cart;
  req.session.role = req.user.role;
  req.session.isLogged = true;
  const lastConectionUpdated = await userManager.updateLastConnection(
    req.session.email
  );
  logger.debug(lastConectionUpdated);
  res.redirect("/profile");
};

export const gitHubCallBack = (req, res) => {
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.cart = req.user.cart;
  req.session.role = req.user.role;
  req.session.isLogged = true;
  res.redirect("/profile");
};

export const resetPassword = async (req, res) => {
  try {
    const recoverId = req.params.rId;
    const { password } = req.body;
    const recover = await userManager.getRecoverTicket(recoverId);
    const userPassUpdate = await userManager.updatePassword(
      recover.userId,
      password
    );
    if (userPassUpdate === undefined) {
      logger.warning("Error de cambio de contraseña");
      return;
    }
    res.redirect("/login");
  } catch (error) {
    logger.error(error);
  }
};

export const changeCredentials = async (req, res) => {
  try {
    const userId = req.params.uId;
    const user = await userManager.getById(userId);

    if (user.role === "user" || user.role === "premium") {
      await userManager.changeUserCredential(userId);
      logger.info(
        user.role === "user"
          ? "Ahora tienes credenciales premium"
          : "Ya no tienes credenciales premium"
      );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
  }
};

export const sendDocuments = async (req, res) => {
  try {
    const userId = req.params.uId;
    const user = await userManager.getById(userId);
    req.files.forEach((file) => {
      const { originalname: name, path: reference } = file;
      const document = { name, reference };
      user.documents.push(document);
    });
    await user.save();
    res.send("Documento agregado");
  } catch (error) {
    logger.error(error);
  }
};
