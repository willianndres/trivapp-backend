import { db } from "../config/db.ts";
import { UserSchema } from "../interfaces/user.interface.ts";

export const users = db.collection<UserSchema>("users");
