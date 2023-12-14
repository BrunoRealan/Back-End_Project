import { ChatRepository } from "../repositories/chatRepository.js";
import logger from "../services/logger.js";
const chatRepository = new ChatRepository();
export default class ChatManager {
  getChat = async () => {
    try {
      const chat = await chatRepository.get();
      return chat;
    } catch (error) {
      logger.error(error);
    }
  };

  addMessage = async (message) => {
    try {
      const newMessage = await chatRepository.add(message);
      return newMessage;
    } catch (error) {
      logger.error(error);
    }
  };
}
