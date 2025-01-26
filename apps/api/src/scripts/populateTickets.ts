import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Support } from '../components/support/support.model'; 
import { Client } from '../components/client/client.model'; 
import { SupportTicket } from '../components/supportTicket/supportTicket.model'; 

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

const TICKET_BATCH_SIZE = 200;

async function populateSupportTickets() {
  await connectDB();

  const startTime = Date.now();

  try {
    const supports = await Support.find().exec();
    const clients = await Client.find().exec();

    console.log(`Total de soporte disponibles: ${supports.length}`);
    console.log(`Total de clientes disponibles: ${clients.length}`);

    for (let i = 0; i < clients.length; i += TICKET_BATCH_SIZE) {
      const clientBatch = clients.slice(i, i + TICKET_BATCH_SIZE);

      const ticketPromises = clientBatch.map(async (client) => {

        const randomSupportIndex = faker.number.int({ min: 0, max: supports.length - 1 });
        const support = supports[randomSupportIndex];

        if (!support) {
          console.warn(`No se encontró soporte para el índice ${randomSupportIndex}.`);
          return; 
        }

        const ticket = new SupportTicket({
          supportId: support._id, 
          clientId: client._id,
          description: faker.lorem.sentence(10),   ticketDate: faker.date.past(), 
          ticketState: faker.helpers.arrayElement(['sent', 'resolved']) 
        });

        await ticket.save();

    // @ts-ignore    
        console.log(`Ticket de soporte creado para el cliente ${client.firstName} ${client.lastName} y soporte ${support.employeeId}.`);
      });

      await Promise.all(ticketPromises); 
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('Tickets de soporte poblados exitosamente.');
  } catch (error) {
    console.error('Error al poblar tickets de soporte:', error);
  } finally {
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; 

    console.log(`Tiempo total para poblar los tickets de soporte: ${elapsedTime.toFixed(2)} segundos.`);
    await mongoose.disconnect(); 
  }
}

populateSupportTickets();
