import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import { Server } from "socket.io";
import { ProductManager } from "./dao/database/ProductManager.js";
import { ChatManager } from "./dao/database/ChatManager.js";
import { initializePassport } from "./config/passport.config.js";

export const initializeApp = (httpServer) => {
  // Conexión a la base de datos
  const MONGO_URL = process.env.MONGO_URL;
  mongoose.connect(MONGO_URL);

  // Inicialización de instancias
  const socketServer = new Server(httpServer);
  const productManager = new ProductManager();
  const chatManager = new ChatManager();

  // Configuración de Express, sesiones, Passport y otras configuraciones aquí...

  // Configuración de Passport
  initializePassport();

  // Configuración del socketServer
  socketServer.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado de Id: ${socket.id}`);
    socketServer.emit("updateProducts", await productManager.getProducts());
    socket.on("message", async (data) => {
      await chatManager.addMessage(data);
      socketServer.emit("updateChat", await chatManager.getChat());
    });
  });

  return { socketServer, productManager, chatManager };
};