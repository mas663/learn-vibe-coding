import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email sudah terdaftar");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Email atau password salah");
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

export async function loginUser(input: { email: string; password: string }) {
  const [user] = await db.select().from(users).where(eq(users.email, input.email));
  if (!user) throw new InvalidCredentialsError();

  const valid = await Bun.password.verify(input.password, user.password);
  if (!valid) throw new InvalidCredentialsError();

  const token = crypto.randomUUID();
  await db.insert(sessions).values({ token, userId: user.id });
  return token;
}
