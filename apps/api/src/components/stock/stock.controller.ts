import type { FastifyRequest, FastifyReply } from 'fastify';
import { stockService } from './stock.service';
import { StockTC } from './stock.model';

export const stockQueries = Object.freeze({
  stock: StockTC.mongooseResolvers.findOne(),
  stocks: StockTC.mongooseResolvers.findMany(),
});

export const stockMutations = Object.freeze({
  createManyStocks: StockTC.mongooseResolvers.createMany(),
  createOneStock: StockTC.mongooseResolvers.createOne(),
  updateOneStock: StockTC.mongooseResolvers.updateOne(),
});
