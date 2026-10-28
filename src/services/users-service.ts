import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email sudah terdaftar");
  }
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email));
  if (existing) throw new EmailAlreadyRegisteredError();

  const password = await Bun.password.hash(input.password, { algorithm: "bcrypt" });
  await db.insert(users).values({ ...input, password });
}
