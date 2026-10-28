import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT ?? 3000);

new Elysia()
  .get("/health", () => ({ status: "ok" }))
  .use(usersRoute)
  .listen(port);

console.log(`Server running at http://localhost:${port}`);
