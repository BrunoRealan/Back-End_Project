import { UserRepository } from "../repositories/userRepository.js";
import { RecoverRepository } from "../repositories/recoverRespository.js";
import bcrypt from "bcrypt";
import logger from "../services/logger.js";

const userRepository = new UserRepository();
const recoverRepository = new RecoverRepository();

export const register = async (req, res) => {
  //ENTREGA ANTERIOR AHORA AUTENTIFICA POR PASSPORT
  /* const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("Ya estas registrado");
  }
  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  });

  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.age = age;
  req.session.role = "user";
  req.session.isLogged = true;
 */
  res.redirect("/login");
};

export const login = async (req, res) => {
  /*const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.first_name = "Coder";
    req.session.last_name = "House";
    req.session.email = email;
    req.session.role = "admin";
    req.session.isLogged = true;

    return res.redirect("/profile");
  }

  if (!user) {
    return res.send("Tus datos no son correctos");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.send("El correro o contraseña no son válidos");
  }
  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.role = "user";
  req.session.isLogged = true;
*/

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
    logger.debug(req.session.role);
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
