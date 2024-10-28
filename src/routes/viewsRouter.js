import { Router } from "express";
import axios from "axios";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/api/product");
    const products = response.data;

    res.render("home", {
      layout: false,
      products: products.payload,
      pagination: {
        totalPages: products.totalPages,
        currentPage: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).render("home", { layout: false, products: [] });
  }
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { layout: false });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await axios.get(`http://localhost:8080/api/carts/${cid}`);
    const cart = response.data;
    res.render("cart", { layout: false, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).render("cart", { layout: false, cart: null });
  }
});

