import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

const userBody = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
});

export const usersRoutes = new Elysia({ prefix: "/users" })
  .get("/", () => db.select().from(users))
  .get("/:id", async ({ params, status }) => {
    const [user] = await db.select().from(users).where(eq(users.id, params.id));
    return user ?? status(404, { message: "User not found" });
  }, { params: t.Object({ id: t.Numeric() }) })
  .post("/", async ({ body, status }) => {
    const [result] = await db.insert(users).values(body);
    const [user] = await db.select().from(users).where(eq(users.id, result.insertId));
    return status(201, user);
  }, { body: userBody })
  .put("/:id", async ({ params, body, status }) => {
    const [result] = await db.update(users).set(body).where(eq(users.id, params.id));
    if (result.affectedRows === 0) return status(404, { message: "User not found" });
    const [user] = await db.select().from(users).where(eq(users.id, params.id));
    return user;
  }, { params: t.Object({ id: t.Numeric() }), body: userBody })
  .delete("/:id", async ({ params, status }) => {
    const [result] = await db.delete(users).where(eq(users.id, params.id));
    if (result.affectedRows === 0) return status(404, { message: "User not found" });
    return { message: "User deleted" };
  }, { params: t.Object({ id: t.Numeric() }) });
