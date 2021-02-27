import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import router from "./routes/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const app = new Application();

app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
