import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
});

productSchema.plugin(paginate)

export default mongoose.model('Product', productSchema);
