import { FastifyRequest } from 'fastify';
import { stockService } from './stock.service';
import { Stock, StockTC } from './stock.model';

interface QuantityFilter {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
}

interface Filter {
  quantity?: QuantityFilter;
  restockDate?: { gte?: Date; lte?: Date };
  storehouse?: string;
  product?: string;
}

interface StockQueryArgs {
  filter?: Filter;
}

export const stockQueries = Object.freeze({
  stock: StockTC.mongooseResolvers.findOne(),
  
  stocks: {
    type: [StockTC],
    args: {
      filter: 'JSON',
    },
    resolve: async (_: any, { filter }: StockQueryArgs, context: FastifyRequest) => {
      return await stockService.findAll({ filter: filter || {} });
    },
  },

  stockId: StockTC.mongooseResolvers.findById(),
});

export const stockMutations = Object.freeze({
  createManyStocks: StockTC.mongooseResolvers.createMany(),
  createOneStock: StockTC.mongooseResolvers.createOne(),
  updateOneStock: StockTC.mongooseResolvers.updateOne(),
  updateManyStocks: StockTC.mongooseResolvers.updateMany(),

    updateStockById: {
      type: StockTC.getType(), 
      args: {
        stockId: 'MongoID!',   
        quantityToAdd: 'Int!', 
      },
      resolve: async (_: any, { stockId, quantityToAdd }: { stockId: string, quantityToAdd: number }) => {
        try {
          const updatedStock = await Stock.findByIdAndUpdate(
            stockId,                          
            { $inc: { quantity: quantityToAdd } }, 
            { new: true }                    
          );
  
          if (!updatedStock) {
            throw new Error('Stock no encontrado o no se pudo actualizar');
          }
  
          return updatedStock;
        } catch (error) {
          //@ts-ignore
          throw new Error(error.message || 'Un error desconocido ha ocurrido');
        }
      },
    },
  removeOneStock: StockTC.mongooseResolvers.removeOne(),
  removeManyStocks: StockTC.mongooseResolvers.removeMany(),
});
