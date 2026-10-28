# Learn Vibe Coding

Backend starter: Bun + ElysiaJS + Drizzle ORM + MySQL.

## Prasyarat

- [Bun](https://bun.sh) 1.x
- MySQL 8+ yang sedang berjalan, dengan database kosong (mis. `learn_vibe_coding`)

## Setup

```bash
bun install
cp .env.example .env   # lalu sesuaikan DATABASE_URL dan PORT
bun run db:migrate     # membuat tabel di MySQL
bun run dev            # server di http://localhost:3000
```

## Scripts

| Script                | Fungsi                                  |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Jalankan server dengan watch mode       |
| `bun run start`       | Jalankan server                         |
| `bun run db:generate` | Generate migrasi dari `src/db/schema.ts` |
| `bun run db:migrate`  | Terapkan migrasi ke database            |
| `bun run typecheck`   | Cek tipe TypeScript                     |

Setelah mengubah schema: `bun run db:generate`, lalu `bun run db:migrate`.

## Endpoint

| Method | Path         | Keterangan                          |
| ------ | ------------ | ----------------------------------- |
| GET    | `/health`    | Health check                        |
| POST   | `/api/users` | Registrasi user baru (lihat di bawah) |

### POST /api/users

Request:

```json
{ "name": "Mohammad Affan Shofi", "email": "affan@example.com", "password": "rahasia" }
```

Response sukses (200):

```json
{ "data": "OK" }
```

Response jika email sudah terdaftar (400):

```json
{ "error": "Email sudah terdaftar" }
```

Password disimpan sebagai hash bcrypt.

## Struktur

```
src/
  index.ts      # entry point server Elysia
  db/           # koneksi Drizzle dan schema
  routes/       # routing Elysia (users-route.ts)
  services/     # logic bisnis (users-service.ts)
drizzle/        # file migrasi hasil generate
```
