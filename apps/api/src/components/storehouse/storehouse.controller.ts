import type { FastifyRequest, FastifyReply } from 'fastify';
import { storehouseService } from './storehouse.service';
import { StorehouseTC } from './storehouse.model';

export const storehouseQueries = Object.freeze({
  storehouse: StorehouseTC.mongooseResolvers.findOne(),
  storehouses: StorehouseTC.mongooseResolvers.findMany(),
});

export const storehouseMutations = Object.freeze({
  createManyStorehouses: StorehouseTC.mongooseResolvers.createMany(),
  createOneStorehouse: StorehouseTC.mongooseResolvers.createOne(),
  updateOneStorehouse: StorehouseTC.mongooseResolvers.updateOne(),
});
