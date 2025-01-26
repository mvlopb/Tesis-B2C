import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Stock } from '../components/stock/stock.model';
import { Product } from '../components/product/product.model';
import { Storehouse } from '../components/storehouse/storehouse.model';

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
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
    process.exit(1); // Finalizar si falla la conexión
  }
}

// Tamaño del lote
const BATCH_SIZE = 50; // Ajusta este número según sea necesario

async function populateStock() {
  await connectDB();  // Asegúrate de conectarte a la base de datos antes de poblar

  try {
    const storehouses = await Storehouse.find().exec();
    const totalProducts = await Product.countDocuments(); // Obtener el total de productos
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

      // Espera a que se complete el lote
      await Promise.all(stockPromises);

      // Espera un momento antes de continuar con el siguiente lote
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo
    }

    console.log('Stock poblado exitosamente.');
  } catch (error) {
    console.error('Error al poblar stock:', error);
  } finally {
    // Cierra la conexión a la base de datos si es necesario
    await mongoose.disconnect();
  }
}

populateStock();
