import { Router } from "express";
import axios from "axios";

export const viewsRouter = Router();
viewsRouter.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/api/product"); // Ajusta el puerto si es necesario

    const products = response.data;
    res.render("home", { layout: false, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).render("home", { layout: false, products: [] });
  }
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { layout: false });
});
