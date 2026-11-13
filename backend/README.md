# Mom's Cloud Kitchen API

NestJS + Prisma + SQLite REST API for the Mom's Cloud Kitchen MVP.

## Setup

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API base: `http://localhost:3000`

## Seed accounts

| Role     | Login                        | Password       |
|----------|------------------------------|----------------|
| Admin    | admin@momscloudkitchen.com   | Admin@123      |
| Customer | 03001234567                  | Customer@123   |

## Key endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public (`email` or `phone` + `password`) |
| GET/PATCH | `/users/me` | Auth |
| GET | `/categories` | Public |
| GET/POST/PATCH/DELETE | `/categories*` | Admin |
| GET | `/products` | Public (available by default) |
| GET | `/products/admin/all` | Admin |
| POST/PATCH/DELETE | `/products` | Admin |
| POST | `/products/upload` | Admin (multipart `file`) |
| GET | `/config` | Public (`deliveryFee`, COD) |
| POST | `/orders` | Auth (server-priced, COD) |
| GET | `/orders/mine` | Auth |
| GET | `/orders/mine/:id` | Auth (own only) |
| GET | `/admin/dashboard` | Admin |
| GET | `/admin/orders` | Admin |
| PATCH | `/admin/orders/:id/status` | Admin |

Uploads are served from `/uploads`.

## Tests

```bash
npm test
```
