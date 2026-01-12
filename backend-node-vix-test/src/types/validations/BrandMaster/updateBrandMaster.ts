import { z } from "zod";

export const brandMasterUpdatedSchema = z.object({
  brandName: z.string().nullable().optional(),
  isActive: z.boolean().default(false).optional(),
  brandLogo: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  contract: z.string().nullable().optional(),
  setorName: z.string().nullable().optional(),
  fieldName: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  emailContact: z.string().nullable().optional(),
  smsContact: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  placeNumber: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  cityCode: z.number().nullable().optional(),
  district: z.string().nullable().optional(),
  stripeUserId: z.string().nullable().optional(),
  isPoc: z.boolean().default(false).optional(),
  discountRate: z.number().min(0).optional(),
  minConsumption: z.number().min(0).optional(),
  manual: z.string().nullable().optional(),
  termsOfUse: z.string().nullable().optional(),
  privacyPolicy: z.string().nullable().optional(),
});

export type TBrandMasterUpdate = z.infer<typeof brandMasterUpdatedSchema>;
