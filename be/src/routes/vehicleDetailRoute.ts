import {
  getModel,
  getVehicleType,
  vehicleBooking,
} from "controllers/vehicleDetailController";
import { Router } from "express";

const route = Router();

route.get("/:wheels/type", getVehicleType);
route.get("/:vehicleTypeId/model", getModel);
route.post("/book", vehicleBooking);

export default route;
