import { messageModel } from "../dao/database/models/messageModel.js";

export class ChatRepository {
  get = async () => {
    const chat = await messageModel.find();
    return chat;
  };

  add = async (message) => {
    const newMessage = await messageModel.create(message);
    return newMessage;
  };
}
