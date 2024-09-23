import { Category } from './category.model';

async function findOne(args: any) {
  return Category.findOne({ ...args });
}

async function findAll(args: any) {
  return Category.find({ ...args });
}

export const categoryService = Object.freeze({
  findOne,
  findAll,
});
