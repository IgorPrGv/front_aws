// src/schemas/game.ts
import { z } from "zod";

export const uploadGameSchema = z.object({
  title: z.string().min(2),
  genre: z.string().min(2),
  description: z.string().min(10),
  images: z
    .array(z.custom<File>())
    .max(3, "Máx. 3 imagens"),
  file: z.custom<File>().nullable(), 
});
