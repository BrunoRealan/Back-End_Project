import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

const app = express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));
/* 
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '\\views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '\\public'));
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado de Id:${socket.id}` );
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}`);
});
