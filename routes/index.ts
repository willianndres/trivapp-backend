import { Router } from "https://deno.land/x/oak/mod.ts";
import * as authController from "../controllers/auth.controller.ts";
import { verifyToken } from "../middlewares/authorization.ts";
import * as categoryController from "../controllers/category.controller.ts";
const router = new Router();

router
  .post("/api/register", authController.registerUser)
  .post("/api/get_all_category", verifyToken, categoryController.index);

export default router;
