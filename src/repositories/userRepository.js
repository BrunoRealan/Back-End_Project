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

  getByEmail = async (username) => {
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

  getAll = async (req, res) => {
    try {
      const users = await userModel.find({});
      return users;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteOne = async (id) => {
    try {
      const user = await userModel.findByIdAndDelete(id);
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteMany = async (arrayIds) => {
    try {
      const usersToDelete = arrayIds.map(async (id) => {
        await userModel.deleteOne({ _id: id });
      });
      const results = await Promise.all(usersToDelete);
      return results;
    } catch (error) {
      logger.error(error);
    }
  };
}
