import { Router } from "express";
import { productController } from "../controllers/products.controller.js";

const { getById, getAll, addNewProduct, updateProduct, deleteProduct } =
  await productController();

export const router = Router();

/* GET */
router.get("/", getAll);
router.get("/:pid", getById);

/* POST */
router.post("/", addNewProduct);

/* PUT */
router.put("/:pid", updateProduct);

/* DELETE */
router.delete("/:pid", deleteProduct)
