import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { User } from '../components/users/user.model'; 

dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

const TOTAL_CLIENTS = 9380; 
const BATCH_SIZE = 500; 

const clientsPerState = {
  Falcon: 400,
  Carabobo: 600,
  Miranda: 2500,
  Zulia: 1200,
  'Dtto. Capital': 1700,
  'La Guaira': 250,
  Aragua: 650,
  'Nva. Esparta': 530,
  Tachira: 420,
  Anzoategui: 650,
  Bolivar: 320,
  Lara: 160,
};

const locations = [
  { state: 'Falcon', city: 'Coro', coords: [11.4045, -69.67344] },
  { state: 'Carabobo', city: 'Valencia', coords: [10.16202, -68.00765] },
  { state: 'Miranda', city: 'Los Teques', coords: [10.34447, -67.04325] },
  { state: 'Zulia', city: 'Maracaibo', coords: [10.63167, -71.64056] },
  { state: 'Dtto. Capital', city: 'Caracas', coords: [10.48801, -66.87919] },
  { state: 'La Guaira', city: 'La Guaira', coords: [10.60383, -67.03034] },
  { state: 'Aragua', city: 'Maracay', coords: [10.24694, -67.59583] },
  { state: 'Nva. Esparta', city: 'Porlamar', coords: [10.95796, -63.84906] },
  { state: 'Tachira', city: 'San Cristobal', coords: [7.76694, -72.225] },
  { state: 'Anzoategui', city: 'Barcelona', coords: [10.13333, -64.7] },
  { state: 'Bolivar', city: 'Ciudad Bolivar', coords: [8.12923, -63.54086] },
  { state: 'Lara', city: 'Barquisimeto', coords: [10.07389, -69.32278] },
];

async function connectDB() {
  try {
    if (!process.env.DATABASE) throw new Error('No se encontró la cadena de conexión a la base de datos.');
    await mongoose.connect(process.env.DATABASE);
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

function getRandomCoordinates(lat: number, lon: number, radiusKm = 40) {
  const r = radiusKm / 111.32; 
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const newLat = lat + w * Math.cos(t);
  const newLon = lon + w * Math.sin(t) / Math.cos(lat * (Math.PI / 180));
  return [parseFloat(newLat.toFixed(6)), parseFloat(newLon.toFixed(6))];
}

async function populateClients() {
  await connectDB();
  const startTime = Date.now(); 
  let lastBatchTime = startTime;

  try {
    const existingEmails = new Set(); 
    const existingPhones = new Set(); 
    let createdClients = 0;

    for (const location of locations) {
      const { state, city, coords } = location;
      //@ts-ignore
      const numClientsForState = clientsPerState[state]; 

      if (!state || !city || !coords || coords.length !== 2) {
        console.error(`Ubicación inválida para el estado ${state}:`, location);
        continue;
      }

      const [lat, lon] = coords as [number, number];
      const phonePrefixes = ['414', '424', '416', '412'];

      for (let j = 0; j < numClientsForState; j++) {
        const [newLat, newLon] = getRandomCoordinates(lat, lon);
        const prefix = faker.helpers.arrayElement(phonePrefixes);
        let number;
        let phone;

        do {
          number = faker.number.int({ min: 1000000, max: 9999999 });
          phone = `+58 ${prefix} ${number}`;
        } while (existingPhones.has(phone));
        existingPhones.add(phone);

        const numAddresses = faker.number.int({ min: 1, max: 5 });
        const addresses = [];

        for (let k = 0; k < numAddresses; k++) {
          const [addressLat, addressLon] = getRandomCoordinates(lat, lon);
          addresses.push({
            state,
            city,
            direction: faker.location.streetAddress(),
            location: { type: 'Point', coordinates: [addressLon, addressLat] },
          });
        }

        let email = faker.internet.email().toLowerCase();
        while (existingEmails.has(email)) {
          email = faker.internet.email().toLowerCase();
        }
        existingEmails.add(email);

        const client = new User({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email,
          phone,
          birthday: faker.date.birthdate().toISOString().split('T')[0],
          password: faker.internet.password(), 
          address: addresses, 
          gender: faker.helpers.arrayElement(['m', 'f', 'na']),
          role: 'Client', 
        });

        await client.save(); 
        createdClients++;

        if (createdClients % BATCH_SIZE === 0) {
          const now = Date.now();
          console.log(`Insertados ${createdClients} clientes. Tiempo en este lote: ${(now - lastBatchTime) / 1000} segundos.`);
          lastBatchTime = now;
        }

        if (createdClients >= TOTAL_CLIENTS) {
          break;
        }
      }

      if (createdClients >= TOTAL_CLIENTS) {
        break;
      }
    }

    console.log('Clientes poblados exitosamente.');
  } catch (error) {
    console.error('Error al poblar clientes:', error);
  } finally {
    const endTime = Date.now();
    console.log(`Tiempo total: ${(endTime - startTime) / 1000} segundos.`);
    await mongoose.disconnect();
  }
}

populateClients();
