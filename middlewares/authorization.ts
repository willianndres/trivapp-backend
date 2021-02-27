import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "https://deno.land/x/djwt@v2.2/mod.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { IUserToken } from "../interfaces/user.interface.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { DENO_SECRET_JWT } = config();

export const setToken = async (
  user: any,
) => {
  const key = DENO_SECRET_JWT;
  const algorithm = "HS256";
  const header: Header = {
    alg: algorithm,
    typ: "JWT",
  };
  const payload: Payload = {
    user,
    exp: getNumericDate(604800),
  };
  const jwt = await create(header, payload, key);
  if (!jwt) {
    return false;
  }
  return jwt;
};

export const verifyToken = async ({ request, response }: {
  request: Request;
  response: Response;
}, next: any) => {
  const tokenHeader = request.headers.get("Authorization");
  const tokenAuth = tokenHeader?.split(" ") ?? "";
  if (tokenAuth[0] !== "Bearer") {
    response.status = 403;
  }
  const jwt = tokenAuth[1];
  const verifyT = await verify(jwt, DENO_SECRET_JWT, "HS256");
  console.log(verifyT);
  if (!verifyT) {
    response.status = 403;
  }
  await next();
};
