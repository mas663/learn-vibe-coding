import { Elysia } from "elysia";
import { usersRoutes } from "./routes/users";

const port = Number(process.env.PORT ?? 3000);

new Elysia()
  .get("/health", () => ({ status: "ok" }))
  .use(usersRoutes)
  .listen(port);

console.log(`Server running at http://localhost:${port}`);
