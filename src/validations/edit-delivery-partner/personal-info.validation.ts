import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import z from "zod";

const optionalIdField = z
  .string()
  .trim()
  .min(5, "Must be at least 5 characters")
  .optional()
  .or(z.literal(""));

export const personalInfoValidation = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must be at most 30 characters long")
      .nonempty("First name is required"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(30, "Last name must be at most 30 characters long")
      .nonempty("Last name is required"),

    prefixPhoneNumber: z.string(),

    phoneNumber: z.string().nonempty("Phone number is required"),

    dateOfBirth: z
      .string()
      .refine((value) => {
        return Date.parse(value);
      }, "Invalid date format")
      .nonempty("Date of birth is required"),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Gender is required"),

    nationality: z
      .string()
      .nonempty("Nationality is required")
      .min(2, "Nationality must be at least 2 characters")
      .max(50, "Nationality must be at most 50 characters"),

    nifNumber: z
      .string()
      .min(9, "NIF number must be at least 9 characters")
      .nonempty("NIF number is required"),

    citizenCardNumber: optionalIdField,

    passportNumber: optionalIdField,

    idExpiryDate: z
      .string()
      .refine((value) => {
        return Date.parse(value);
      }, "Invalid date format")
      .nonempty("ID expiry date is required"),

    street: z
      .string()
      .nonempty("Street Address is required")
      .min(5, "Street Address must be at least 5 characters")
      .max(100, "Street Address must be at most 100 characters"),

    city: z
      .string()
      .nonempty("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters"),

    postalCode: z
      .string()
      .nonempty("Postal code is required")
      .min(1, "Postal code must be at least 1 characters")
      .max(10, "Postal code must be at most 10 characters"),

    state: z
      .string()
      .nonempty("State is required")
      .min(2, "State must be at least 2 characters")
      .max(50, "State must be at most 50 characters"),

    country: z
      .string()
      .nonempty("Country is required")
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country must be at most 50 characters"),
  })
  .superRefine((data, ctx) => {
    const hasCitizen = !!data.citizenCardNumber;
    const hasPassport = !!data.passportNumber;

    if (!hasCitizen && !hasPassport) {
      ctx.addIssue({
        path: ["citizenCardNumber"],
        message: "Either Citizen Card Number or Passport Number is required",
        code: "custom",
      });
      ctx.addIssue({
        path: ["passportNumber"],
        message: "Either Passport Number or Citizen Card Number is required",
        code: "custom",
      });
    }
  })
  .refine(
    (data) => {
      const full = data.prefixPhoneNumber + data.phoneNumber;
      const result = isValidPhoneNumber(full);

      return result;
    },
    {
      message: "Invalid phone number for the selected country",
      path: ["phoneNumber"],
    }
  )
  .transform((data) => {
    const full = data.prefixPhoneNumber + data.phoneNumber;
    const phone = parsePhoneNumberFromString(full);
    return {
      ...data,
      phoneNumber: `+${phone?.countryCallingCode}${phone?.nationalNumber}`,
    };
  });
