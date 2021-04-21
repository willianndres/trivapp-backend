import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { createHash } from "https://deno.land/std@0.80.0/hash/mod.ts";
import { users } from "../models/users.model.ts";
import { setToken } from "../middlewares/authorization.ts";
import { IUserToken } from "../interfaces/user.interface.ts";
import { format } from "https://deno.land/std@0.93.0/datetime/mod.ts";

export const registerUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  const hash = createHash("md5");
  const body = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = { message: "No has suministrados datos." };
    return;
  }
  const values = await body.value;
  const verifyEmailUser = await users.findOne({
    email: values.email,
  });
  if (typeof verifyEmailUser !== "undefined") {
    response.status = 409;
    response.body = {
      message:
        "El email ya esta siendo usado. Por favor proporcionar otro para completar el registro.",
    };
  } else {
    hash.update(values.password);
    const hashInHex = hash.toString();
    let newUser = {
      name: values.name,
      email: values.email,
      password: hashInHex,
      rol: 2,
      date: format(new Date(), "yyyy-MM-dd HH:mm"),
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
          message: "Mal acceso.",
        };
      } else {
        const user = await users.findOne({
          email: newUser.email,
        });
        response.status = 200;
        response.body = {
          token: getToken,
          user,
        };
      }
    }
  }
};

export const loginUser = async (
  { request, response }: { request: Request; response: Response },
) => {
  if (!request.hasBody) {
    response.status = 400;
    response.body = { message: "No has suministrados datos." };
    return;
  }
  try {
    const body = await request.body();
    const values = await body.value;
    const hashPassword = createHash("md5").update(values.password).toString();
    const getUser = await users.findOne({
      email: values.email,
      password: hashPassword,
    });
    if (typeof getUser !== "undefined" && typeof getUser == "object") {
      const userForToken: IUserToken = {
        name: getUser.name,
        email: getUser.email,
      };
      const getToken = await setToken(userForToken);
      response.status = 200;
      response.body = {
        token: getToken,
        user: getUser,
      };
    } else {
      response.status = 404;
      response.body = {
        message: "No se ha encontrado credenciales para este usuario.",
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      message: error,
    };
  }
};
