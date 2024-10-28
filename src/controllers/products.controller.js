import Product from '../db/models/product.model.js';

export async function productController() {
  const getById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  const getAll = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
      };

      const filter = query ? { category: query } : {};
      const products = await Product.paginate(filter, options);

      return res.status(200).json({
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
      });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  const addNewProduct = async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const updateProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.pid);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product successfully deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
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
