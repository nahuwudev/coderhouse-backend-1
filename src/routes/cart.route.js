import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";

const { getAllCarts, getCartById, addNewCart, addNewProductToCart } =
  await cartController();

export const router = Router();

/* GET */
router.get("/", getAllCarts);
router.get("/:cid", getCartById);

/* POST */
router.post("/", addNewCart);
router.post("/:cid/product/:pid", addNewProductToCart);
