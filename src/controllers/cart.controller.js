import { readFile, writeFile } from "node:fs/promises";

export async function cartController() {
  const filePath = "src/db/carritos.json"; 

  const getJSONData = async () => {
    try {
      const data = await readFile(filePath, { encoding: "utf8" });
      const carts = JSON.parse(data);

      if (!carts) throw new Error("Json data not init.");

      return carts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const saveJSONData = async (data) => {
    try {
      await writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getCartById = async (req, res) => {
    try {
      const { cid } = req.params;
      const carts = await getJSONData();

      const cart = carts.find((cart) => cart.id === parseInt(cid));

      if (!cart) 
        return res.status(404).json({ message: 'Cart not found' });

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const getAllCarts = async (req, res) => {
    try {
      const carts = await getJSONData();
      return res.status(200).json(carts);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const addNewCart = async (req, res) => {
    try {
      const carts = await getJSONData();
      const newCart = {
        id: carts.length + 1,
        products: [],
      };
      carts.push(newCart);
      await saveJSONData(carts);

      return res.status(201).json(newCart);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const addNewProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const carts = await getJSONData(); // Obtener todos los carritos
      const cart = carts.find((cart) => cart.id === parseInt(cid)); // Buscar el carrito por su ID
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const existingProduct = cart.products.find((p) => p.id === parseInt(pid));
  
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: parseInt(pid), quantity: 1 });
      }
  
      await saveJSONData(carts);
  
      return res.status(200).json(cart); 
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  


  return {
    getCartById,
    getAllCarts,
    addNewCart,
    addNewProductToCart,
  };
}
