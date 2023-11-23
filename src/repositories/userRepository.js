import { userModel } from "../dao/database/models/userModel.js";

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
  };

  get = async (username) => {
    const user = await userModel.findOne({ email: username });
    return user;
  };

  getById = async (id) => {
    const user = await userModel.findById(id);
    return user;
  };
}
