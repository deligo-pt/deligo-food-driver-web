import z from "zod";

export const backgroundCheckValidation = z
  .object({
    haveCriminalRecordCertificate: z.boolean(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.haveCriminalRecordCertificate) return;

    // issueDate required
    if (!data.issueDate) {
      ctx.addIssue({
        path: ["issueDate"],
        message: "Issue date is required",
        code: z.ZodIssueCode.custom,
      });
    } else if (isNaN(Date.parse(data.issueDate))) {
      ctx.addIssue({
        path: ["issueDate"],
        message: "Invalid issue date format",
        code: z.ZodIssueCode.custom,
      });
    }

    // expiryDate required
    if (!data.expiryDate) {
      ctx.addIssue({
        path: ["expiryDate"],
        message: "Expiry date is required",
        code: z.ZodIssueCode.custom,
      });
    } else if (isNaN(Date.parse(data.expiryDate))) {
      ctx.addIssue({
        path: ["expiryDate"],
        message: "Invalid expiry date format",
        code: z.ZodIssueCode.custom,
      });
    }

    // expiry must be after issue
    if (
      data.issueDate &&
      data.expiryDate &&
      !isNaN(Date.parse(data.issueDate)) &&
      !isNaN(Date.parse(data.expiryDate))
    ) {
      if (new Date(data.expiryDate) <= new Date(data.issueDate)) {
        ctx.addIssue({
          path: ["expiryDate"],
          message: "Expiry date must be after issue date",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
