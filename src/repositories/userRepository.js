import { userModel } from "../dao/database/models/userModel.js";

export class UserRepository {
  get = async (userName) => {
    const user = await userModel.findOne({ userName }).lean();
    return user;
  };
}
