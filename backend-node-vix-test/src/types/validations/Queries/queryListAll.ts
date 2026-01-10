import { z } from "zod";

const alphanumericString = z
  .string()
  .regex(
    /^[\p{L}0-9\s\-_().]*$/u,
    "Search can only contain letters (with accents), numbers, spaces, and the characters - _ ( ) .",
  );

export const querySchema = z.object({
  search: alphanumericString.optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Page must be a valid number",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Limit must be a valid number",
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Offset must be a valid number",
    }),
  orderBy: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val.split(",").map((pair) => {
        const [field, direction] = pair.split(":");
        return { field, direction };
      });
    })
    .refine(
      (val) =>
        val.every(
          ({ field, direction }) =>
            field && ["asc", "desc"].includes(direction),
        ),
      {
        message:
          "Each orderBy must have a valid format: 'field:asc' or 'field:desc'",
      },
    ),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === undefined || val === null ? undefined : val === "true",
    ),
  idBrandMaster: z
    .union([z.string(), z.number()])
    .nullable()
    .optional()
    .transform((val): number | null | undefined => {
      if (val === undefined) return undefined;
      if (val === null || val.toString() === "null") return null;
      const parsed = parseInt(val.toString(), 10);
      return isNaN(parsed) ? undefined : parsed;
    }),
  isPoc: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      `${val}`.toLowerCase() === "true"
        ? true
        : `${val}`.toLowerCase() === "false"
          ? false
          : undefined,
    ),
});

export type TQuery = z.infer<typeof querySchema>;
