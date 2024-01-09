import { UserRepository } from "../repositories/userRepository.js";
import { RecoverRepository } from "../repositories/recoverRespository.js";
import logger from "../services/logger.js";

const userRepository = new UserRepository();
const recoverRepository = new RecoverRepository();

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
  const lastConectionUpdated = await userRepository.updateLastConnection(
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
    const recover = await recoverRepository.getById(recoverId);
    const userPassUpdate = await userRepository.updatePass(
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

export const changeUserToPremium = async (req, res) => {
  try {
    const userId = req.params.uId;
    const user = await userRepository.getById(userId);
    if (req.session.isLogged !== true) {
      let warn = "Debes iniciar sesión";
      logger.warning(warn);
      alert(warn);
    }
    if (req.session.role === "user" && user.role === "user") {
      await userRepository.changeCredential(userId);
      req.session.role = "premium";
      req.session.save();
      logger.info("Ahora tienes credenciales premium");
    } else if (req.session.role === "premium" && user.role === "premium") {
      await userRepository.changeCredential(userId);
      req.session.role = "user";
      req.session.save();
      logger.info("Ya no tienes credenciales premium");
    }
    req.session.save(() => {
      req.session.reload((err) => {
        if (err) {
          console.error(err);
        } else {
          res.redirect("/profile");
        }
      });
    });
  } catch (error) {
    logger.error(error);
  }
};

export const sendDocuments = async (req, res) => {
  try {
    const userId = req.params.uId;
    const user = await userRepository.getById(userId);
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
