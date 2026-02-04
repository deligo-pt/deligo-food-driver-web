import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import z from "zod";

const optionalString = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters")
  .optional()
  .or(z.literal(""));

export const personalInfoValidation = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must be at most 30 characters long"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(30, "Last name must be at most 30 characters long"),

    prefixPhoneNumber: z.string(),

    phoneNumber: z.string().nonempty("Phone number is required"),

    dateOfBirth: z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), "Invalid date format"),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    nationality: z
      .string()
      .min(2, "Nationality must be at least 2 characters")
      .max(50, "Nationality must be at most 50 characters"),

    nifNumber: z
      .string()
      .min(9, "NIF number must be at least 9 characters"),

    // ✅ passport optional
    passportNumber: optionalString,

    street: z
      .string()
      .min(5, "Street Address must be at least 5 characters")
      .max(100, "Street Address must be at most 100 characters"),

    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters"),

    postalCode: z
      .string()
      .min(1, "Postal code must be at least 1 character")
      .max(10, "Postal code must be at most 10 characters"),

    // ✅ state optional
    state: optionalString,

    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country must be at most 50 characters"),
  })
  .refine(
    (data) => {
      const full = data.prefixPhoneNumber + data.phoneNumber;
      return isValidPhoneNumber(full);
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
