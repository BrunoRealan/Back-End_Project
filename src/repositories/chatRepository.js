import { messageModel } from "../dao/database/models/messageModel.js";
import logger from "../services/logger.js";

export class ChatRepository {
  get = async () => {
    try {
      const chat = await messageModel.find();
      return chat;
    } catch (error) {
      logger.error(error);
    }
  };

  add = async (message) => {
    try {
      const newMessage = await messageModel.create(message);
      return newMessage;
    } catch (error) {
      logger.error(error);
    }
  };
}
