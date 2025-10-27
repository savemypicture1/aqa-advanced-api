import * as z from "zod";

export const deleteUserResponse = z.object({
  status: z.literal("ok"),
});
