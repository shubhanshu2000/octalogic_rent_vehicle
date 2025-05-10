import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // Vehicle Types
  const hatchback = await prisma.vehicleType.create({
    data: { name: "Hatchback", wheels: 4 },
  });
  const suv = await prisma.vehicleType.create({
    data: { name: "SUV", wheels: 4 },
  });
  const sedan = await prisma.vehicleType.create({
    data: { name: "Sedan", wheels: 4 },
  });
  const cruiser = await prisma.vehicleType.create({
    data: { name: "Cruiser", wheels: 2 },
  });

  // Vehicles
  await prisma.vehicle.createMany({
    data: [
      { model: "Swift", vehicleTypeId: hatchback.id },
      { model: "i20", vehicleTypeId: hatchback.id },
      { model: "Creta", vehicleTypeId: suv.id },
      { model: "Fortuner", vehicleTypeId: suv.id },
      { model: "City", vehicleTypeId: sedan.id },
      { model: "Accord", vehicleTypeId: sedan.id },
      { model: "Harley", vehicleTypeId: cruiser.id },
      { model: "Royal Enfield", vehicleTypeId: cruiser.id },
    ],
  });
  console.log("Database has been seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
