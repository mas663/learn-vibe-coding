import { Elysia, t } from "elysia";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  UnauthorizedError,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/users-service";

function getBearerToken(authorization: string | undefined) {
  return authorization?.match(/^Bearer (.+)$/i)?.[1] ?? null;
}

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
    const token = getBearerToken(headers.authorization);
    if (!token) return status(401, { error: "Unauthorized" });

    try {
      return { data: await getCurrentUser(token) };
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return status(401, { error: e.message });
      }
      throw e;
    }
  })
  .delete("/logout", async ({ headers, status }) => {
    const token = getBearerToken(headers.authorization);
    if (!token) return status(401, { error: "Unauthorized" });

    try {
      await logoutUser(token);
      return { data: "OK" };
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return status(401, { error: e.message });
      }
      throw e;
    }
  });
