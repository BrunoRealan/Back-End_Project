import { recoverModel } from "../dao/database/models/recoverModel.js";
import logger from "../services/logger.js";

export class RecoverRepository {
  create = async (uId) => {
    try {
      const actualDate = new Date();
      const expirationDate = new Date(actualDate.getTime() + 30 * 60000);
      const newRecover = await recoverModel.create({
        userId: uId,
        expire_at: expirationDate,
      });
      return newRecover;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      const recover = await recoverModel.findById({ _id: id });
      return recover;
    } catch (error) {
      logger.error(error);
    }
  };
}
