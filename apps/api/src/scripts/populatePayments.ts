import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Payment } from '../components/payment/payment.model'; 
import { Order } from '../components/order/order.model';

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

const PAYMENT_BATCH_SIZE = 50;

async function populatePayments() {
  await connectDB();

  const startTime = Date.now();

  try {
    const orders = await Order.find().exec();
    console.log(`Total de órdenes disponibles: ${orders.length}`);

    for (let i = 0; i < orders.length; i += PAYMENT_BATCH_SIZE) {
      const orderBatch = orders.slice(i, i + PAYMENT_BATCH_SIZE);

      const paymentPromises = orderBatch.map(async (order) => {
        let paymentStatus: string;

        if (order.status === 'confirmed' || order.status === 'shipped') {
          paymentStatus = 'paid';
        } else if (order.status === 'placed') {
          paymentStatus = 'pending';
        } else if (order.status === 'processing') {
          paymentStatus = 'pending';
        } else if (order.status === 'cancelled') {
            paymentStatus = 'cancelled';
        } else {
          return;         }

        const payment = new Payment({
          order: order._id,
          status: paymentStatus,
          paymentDate: paymentStatus === 'paid' ? faker.date.past() : null, 
          paymentMethod: faker.helpers.arrayElement(['credit card', 'paypal', 'transference', 'pago móvil']),
          ref: paymentStatus === 'paid' ? faker.number.int({ min: 1000, max: 9999 }) : null,
        });

        await payment.save();
        console.log(`Pago creado para la orden ${order._id} con estado ${paymentStatus}`);
      });

      await Promise.all(paymentPromises); 
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
    }

    console.log('Pagos poblados exitosamente.');
  } catch (error) {
    console.error('Error al poblar pagos:', error);
  } finally {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; 

    console.log(`Tiempo total para poblar los pagos: ${elapsedTime.toFixed(2)} segundos.`);
    await mongoose.disconnect(); 
  }
}

populatePayments();
