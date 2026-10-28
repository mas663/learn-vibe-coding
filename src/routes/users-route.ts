import { Elysia, t } from "elysia";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  UnauthorizedError,
  getCurrentUser,
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
  )
  .get("/current", async ({ headers, status }) => {
    const authorization = headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return status(401, { error: "Unauthorized" });
    }

    try {
      return { data: await getCurrentUser(authorization.slice("Bearer ".length)) };
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return status(401, { error: e.message });
      }
      throw e;
    }
  });
