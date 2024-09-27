import type { FastifyRequest, FastifyReply } from 'fastify';
import { productService } from './product.service';
import { ProductTC } from './product.model';

export const productQueries = Object.freeze({
  product: ProductTC.mongooseResolvers.findOne(),
  products: ProductTC.mongooseResolvers.findMany(),
});

export const productMutations = Object.freeze({
  createManyProducts: ProductTC.mongooseResolvers.createMany(),
  createOneProduct: ProductTC.mongooseResolvers.createOne(),
  updateOneProduct: ProductTC.mongooseResolvers.updateOne(),
  removeOneProduct: ProductTC.mongooseResolvers.removeOne(),
  removeManyProducts: ProductTC.mongooseResolvers.removeMany(),

});
