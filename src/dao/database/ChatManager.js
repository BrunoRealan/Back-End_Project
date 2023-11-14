import { ChatRepository } from "../../repositories/chatRepository.js";
const chatRepository = new ChatRepository();
export default class ChatManager {
  getChat = async () => {
    const chat = await chatRepository.get();
    return chat;
  };

  addMessage = async (message) => {
    const newMessage = await chatRepository.add(message);
    return newMessage;
  };
}
