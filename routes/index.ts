import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import * as authController from "../controllers/auth.controller.ts";
import { verifyToken } from "../middlewares/authorization.ts";
import * as categoryController from "../controllers/category.controller.ts";
const router = new Router();

router
  .get("/home", async (context: Context) => {
    context.response.body = "Backend deno";
  })
  .get("/api/get-all-categories", verifyToken, categoryController.index)
  .post("/api/sign-up", authController.registerUser)
  .post("/api/sign-in", authController.loginUser)
  .post("/api/add-category", verifyToken, categoryController.addCategory)
  .post("/api/delete-category", verifyToken, categoryController.deleteCategory);

export default router;
