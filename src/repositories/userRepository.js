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
        alert(warn);
        return;
      }
      if (newPass === "") {
        let warn = "Debes escribir una contraseña para contnuar";
        logger.warning(warn);
        alert(warn);
        return;
      }
      if (bcrypt.compareSync(newPass, user.password)) {
        let warn = "No puedes volver a usar una contraseña antigua";
        logger.warning(warn);
        alert(warn);
        return;
      }
      user.password = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10));
      await user.save();
      alert("La contraseña fue cambiada satisfactoriamente");

      const userDTO = { user: user.first_name };
      return userDTO;
    } catch (error) {
      logger.error(error);
    }
  };
}
