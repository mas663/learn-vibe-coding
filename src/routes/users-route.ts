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
  const token = authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new UnauthorizedError();
  return token;
}

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .onError(({ error, status }) => {
    if (error instanceof EmailAlreadyRegisteredError) {
      return status(400, { error: error.message });
    }
    if (
      error instanceof InvalidCredentialsError ||
      error instanceof UnauthorizedError
    ) {
      return status(401, { error: error.message });
    }
  })
  .post(
    "/",
    async ({ body }) => {
      await registerUser(body);
      return { data: "OK" };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    },
  )
  .post("/login", async ({ body }) => ({ data: await loginUser(body) }), {
    body: t.Object({
      email: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
  })
  .get("/current", async ({ headers }) => ({
    data: await getCurrentUser(getBearerToken(headers.authorization)),
  }))
  .delete("/logout", async ({ headers }) => {
    await logoutUser(getBearerToken(headers.authorization));
    return { data: "OK" };
  });
