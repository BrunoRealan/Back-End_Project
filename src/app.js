import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/viewsRouter.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
//import ProductManager from "./dao/filesystem/ProductManager.js";
import ProductManager from "./dao/database/ProductManager.js";
import ChatManager from "./dao/database/ChatManager.js";

const environment = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://brunorealans:e82fiswHI1Qlcvbj@cluster0.4hwnhab.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );

    const app = express();
    const httpServer = http.createServer(app);
    const socketServer = new Server(httpServer);
    const productManager = new ProductManager();
    const chatManager = new ChatManager();

    app.engine("handlebars", handlebars.engine());
    app.set("views", "./src/views");
    app.set("view engine", "handlebars");

    app.use(express.static("./src/public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      session({
        store: MongoStore.create({
          mongoUrl:
            "mongodb+srv://brunorealans:e82fiswHI1Qlcvbj@cluster0.4hwnhab.mongodb.net/ecommerce?retryWrites=true&w=majority",
        }),
        secret: "pr9?ed=@$#ñq%&/($#)==hxurdfeqpoa!?",
        resave: false,
        saveUninitialized: false,
      })
    );

    app.use((req, res, next) => {
      req.context = { socketServer };
      next();
    });

    app.use("/", viewsRouter);
    app.use("/api", userRouter);
    app.use("/chat", chatRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);

    socketServer.on("connection", async (socket) => {
      console.log(`Nuevo cliente conectado de Id: ${socket.id}`);
      socketServer.emit("updateProducts", await productManager.getProducts());
      socket.on("message", async (data) => {
        await chatManager.addMessage(data);
        socketServer.emit("updateChat", await chatManager.getChat());
      });
    });

    const PORT = process.env.PORT || 8080;

    httpServer.listen(PORT, () => {
      console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log(error, "Error de conección");
  }
};
environment();
