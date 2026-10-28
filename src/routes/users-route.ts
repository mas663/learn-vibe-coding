import { Elysia, t } from "elysia";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  loginUser,
  registerUser,
} from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
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
  )
  .post(
    "/login",
    async ({ body, status }) => {
      try {
        return { data: await loginUser(body) };
      } catch (e) {
        if (e instanceof InvalidCredentialsError) {
          return status(401, { error: e.message });
        }
        throw e;
      }
    },
    {
      body: t.Object({
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    },
  );
