import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { categories } from "../models/categories.model.ts";
export const index = async (
  { request, response }: { request: Request; response: Response },
) => {
  console.log(categories);
  const getAllCats = await categories.find({});
  if (getAllCats) {
    for (const data of getAllCats) {
      console.log(data);
    }
  }
};
