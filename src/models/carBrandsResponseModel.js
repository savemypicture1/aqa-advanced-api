import * as z from "zod";

export const carBrandModel = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  logoFilename: z.string().min(1),
});

export const carBrandsResponseModel = z.object({
  status: z.literal("ok"),
  data: z.array(carBrandModel),
});

export const carBrandByIdResponseModel = z.object({
  status: z.literal("ok"),
  data: carBrandModel,
});

export const errorResponseModel = z.object({
  status: z.literal("error"),
  message: z.string().min(1),
});
