// src/scripts/resetSoldQty.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../components/product/product.model';

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

async function resetSoldQty() {
  await connectDB();

  const startTime = Date.now();

  try {
    const result = await Product.updateMany({}, { soldQty: 0 });

    console.log(`Se han actualizado ${result.modifiedCount} productos. soldQty establecido a 0.`);
  } catch (error) {
    console.error('Error al restablecer soldQty:', error);
  } finally {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    console.log(`Tiempo total para restablecer soldQty: ${elapsedTime.toFixed(2)} segundos.`);
    await mongoose.disconnect(); // Cierra la conexión a la base de datos
  }
}

resetSoldQty();
