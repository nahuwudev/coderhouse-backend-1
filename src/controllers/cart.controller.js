import Cart from "../db/models/cart.model.js";

export async function cartController() {
  const getAllCarts = async (req, res) => {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getCartById = async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid).populate(
        "products.product"
      );
      if (!cart) return res.status(404).json({ message: "Cart not found" });
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const addNewCart = async (req, res) => {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return res.status(201).json(newCart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const addNewProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const existingProduct = cart.products.find(
        (p) => p.product.toString() === pid
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const product = cart.products.find((p) => p.product.toString() === pid);
      if (!product)
        return res.status(404).json({ message: "Product not found in cart" });

      product.quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await Cart.findByIdAndUpdate(
        cid,
        { $pull: { products: { product: pid } } },
        { new: true }
      );
      if (!cart) return res.status(404).json({ message: "Cart not found" });
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const deleteAllProductsFromCart = async (req, res) => {
    try {
      const cart = await Cart.findByIdAndUpdate(
        req.params.cid,
        { products: [] },
        { new: true }
      );
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  return {
    getCartById,
    addNewCart,
    addNewProductToCart,
    updateProductQuantityInCart,
    deleteProductFromCart,
    deleteAllProductsFromCart,
    getAllCarts,
  };
}
