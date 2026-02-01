import z from "zod";

export const backgroundCheckValidation = z
  .object({
    haveCriminalRecordCertificate: z.boolean(
      "Criminal record certificate is required"
    ),

    issueDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.haveCriminalRecordCertificate) {
        return !!data.issueDate;
      }
      return true;
    },
    {
      message: "Issue date is required",
      path: ["issueDate"],
    }
  )
  .refine(
    (data) => {
      if (data.issueDate) {
        return Date.parse(data.issueDate);
      }

      return true;
    },
    {
      message: "Invalid issue date format",
      path: ["issueDate"],
    }
  );
