import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { orderSchema } from '@avila-tek/models';
import { Stock } from '../stock/stock.model';
import { Client } from '../client/client.model';
import { Storehouse } from '../storehouse/storehouse.model';
import { Product } from '../product/product.model';

//pre-save para descontar del stock de producto, calcular subtotal, y agregar el costo de entrega
orderSchema.pre('save', async function (next) {
  const order = this;

  //verificar si hay cambios en productsArray si no hay seguir
  if (!order.isNew && !order.isModified('productsArray')) {
    return next();
  }

  try {
    //obtener el cliente asociado con la orden
    const client = await Client.findById(order.client);
    if (!client) {
      return next(new Error('Cliente no encontrado'));
    }

    //obtener la dirección seleccionada por el cliente
    // @ts-ignore
    const selectedAddress = client.address.id(order.deliveryDetails?.selectedAddress);
    if (!selectedAddress) {
      return next(new Error('Dirección no encontrada'));
    }
    console.log(selectedAddress);
    //realizar consulta geog para encontrar el almacén más cercano al cliente
    const storehouse = await Storehouse.findOne({
      'address.location': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [selectedAddress.location.coordinates[0], selectedAddress.location.coordinates[1]], 
          },
          $maxDistance: 40000,  
        },
      },
    }).sort({ distance: 1 });//ordenar por distancia más corta

    if (!storehouse) {
      return next(new Error('No se encontró un almacén cercano.'));
    }

    //verificar si hay una orden original para comparar las cantidades de productos
    let originalOrder;
    if (!order.isNew) {
      originalOrder = await Order.findById(order._id);
    }

    //descontar stock de los productos según la cantidad en la orden
    for (const item of order.productsArray) {
      const stockEntry = await Stock.findOne({
        product: item.product,
        storehouse: storehouse._id,
      }).populate('product').populate('storehouse', 'name');
      
      if (!stockEntry) {
        return next(new Error(`No se encontró stock para el producto ${item.product} en el almacén ${storehouse.name}`));
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return next(new Error('Producto no encontrado.'));
      }

      //obtener la cantidad previa del producto en la orden original
      let preQuantity = 0;
      if (originalOrder) {
        const preItem = originalOrder.productsArray.find((p) => p.product && p.product.equals(item.product));
        if (preItem) {
          preQuantity = preItem.quantity;
        }
      }

      //calcular la diferencia de cantidades
      const quantityDiff = item.quantity - preQuantity;

 
      if (quantityDiff > 0) { 
        if (stockEntry.quantity >= quantityDiff) {
          stockEntry.quantity -= quantityDiff; 
          product.soldQty += quantityDiff; 
          await stockEntry.save();
          await product.save();
        } else {
          return next(new Error(`Stock insuficiente para el producto ${stockEntry.product} en el almacén ${storehouse.name}.`));
        }
      } else if (quantityDiff < 0) { 

        stockEntry.quantity += Math.abs(quantityDiff); 
        product.soldQty -= Math.abs(quantityDiff); 
        await stockEntry.save();
        await product.save();
      }
    }

    //calcular el primer subtotal de la orden
    let subTotal = 0.00;
    for (const item of order.productsArray) {
      const product = await model('Product').findById(item.product); 
      if (product) {
        subTotal += product.price * item.quantity;
      }
    }
    order.subTotal = subTotal;

//clcular la distancia entre el cliente y el almacén usando geoNear de mongo
// Calcular la distancia entre el cliente y el almacén usando geoNear de MongoDB
if (!storehouse?.address?.location?.coordinates || storehouse?.address?.location?.coordinates.length !== 2) {
  return next(new Error('Las coordenadas del almacén no están definidas correctamente'));
}

const userCoords = selectedAddress?.location?.coordinates || [];

const distanceResult = await Storehouse.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: userCoords }, 
      distanceField: "distance",
      spherical: true,
    }
  }
]);

// Verificar si se obtuvo la distancia
if (!distanceResult.length || !distanceResult[0]?.distance) {
  return next(new Error('No se pudo calcular la distancia al almacén.'));
}

const distance = (distanceResult[0].distance) / 1000 // Guardar la distancia obtenida

// @ts-ignore
order.deliveryDetails.distance = distance; 

const deliveryCost = distance * 0.5; 

order.total = order.subTotal * 1.16 + deliveryCost; 


    next();
  } catch (error) {

    if (error instanceof Error) {
      next(new Error(error.message));
    } else {
      next(new Error('Un error desconocido ha ocurrido'));
    }
  }
});

export const Order = model('Order', orderSchema);
export const OrderTC = composeMongoose(Order as any);
