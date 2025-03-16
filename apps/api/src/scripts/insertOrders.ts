import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { orderMutations } from '../components/order/order.controller';

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

const ORDERS_FILE = path.resolve(__dirname, 'mongoDirectionsConverted.json');
const BATCH_SIZE = 500;

function loadOrders(): any[] {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
    process.exit(1);
  }
}

async function insertOrdersInBatches(orders: any[]) {
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    console.log(`Insertando batch ${i / BATCH_SIZE + 1} de ${Math.ceil(orders.length / BATCH_SIZE)}`);
    console.log("Primer documento del batch:", JSON.stringify(batch[0], null, 2));
    try {
        const response = await orderMutations.createManyOrders.resolve({
          args: { records: batch },

        });
        console.log("Batch insertado correctamente:", response);
      } catch (error) {
        console.error("Error al insertar batch:", error);
        //@ts-ignore      
        if (error.extensions?.errors) {
        //@ts-ignore      

          console.log("Errores específicos:", JSON.stringify(error.extensions.errors, null, 2));
        }
      }
      
  }
}

async function main() {
  await connectDB();
  const orders = loadOrders();
  console.log(`Total de órdenes a insertar: ${orders.length}`);
  await insertOrdersInBatches(orders);
  console.log('Todas las órdenes han sido insertadas.');
  mongoose.connection.close();
}

main().catch(console.error);
