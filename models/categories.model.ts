import { db } from "../config/db.ts";
import { CategorySchema } from "../interfaces/category.interface.ts";

export const categories = db.collection<CategorySchema>("categories");
