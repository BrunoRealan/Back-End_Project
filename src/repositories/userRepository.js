import { userModel } from "../dao/database/models/userModel.js";
import logger from "../services/logger.js";
import bcrypt from "bcrypt";

export class UserRepository {
  create = async ({
    first_name,
    last_name,
    email,
    age,
    password,
    cart,
    role,
  }) => {
    try {
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password,
        cart,
        role,
      });
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  get = async (username) => {
    try {
      const user = await userModel.findOne({ email: username });
      return user;
    } catch (error) {
      logger.error();
    }
  };

  getById = async (id) => {
    try {
      const user = await userModel.findById(id);
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  updatePass = async (uId, newPass) => {
    try {
      const user = await userModel.findOne({ _id: uId });
      if (user === undefined) {
        let warn = "No existe el usuario en el registro";
        logger.warning(warn);
        return;
      }
      if (newPass === "") {
        let warn = "Debes escribir una contraseña para contnuar";
        logger.warning(warn);
        return;
      }
      if (bcrypt.compareSync(newPass, user.password)) {
        let warn = "No puedes volver a usar una contraseña antigua";
        logger.warning(warn);
        return;
      }
      user.password = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10));
      await user.save();
      logger.info("La contraseña fue cambiada satisfactoriamente");

      const userDTO = { user: user.first_name };
      return userDTO;
    } catch (error) {
      logger.error(error);
    }
  };

  changeCredential = async (id) => {
    try {
      const user = await userModel.findById(id);
      if (user.role === "user") {
        user.role = "premium";
        return user.save();
      } else if (user.role === "premium") {
        user.role = "user";
        return user.save();
      }
    } catch (error) {
      logger.error(error);
    }
  };

  updateLastConnection = async (eMail) => {
    try {
      const user = await userModel.findOne({ email: eMail });
      user.last_connection = Date.now();
      await user.save();
      return user.last_connection;
    } catch (error) {
      logger.error(error);
    }
  };
}
