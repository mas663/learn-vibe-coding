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
| POST   | `/api/users/login` | Login user (lihat di bawah) |
| GET    | `/api/users/current` | Data user yang sedang login (lihat di bawah) |

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

### POST /api/users/login

Request:

```json
{ "email": "affan@example.com", "password": "rahasia" }
```

Response sukses (200), berisi token UUID yang disimpan di tabel `sessions`:

```json
{ "data": "3f1c2a9e-8b7d-4e6f-a1b2-c3d4e5f6a7b8" }
```

Response jika email tidak terdaftar atau password salah (401):

```json
{ "error": "Email atau password salah" }
```

### GET /api/users/current

Header (token didapat dari login):

```
Authorization: Bearer <token>
```

Response sukses (200):

```json
{
  "data": {
    "id": 1,
    "name": "Mohammad Affan Shofi",
    "email": "affan@example.com",
    "created_at": "2026-10-28T15:25:45.000Z"
  }
}
```

Response jika header tidak ada, formatnya salah, atau token tidak dikenal (401):

```json
{ "error": "Unauthorized" }
```

## Struktur

```
src/
  index.ts      # entry point server Elysia
  db/           # koneksi Drizzle dan schema
  routes/       # routing Elysia (users-route.ts)
  services/     # logic bisnis (users-service.ts)
drizzle/        # file migrasi hasil generate
```
