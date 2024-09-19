import { readFile, writeFile } from "node:fs/promises";

export async function productController() {
  const filePath = "src/db/productos.json";

  const getJSONData = async () => {
    try {
      const data = await readFile(filePath, { encoding: "utf8" });
      const products = JSON.parse(data);

      if (!products) throw new Error("Json data not init.");

      return products;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const products = await getJSONData();

  const getById = async (req, res) => {
    try {
      const { pid } = req.params;

      const product = products.find((product) => product.id === parseInt(pid));

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const getAll = async (req, res) => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit)
        : products.length;

      const limitedProducts = products.slice(0, limit);

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const addNewProduct = async (req, res) => {
    const newProduct = req.body;
    const products = await getJSONData();

    try {
      const product = {
        id: products.length + 1,
        title: newProduct.title,
        description: newProduct.description,
        code: newProduct.code,
        price: newProduct.price,
        status: newProduct.status,
        stock: newProduct.stock,
        category: newProduct.category,
        //thumbnails: newProduct.thumbnails <-- opcional.
      };

      products.push(product);

      await writeFile(filePath, JSON.stringify(products, null, 2));

      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const { data } = req.body;
    try {
      const productIndex = products.findIndex(
        (product) => product.id === parseInt(pid)
      );

      if (productIndex === -1)
        return res.status(404).json({ message: "Product not found" });

      products[productIndex] = { ...products[productIndex], ...data };

      await writeFile(filePath, JSON.stringify(products, null, 2));

      return res.status(201).json(products[productIndex]);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const deleteProduct = async (req, res) => {
    const { pid } = req.params;

    try {
      const productIndex = products.findIndex(
        (product) => product.id === parseInt(pid)
      );

      if (productIndex === -1)
        return res.status(404).json({ message: "Product not found" });

      products.splice(productIndex, 1);

      await writeFile(filePath, JSON.stringify(products, null, 2));

      return res.status(200).json({ message: "Product successfully deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  return {
    getById,
    getAll,
    addNewProduct,
    updateProduct,
    deleteProduct,
  };
}
