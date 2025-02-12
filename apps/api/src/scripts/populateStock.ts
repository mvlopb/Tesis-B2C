import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Stock } from '../components/stock/stock.model';
import { Product } from '../components/product/product.model';
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

const BATCH_SIZE = 50; 

async function populateStock() {
  await connectDB(); 

  try {
    const storehouses = await Storehouse.find().exec();
    const totalProducts = await Product.countDocuments();
    console.log(`Total de productos: ${totalProducts}`);

    for (let i = 0; i < totalProducts; i += BATCH_SIZE) {
      // Cargar un lote de productos
      const products = await Product.find().skip(i).limit(BATCH_SIZE).exec();

      const stockPromises = products.map(async (product) => {
        for (const storehouse of storehouses) {
          const stockEntry = new Stock({
            restockDate: faker.date.past(),
            storehouse: storehouse._id,
            product: product._id,
            quantity: faker.number.int({ min: 15, max: 1600 }),
          });

          await stockEntry.save();
          console.log(`Stock generado para producto ${product.name} en almacén ${storehouse.name}`);
        }
      });

      await Promise.all(stockPromises);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('Stock poblado exitosamente.');
  } catch (error) {
    console.error('Error al poblar stock:', error);
  } finally {
    await mongoose.disconnect();
  }
}

populateStock();
