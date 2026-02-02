import { z } from "zod";


const optionalString = z
  .string()
  .min(2, "Must be at least 2 characters")
  .optional()
  .or(z.literal(""));

const baseFields = {
  brand: optionalString,
  model: optionalString,
};

const motorVehicleFields = {
  licensePlate: z.string().min(2, "License plate is required"),
  drivingLicenseNumber: z.string().min(2, "Driving license number is required"),
  drivingLicenseExpiry: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Insurance policy number is required"),
  insuranceExpiry: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
};

export const vehicleInfoValidation = z.discriminatedUnion("vehicleType", [
  z.object({
    vehicleType: z.literal("BICYCLE"),
    ...baseFields,
  }),

  z.object({
    vehicleType: z.literal("E-BIKE"),
    ...baseFields,
  }),

  z.object({
    vehicleType: z.literal("SCOOTER"),
    ...baseFields,
    ...motorVehicleFields,
  }),

  z.object({
    vehicleType: z.literal("MOTORBIKE"),
    ...baseFields,
    ...motorVehicleFields,
  }),

  z.object({
    vehicleType: z.literal("CAR"),
    ...baseFields,
    ...motorVehicleFields,
  }),
]);
