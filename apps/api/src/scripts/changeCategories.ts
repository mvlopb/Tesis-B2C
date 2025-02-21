import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../components/product/product.model';
import { Category } from '../components/category/category.model';


dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

console.log('DATABASE URL:', process.env.DATABASE);


async function updateProductCategories() {
  try {
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

    await connectDB();


    const categories = await Category.find(); 

    for (const category of categories) {
      console.log(`Procesando categoría: ${category.name} -> ${category._id}`);

      const productsToUpdate = await Product.find({
        $expr: { $eq: ["$category", category.name] }
      });

      if (productsToUpdate.length > 0) {
        const updatedProducts = await Product.updateMany(
          { $expr: { $eq: ["$category", category.name] } }, 
          { $set: { category: category._id } }
        );

        console.log(`Productos actualizados para "${category.name}": ${updatedProducts.modifiedCount}`);
      } else {
        console.log(`No se encontraron productos con la categoría "${category.name}" como string.`);
      }
    }

    await mongoose.disconnect();
    console.log("Base de datos desconectada.");
  } catch (error) {
    console.error('Error al actualizar las categorías:', error);
  }
}

updateProductCategories();