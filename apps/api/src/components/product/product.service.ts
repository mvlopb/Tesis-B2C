import { Product } from './product.model';

async function findOne(args: any) {
  return Product.findOne({ ...args });
}

interface PriceFilter {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

interface Filter {
  price?: PriceFilter;
  name?: String;
}

interface Args {
  filter?: Filter;
}

async function findAll(args: Args) {
  const query: any = {};

  if (args.filter?.price) {
    query['price'] = {};
    
    if (args.filter.price.gt !== undefined) {
      query['price']['$gt'] = args.filter.price.gt;
    }
    if (args.filter.price.gte !== undefined) {
      query['price']['$gte'] = args.filter.price.gte;
    }
    if (args.filter.price.lt !== undefined) {
      query['price']['$lt'] = args.filter.price.lt;
    }
    if (args.filter.price.lte !== undefined) {
      query['price']['$lte'] = args.filter.price.lte;
    }
  }

    // Filtro de nombre
    if (args.filter?.name) {
      query['name'] = args.filter.name; // Asignar el filtro de nombre directamente
    }


  return Product.find(query);
}

export const productService = Object.freeze({
  findOne,
  findAll,
});
