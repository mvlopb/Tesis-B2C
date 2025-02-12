import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Employee } from '../components/employee/employee.model';

dotenv.config({ path: 'C:/Users/María Lopez/Documents/Tesis/Tesis-B2C/apps/api/.env' });

const EMPLOYEE_LIMITS = {
  Administrator: 600,
  Delivery: 2000,
  Manager: 700,
  Support: 1000,
};

const TOTAL_EMPLOYEES = 4300;
const BATCH_SIZE = 500;

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




async function populateEmployees() {
  await connectDB();
  const startTime = Date.now();
  let lastBatchTime = startTime;

  try {
    const existingPhones = new Set();
    let departmentCount = { ...EMPLOYEE_LIMITS };
    let totalCreated = 0;
    const phonePrefixes = ['414', '424', '416', '412'];

    while (totalCreated < TOTAL_EMPLOYEES) {
      const batch = [];

      for (let i = 0; i < BATCH_SIZE && totalCreated < TOTAL_EMPLOYEES; i++) {
        const availableDepartments = Object.keys(departmentCount).filter(
          (dep) => departmentCount[dep as keyof typeof departmentCount] > 0
        ) as (keyof typeof departmentCount)[];

        if (availableDepartments.length === 0) break;

        const department = faker.helpers.arrayElement(availableDepartments);
        departmentCount[department]--;

        const { state, city, coords } = faker.helpers.arrayElement(locations);
        const [lat, lon] = coords as [number, number];

        const contractDate = faker.date.past({ years: 5 });
        const yearOfEntry = new Date(contractDate).getFullYear();

        let phone: string;
        do {
          const secondNumber = faker.number.int({ min: 1000, max: 9999 });
          const prefix = faker.helpers.arrayElement(phonePrefixes);
          phone = `+58 ${prefix}${yearOfEntry} ${secondNumber}`;
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

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const departmentEmail = department.toString();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${yearOfEntry}@${departmentEmail}.adidas`;

        const employee = new Employee({
          firstName,
          lastName,
          email,
          phone,
          birthday: faker.date.birthdate().toISOString().split('T')[0],
          password: faker.internet.password(),
          address: addresses,
          gender: faker.helpers.arrayElement(['m', 'f', 'na']),
          role: 'Employee',
          contractDate,
          department,
          status: faker.helpers.arrayElement(['Active', 'Inactive']),
        });

        batch.push(employee.save()); // Guardamos usando `save()` para que ejecute los middlewares
        totalCreated++;
      }

      await Promise.all(batch); // Esperamos a que todos los empleados del lote se guarden correctamente

      const now = Date.now();
      console.log(`Insertados ${totalCreated} empleados. Tiempo en este lote: ${(now - lastBatchTime) / 1000} segundos.`);
      lastBatchTime = now;
    }

    console.log('Empleados poblados exitosamente.');
  } catch (error) {
    console.error('Error al poblar empleados:', error);
  } finally {
    const endTime = Date.now();
    console.log(`Tiempo total: ${(endTime - startTime) / 1000} segundos.`);
    await mongoose.disconnect();
  }
}

populateEmployees();