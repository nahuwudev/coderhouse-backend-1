import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { router as productRouter } from "./routes/products.route.js";
import { router as cartRouter } from "./routes/cart.route.js";
import { viewsRouter } from "./routes/viewsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

app.engine("hbs", engine());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


/* 
Debo usar la misma lista de productos que en el home?
Se podria crear  un dbService, que  se encargue  de los metodos
que gestionen las operaciones en el "db".

Con esto en viewsRouter.js se evita una call a /api/product
aqui podria usar el service  para acceder a product
pero no comprendo si esto es unicamente para entender el concepto de 
WebSockets?
*/
let products = [
  { id: 1, name: "Product 1", price: 100 },
  { id:2 , name: "Product 2", price: 150 },
];

io.on("connection", (socket) => {
  console.log("Cliente conectado", socket.id);

  socket.emit("updateProducts", products);

  socket.on("newProduct", (data) => {
    products.push(data);

    io.emit("updateProducts", products);
  });

  socket.on("getProducts", () => {
    socket.emit("updateProducts", products);
  });

  socket.on('deleteProduct', async productId => {
    console.log(productId)
    const findIndex = products.findIndex((prod) => prod.id === productId);
    products.splice(findIndex, 1)
    io.emit('updateProducts', products)
  })
});

app.use(express.json());

app.use(express.static("public"));

app.use("/api/product", productRouter);
app.use("/api/carts", cartRouter);

app.use("/", viewsRouter);

httpServer.listen(8080, () => console.log("http://localhost:8080"));
