import type { FastifyRequest, FastifyReply } from 'fastify';
import { categoryService } from './category.service';
import { CategoryTC } from './category.model';

export const categoryQueries = Object.freeze({
  category: CategoryTC.mongooseResolvers.findOne(),
  categories: CategoryTC.mongooseResolvers.findMany(),
});

export const categoryMutations = Object.freeze({
  createManyCategories: CategoryTC.mongooseResolvers.createMany(),
  createOneCategory: CategoryTC.mongooseResolvers.createOne(),
  updateOneCategory: CategoryTC.mongooseResolvers.updateOne(),
  removeOneCategory: CategoryTC.mongooseResolvers.removeOne(),
  removeManyCategories: CategoryTC.mongooseResolvers.removeMany(),

});

