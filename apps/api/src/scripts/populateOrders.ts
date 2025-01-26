import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Order } from '../components/order/order.model';
import { Client } from '../components/client/client.model';
import { Product } from '../components/product/product.model';
import { Stock } from '../components/stock/stock.model';
import { Storehouse } from '../components/storehouse/storehouse.model';

dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

console.log('DATABASE URL:', process.env.DATABASE);

async function connectDB() {
  try {
    if (!process.env.DATABASE) {
      throw new Error('No se encontró la cadena de conexión a la base de datos.');
    }
    await mongoose.connect(process.env.DATABASE);
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

const ORDER_BATCH_SIZE = 200;

// Función para generar una fecha aleatoria
function getRandomDate(start: Date, end: Date): Date {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
}

// Función para seleccionar un estado aleatorio
function getRandomOrderStatus(): string {
  const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'cancelled'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex] as string; // Aserción de tipo
}

async function populateOrders() {
  await connectDB();

  const startTime = Date.now();

  try {
    const clients = await Client.find().exec();
    const totalProducts = await Product.countDocuments();

    console.log(`Total de productos disponibles: ${totalProducts}`);
    console.log(`Total de clientes disponibles: ${clients.length}`);

    for (let i = 0; i < clients.length; i += ORDER_BATCH_SIZE) {
      const clientBatch = clients.slice(i, i + ORDER_BATCH_SIZE);

      const orderPromises = clientBatch.map(async (client) => {
    // @ts-ignore    

        const storehouse = await Storehouse.findOne({ state: client.state }).exec();
        if (!storehouse) {
    // @ts-ignore    

          console.error(`No se encontró un almacén en el estado de ${client.state} para el cliente ${client.firstName} ${client.lastName}`);
          return;
        }

        // Generar entre 1 y 5 productos aleatorios por pedido
        const productsInOrder = [];
        const numProducts = faker.number.int({ min: 1, max: 5 });

        for (let j = 0; j < numProducts; j++) {
          let product;
          let stockEntry; // Mover la declaración de stockEntry aquí
          let attempts = 0; // Contador de intentos para buscar un producto

          // Buscar un producto válido en stock
          do {
            const randomProductIndex = faker.number.int({ min: 0, max: totalProducts - 1 });
            product = await Product.findOne().skip(randomProductIndex).exec();

            // Si se encuentra un producto, verificar stock
            if (product) {
              stockEntry = await Stock.findOne({
                product: product._id,
                storehouse: storehouse._id,
              });
            }

            attempts++; // Aumentar el contador de intentos

          } while (!product || (stockEntry && stockEntry.quantity <= 0) && attempts < 90); // Intentar hasta 5 veces por un producto válido

          // Comprobar si se encontró un producto válido después de 5 intentos
          if (product && stockEntry && stockEntry.quantity > 0) {
            const quantityOrdered = faker.number.int({ min: 1, max: Math.min(stockEntry.quantity, 6) }); // Pedir entre 1 y 5 unidades, pero no más de lo que haya en stock
            productsInOrder.push({
              product: product._id,
              quantity: quantityOrdered,
            });

            // Actualizar la cantidad de stock y cantidad vendida
            stockEntry.quantity -= quantityOrdered;
            product.soldQty += quantityOrdered;

            await stockEntry.save();
            await product.save();
          } else {
    // @ts-ignore    

            console.log(`No se pudo encontrar un producto válido después de ${attempts} intentos para el cliente ${client.firstName} ${client.lastName}`);
          }
        }

        // Generar una fecha aleatoria entre los últimos 30 días
        const orderDate = getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

        const order = new Order({
          client: client._id,
          status: getRandomOrderStatus(), // Asignar un estado aleatorio a la orden
          orderDate: orderDate,
          productsArray: productsInOrder,
        });

        await order.save();
    // @ts-ignore    

        console.log(`Orden creada para el cliente ${client.firstName} ${client.lastName} con ${productsInOrder.length} productos y estado ${order.status}.`);
      });

      await Promise.all(orderPromises); // Esperar a que todas las promesas del lote se completen
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 1 segundo entre cada lote
    }

    console.log('Órdenes pobladas exitosamente.');
  } catch (error) {
    console.error('Error al poblar órdenes:', error);
  } finally {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; // Tiempo en segundos

    console.log(`Tiempo total para poblar las órdenes: ${elapsedTime.toFixed(2)} segundos.`);
    await mongoose.disconnect(); // Cerrar la conexión a la base de datos
  }
}

populateOrders();
