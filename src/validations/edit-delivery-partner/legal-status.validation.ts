import z from "zod";

export const legalStatusValidation = z.object({
  residencePermitType: z
    .string()
    .min(2, "Residence permit type must be at least 2 characters")
    .max(50, "Residence permit type must be at most 50 characters")
    .nonempty("Residence permit type is required"),

  residencePermitNumber: z
    .string()
    .min(2, "ARC / título de residência number must be at least 2 characters")
    .max(50, "ARC / título de residência number must be at most 50 characters")
    .nonempty("ARC / título de residência number is required"),

  residencePermitExpiry: z
    .string()
    .refine((value) => {
      return Date.parse(value);
    }, "Invalid date format")
    .nonempty("Date of birth is required"),
});
