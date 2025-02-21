import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../components/product/product.model';  
import { Employee } from '../components/employee/employee.model'; 
import { faker } from '@faker-js/faker';

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

async function addProductData() {
  try {
    await connectDB();

    const employees = await Employee.find({
      $or: [
        // { department: 'Administrator' },
        { department: 'Manager' }
      ]
    }).exec();

    if (!employees.length) {
      console.log('No se encontraron empleados de tipo "Administrador" o "Manager".');
      return;
    }

    const products = await Product.find().exec();
    console.log(`Total de productos encontrados: ${products.length}`);

    for (const product of products) {
      const randomEmployee = faker.helpers.arrayElement(employees);


      // product.createdBy = null;  
      // product.editedBy.splice(0); 

      // console.log('datos borrados')


          // product.createdBy = randomEmployee._id;

          const editedByEntry = {
            manager: randomEmployee._id,
            lastUpdate: faker.date.recent(),
          };
          product.editedBy.push(editedByEntry);


      await product.save();
      console.log(`Producto actualizado: ${product.name}`);
    }

    console.log('Productos poblados exitosamente.');

  } catch (error) {
    console.error('Error al poblar productos:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addProductData();
