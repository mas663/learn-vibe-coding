import { Elysia, t } from "elysia";
import { EmailAlreadyRegisteredError, registerUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, status }) => {
    try {
      await registerUser(body);
      return { data: "OK" };
    } catch (e) {
      if (e instanceof EmailAlreadyRegisteredError) {
        return status(400, { error: e.message });
      }
      throw e;
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    }),
  },
);
