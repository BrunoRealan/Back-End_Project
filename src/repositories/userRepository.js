import { userModel } from "../dao/database/models/userModel.js";
import logger from "../services/logger.js";

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
}
