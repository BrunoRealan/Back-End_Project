import { messageModel } from "./models/messageModel.js"

export default class ChatManager {
    async getChat (){
        const chat = await messageModel.find();
        return chat;
    }

    async addMessage(message){
        const newMessage = await messageModel.create(message);
        return newMessage;
    }
}