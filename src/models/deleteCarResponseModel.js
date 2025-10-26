import * as z from "zod";

export const deleteCarDataModel = z.object({
  carId: z.number().int().positive(),
});

export const deleteCarResponseModel = z.object({
  status: z.literal("ok"),
  data: deleteCarDataModel,
});
