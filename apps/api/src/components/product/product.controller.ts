import type { FastifyRequest } from 'fastify';
import { productService } from './product.service';
import { ProductTC } from './product.model';

interface PriceFilter {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

interface Filter {
  price?: PriceFilter;
  name?: string | RegExp; 
}

interface ProductQueryArgs {
  filter?: Filter;
}


export const productQueries = Object.freeze({
  product: ProductTC.mongooseResolvers.findOne(),
  
  products: {
    type: [ProductTC],
    args: {
      filter: 'JSON', 
    },
    resolve: async (_: any, { filter }: ProductQueryArgs, context: FastifyRequest) => {
      return await productService.findAll({ filter: filter || {} });
    },
  },
  
  productId: ProductTC.mongooseResolvers.findById(),
});




export const productMutations = Object.freeze({
  createManyProducts: ProductTC.mongooseResolvers.createMany(),
  createOneProduct: ProductTC.mongooseResolvers.createOne(),
  updateOneProduct: ProductTC.mongooseResolvers.updateOne(),
  updateManyProducts: ProductTC.mongooseResolvers.updateMany(),
  updateProductById: ProductTC.mongooseResolvers.updateById(),
  removeOneProduct: ProductTC.mongooseResolvers.removeOne(),
  removeManyProducts: ProductTC.mongooseResolvers.removeMany(),
});
