import * as z from "zod";

export const carModel = z.object({
  id: z.number().int().positive(),
  carBrandId: z.number().int().positive(),
  title: z.string().min(1),
});

export const carModelsResponseModel = z.object({
  status: z.literal("ok"),
  data: z.array(carModel),
});

export const carModelByIdResponseModel = z.object({
  status: z.literal("ok"),
  data: carModel,
});

export const errorResponseModel = z.object({
  status: z.literal("error"),
  message: z.string().min(1),
});
