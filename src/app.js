import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
//import ProductManager from "./dao/filesystem/ProductManager.js";
import ProductManager from "./dao/database/ProductManager.js";
import mongoose from "mongoose";
mongoose.connect(
  "mongodb+srv://brunorealans:e82fiswHI1Qlcvbj@cluster0.4hwnhab.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

const app = express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);
const productManager = new ProductManager();

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado de Id:${socket.id}`);
  //socketServer.emit("updateProducts", await productManager.getProducts());
  socketServer.emit("updateProducts", await productManager.getProducts());
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}`);
});
