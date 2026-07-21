import z from "zod";

export const equipmentValidation = z
  .object({
    preferredZones: z.array(z.string(), { error: "Preferred zones are required" })
      .min(1, "At least one preferred zone is required"),

    preferredHours: z.array(z.string(), { error: "Preferred hours are required" })
      .min(1, "At least one preferred hour slot is required"),

    isothermalBag: z.boolean("Isothermal bag is required"),

    helmet: z.boolean("Helmet is required"),

    powerBank: z.boolean("Power bank is required"),

    workedWithOtherPlatform: z.boolean(
      "Worked with other platform is required"
    ),

    otherPlatformName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.workedWithOtherPlatform && !data.otherPlatformName) {
        return false;
      }
      return true;
    },
    {
      message: "Other platform name is required",
      path: ["otherPlatformName"],
    }
  );
