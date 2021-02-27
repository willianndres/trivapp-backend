import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { createHash } from "https://deno.land/std@0.80.0/hash/mod.ts";
import { users } from "../models/users.model.ts";
import { setToken } from "../middlewares/authorization.ts";
import { IUserToken } from "../interfaces/user.interface.ts";

export const registerUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  const hash = createHash("md5");
  const body = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = { message: "No data provided" };
    return;
  }
  const values = await body.value;
  hash.update(values.password);
  const hashInHex = hash.toString();
  let newUser = {
    name: values.name,
    email: values.email,
    password: hashInHex,
  };

  const insertId = await users.insertOne(newUser);
  if (typeof insertId !== "undefined" || insertId !== false) {
    const userForToken: IUserToken = {
      name: newUser.name,
      email: newUser.email,
    };
    const getToken = await setToken(userForToken);
    if (!getToken) {
      response.status = 403;
      response.body = {
        message: "Bad access.",
      };
    } else {
      response.status = 200;
      response.body = {
        token: getToken,
      };
    }
  }
};

