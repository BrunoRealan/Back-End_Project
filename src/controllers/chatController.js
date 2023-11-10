import ChatManager from "../dao/database/ChatManager.js";

const chatManager = new ChatManager();

export const getChat = async (req, res) => {
  try {
    await chatManager.addMessage(req.body);
    const chats = await chatManager.getChat();
    req.context.socketServer.emit("message", chats);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
