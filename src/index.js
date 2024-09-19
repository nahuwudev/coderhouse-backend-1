import express from "express";
import { router as productRouter } from "./routes/products.route.js";
import { router as cartRouter } from "./routes/cart.route.js";

const app = express();

app.use(express.json());

app.use("/api/product", productRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, () => console.log("http://localhost:8080"));
