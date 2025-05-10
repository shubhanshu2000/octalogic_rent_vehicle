import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const getVehicleType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { wheels } = req.params;
    const vehicleType = await prisma.vehicleType.findMany({
      where: { wheels: Number(wheels) },
    });

    res.status(200).json(vehicleType);
  } catch (err) {
    next(err);
  }
};

const getModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleTypeId } = req.params;
    const vehicles = await prisma.vehicle.findMany({
      where: { vehicleTypeId: Number(vehicleTypeId) },
    });

    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

const vehicleBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, vehicleId, startDate, endDate } = req.body;

    // Check for overlapping bookings
    const overlap = await prisma.booking.findFirst({
      where: {
        vehicleId: Number(vehicleId),
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    if (overlap) {
      return next({
        statusCode: 409,
        message: `This vehicle is already booked for the selected dates.`,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        vehicleId: Number(vehicleId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.status(200).json({
      message: "Vehicle Booked Suceessfully",
    });
  } catch (err) {
    next(err);
  }
};

export { getVehicleType, getModel, vehicleBooking };
