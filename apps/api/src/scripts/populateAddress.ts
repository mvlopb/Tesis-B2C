import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../components/users/user.model'; 

dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

function generateVenezuelanAddress(): string {
  const avenidas = ['Av. Bolívar', 'Av. Sucre', 'Av. Urdaneta', 'Av. Libertador', 'Av. Fuerzas Armadas'];
  const calles = ['Calle 1', 'Calle 2', 'Calle 3', 'Calle Las Flores', 'Calle El Carmen'];
  const zonas = ['Sector La Pastora', 'Sector Los Palos Grandes', 'Zona Industrial', 'Urbanización El Paraíso'];
  const randomAvenida = avenidas[Math.floor(Math.random() * avenidas.length)];
  const randomCalle = calles[Math.floor(Math.random() * calles.length)];
  const randomZona = zonas[Math.floor(Math.random() * zonas.length)];
  const edificio = `Edificio ${Math.floor(Math.random() * 100) + 1}`;
  const piso = `Piso ${Math.floor(Math.random() * 10) + 1}`;

  return `${randomAvenida}, ${randomCalle}, ${randomZona}, ${edificio}, ${piso}`;
}

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

async function updateUserAddresses() {
  await connectDB();

  try {
    const users = await User.find(); 

    for (const user of users) {
      const randomAddress = generateVenezuelanAddress();

      
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            address: [{ direction: randomAddress }],
          },
        }
      );

      console.log(`Dirección actualizada para el usuario ${user.firstName} ${user.lastName}: ${randomAddress}`);
    }

    console.log('Direcciones actualizadas exitosamente.');
  } catch (error) {
    console.error('Error al actualizar direcciones:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada.');
  }
}

updateUserAddresses();
