import { Stock } from './stock.model';
import { Types } from 'mongoose';

interface QuantityFilter {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
}

interface Filter {
  quantity?: QuantityFilter;
  restockDate?: { gte?: Date; lte?: Date };
  storehouse?: string;  // Esperamos un ObjectId
  product?: string;     // Esperamos un ObjectId
}

interface Args {
  filter?: Filter;
}

async function findOne(args: any) {
  return Stock.findOne({ ...args });
}

async function findAll(args: Args) {
  const filter = args.filter || {};
  const query: any = {};

  // Filtro por cantidad
  if (filter.quantity) {
    const quantityQuery: any = {};

    if (filter.quantity.gte != null) {
      quantityQuery.$gte = filter.quantity.gte;
    }
    if (filter.quantity.lte != null) {
      quantityQuery.$lte = filter.quantity.lte;
    }
    if (filter.quantity.gt != null) {
      quantityQuery.$gt = filter.quantity.gt;
    }
    if (filter.quantity.lt != null) {
      quantityQuery.$lt = filter.quantity.lt;
    }

    if (Object.keys(quantityQuery).length > 0) {
      query.quantity = quantityQuery;
    }
  }

  // Filtro por fecha de reposición
  if (filter.restockDate) {
    const restockDateQuery: any = {};

    if (filter.restockDate.gte != null) {
      restockDateQuery.$gte = filter.restockDate.gte;
    }
    if (filter.restockDate.lte != null) {
      restockDateQuery.$lte = filter.restockDate.lte;
    }

    if (Object.keys(restockDateQuery).length > 0) {
      query.restockDate = restockDateQuery;
    }
  }


  if (filter.storehouse) {
    if (Types.ObjectId.isValid(filter.storehouse)) {
      query.storehouse = new Types.ObjectId(filter.storehouse);  
    } else {
      throw new Error('Invalid storehouse ID');
    }
  }
  
  if (filter.product) {
    if (Types.ObjectId.isValid(filter.product)) {
      query.product = new Types.ObjectId(filter.product);  
    } else {
      throw new Error('Invalid product ID');
    }
  }
  

  return Stock.find(query);
}

export const stockService = Object.freeze({
  findOne,
  findAll,
});
