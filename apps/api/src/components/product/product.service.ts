import { Product } from './product.model';

async function findOne(args: any) {
  return Product.findOne({ ...args });
}

async function findAll(args: any) {
  return Product.find({ ...args });
}

export const productService = Object.freeze({
  findOne,
  findAll,
});
