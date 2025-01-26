// src/scripts/restockProducts.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Stock } from '../components/stock/stock.model';

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

//#TODO Script para quitar el campo de clientOrder and supportTickets

async function restockProducts() {
  await connectDB();

  const startTime = Date.now();

  try {
    const stocksToRestock = await Stock.find({ quantity: { $lt: 100 } }).exec();

    if (stocksToRestock.length === 0) {
      console.log('No hay productos que necesiten restock.');
      return;
    }

    for (const stock of stocksToRestock) {
      const additionalQuantity = 100; // Define la cantidad adicional a añadir
      stock.quantity += additionalQuantity; // Aumenta la cantidad
      stock.restockDate = new Date(); // Actualiza la fecha de restock

      await stock.save(); // Guarda el stock actualizado
      console.log(`Restockeado ${additionalQuantity} unidades del producto con ID: ${stock.product}. Nueva cantidad: ${stock.quantity}`);
    }

  } catch (error) {
    console.error('Error al restockear productos:', error);
  } finally {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    console.log(`Tiempo total para el restock: ${elapsedTime.toFixed(2)} segundos.`);
    await mongoose.disconnect(); // Cierra la conexión a la base de datos
  }
}

restockProducts();
