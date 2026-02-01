
import { z } from "zod";

const baseFields = {
  vehicleType: z.enum(["BICYCLE", "E-BIKE", "SCOOTER", "MOTORBIKE", "CAR"]),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
};

const motorVehicleFields = {
  licensePlate: z.string().min(2, "License plate is required"),
  drivingLicenseNumber: z.string().min(2, "Driving license number is required"),
  drivingLicenseExpiry: z.string().refine(
    (v) => !isNaN(Date.parse(v)),
    "Invalid date"
  ),
  insurancePolicyNumber: z.string().min(2, "Insurance policy number is required"),
  insuranceExpiry: z.string().refine(
    (v) => !isNaN(Date.parse(v)),
    "Invalid date"
  ),
};

export const vehicleInfoValidation = z.discriminatedUnion("vehicleType", [
  z.object({
    ...baseFields,
    vehicleType: z.literal("BICYCLE"),
  }),

  z.object({
    ...baseFields,
    vehicleType: z.literal("E-BIKE"),
  }),

  z.object({
    ...baseFields,
    ...motorVehicleFields,
    vehicleType: z.literal("SCOOTER"),
  }),

  z.object({
    ...baseFields,
    ...motorVehicleFields,
    vehicleType: z.literal("MOTORBIKE"),
  }),

  z.object({
    ...baseFields,
    ...motorVehicleFields,
    vehicleType: z.literal("CAR"),
  }),
]);
