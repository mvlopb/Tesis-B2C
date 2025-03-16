import { Product } from './product.model';

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

interface Args {
  filter?: Filter;
}

// Función para buscar un solo producto
async function findOne(args: any) {
  return Product.findOne({ ...args });
}

// Función para buscar varios productos con filtros
async function findAll(args: Args) {
  const filter = args.filter || {};
  const query: any = {};

  // Procesar el filtro de precio
  if (filter.price) {
    const priceQuery: any = {};

    if (filter.price.gte != null) {
      priceQuery.$gte = filter.price.gte;
    }
    if (filter.price.lte != null) {
      priceQuery.$lte = filter.price.lte;
    }
    if (filter.price.gt != null) {
      priceQuery.$gt = filter.price.gt;
    }
    if (filter.price.lt != null) {
      priceQuery.$lt = filter.price.lt;
    }

    // Solo agregar el filtro de precio si se definió algún operador
    if (Object.keys(priceQuery).length > 0) {
      query.price = priceQuery;
    }
  }

  // Procesar el filtro de nombre (búsqueda insensible a mayúsculas)
  if (filter.name) {
    query.name = { $regex: filter.name, $options: 'i' };
  }

  return Product.find(query);
}

export const productService = Object.freeze({
  findOne,
  findAll,
});
