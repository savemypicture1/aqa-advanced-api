import * as z from "zod";

export const createdCarModel = z.object({
  id: z.number().int().positive(),
  carBrandId: z.number().int().positive(),
  carModelId: z.number().int().positive(),
  initialMileage: z.number().int().nonnegative(),
  updatedMileageAt: z.string().datetime(),
  mileage: z.number().int().nonnegative(),
  brand: z.string(),
  model: z.string(),
  logo: z.string(),
});

export const createdCarResponseModel = z.object({
  status: z.literal("ok"),
  data: createdCarModel,
});

export const errorResponseModel = z.object({
  status: z.literal("error"),
  message: z.string().min(1),
});
