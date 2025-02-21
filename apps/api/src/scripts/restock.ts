import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Stock } from '../components/stock/stock.model';
import { Product } from '../components/product/product.model';
import { Storehouse } from '../components/storehouse/storehouse.model';

dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

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

async function restockProducts() {
  await connectDB();
  const startTime = Date.now();
  try {
    const stocksToRestock = await Stock.find({ quantity: { $lt: 100 } }).exec();

    if (stocksToRestock.length === 0) {
      console.log('No hay productos que necesiten restock.');
      return;
    }

    let restockedProducts: {storehouseName: string; productName: string; quantityAdded: number }[] = [];

    for (const stock of stocksToRestock) {
      const additionalQuantity = 100;
      stock.quantity += additionalQuantity;
      stock.restockDate = new Date();
      await stock.save();

      const product = await Product.findById(stock.product).select('name').exec();
      const productName = product ? product.name : 'Desconocido';
      const storehouse = await Storehouse.findById(stock.storehouse).select('name').exec();
      const storehouseName = storehouse ? storehouse.name : 'Desconocido';


      restockedProducts.push({storehouseName, productName, quantityAdded: additionalQuantity });
      console.log(`Restockeado ${additionalQuantity} unidades del producto: ${productName} en ${storehouseName}. Nueva cantidad: ${stock.quantity}`);
    }

    const filePath = path.join(__dirname, 'restocked_products.json');
    fs.writeFileSync(filePath, JSON.stringify(restockedProducts, null, 2));
    console.log(`Restock guardado en ${filePath}`);
  } catch (error) {
    console.error('Error al restockear productos:', error);
  } finally {
    const endTime = Date.now();
    console.log(`Tiempo total para el restock: ${((endTime - startTime) / 1000).toFixed(2)} segundos.`);
    await mongoose.disconnect();
  }
}

restockProducts();
