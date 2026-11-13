# Mom's Cloud Kitchen — API & Pages Status

Last updated: 2026-11-07

This file lists every backend route, every mobile API call, how they match, known breakage risks, and every screen that exists in the app.

---

## Quick verdict

| Area | Status |
|------|--------|
| Backend ↔ mobile **paths** | All matched — no missing or wrong endpoint paths |
| Screens created | Auth (2) + Customer (9) + Admin (8) = **19 screens** |
| Truly broken APIs | None at path level |
| Description validation | Fixed — admin form requires min 2 chars |
| Guest checkout | Blocked on purpose — must sign in |
| UI direction | Metallic Blue × Silver + selective glass (see IMPLEMENTATION_REPORT.md) |

---

## 1. Backend APIs

Base URL (device): value in `mobile/.env` → `EXPO_PUBLIC_API_URL`  
Default seed admin: `admin@momscloudkitchen.com` / `Admin@123`

| Method | Path | Auth | Role | Status |
|--------|------|------|------|--------|
| POST | `/auth/register` | Public | — | OK (email optional, saved) |
| POST | `/auth/login` | Public | — | OK (email or phone) |
| GET | `/users/me` | JWT | any | OK |
| PATCH | `/users/me` | JWT | any | OK |
| GET | `/categories` | Public | — | OK |
| GET | `/categories/admin/all` | JWT | ADMIN | OK |
| POST | `/categories` | JWT | ADMIN | OK |
| PATCH | `/categories/:id` | JWT | ADMIN | OK |
| DELETE | `/categories/:id` | JWT | ADMIN | OK (soft-deactivates if products exist) |
| GET | `/products` | Public | — | OK |
| GET | `/products/admin/all` | JWT | ADMIN | OK |
| GET | `/products/:id` | Public | — | OK |
| POST | `/products` | JWT | ADMIN | OK* |
| PATCH | `/products/:id` | JWT | ADMIN | OK* |
| DELETE | `/products/:id` | JWT | ADMIN | OK |
| POST | `/products/upload` | JWT | ADMIN | OK |
| GET | `/config` | Public | — | OK (delivery fee) |
| POST | `/orders` | JWT | CUSTOMER/ADMIN | OK |
| GET | `/orders/mine` | JWT | any | OK |
| GET | `/orders/mine/:id` | JWT | any | OK |
| GET | `/admin/orders` | JWT | ADMIN | OK |
| GET | `/admin/orders/:id` | JWT | ADMIN | OK |
| PATCH | `/admin/orders/:id/status` | JWT | ADMIN | OK |
| GET | `/admin/dashboard` | JWT | ADMIN | OK |

\* Product create/update: backend **requires** `description` (min 2 chars). Mobile form treats description as optional — empty description → **400 Bad Request**.

Static files: `/uploads/*` (product images).

---

## 2. Frontend API client (`mobile/src/services/api.ts`)

| Frontend method | Calls | Backend match | Status |
|-----------------|-------|---------------|--------|
| `api.auth.login` | POST `/auth/login` | Yes | OK |
| `api.auth.register` | POST `/auth/register` | Yes | OK |
| `api.auth.me` | GET `/users/me` | Yes | Unused (dead code) |
| `api.users.me` | GET `/users/me` | Yes | OK |
| `api.users.updateMe` | PATCH `/users/me` | Yes | OK |
| `api.categories.list` | GET `/categories` | Yes | OK |
| `api.categories.listAdmin` | GET `/categories/admin/all` | Yes | OK |
| `api.categories.create` | POST `/categories` | Yes | OK |
| `api.categories.update` | PATCH `/categories/:id` | Yes | OK |
| `api.categories.remove` | DELETE `/categories/:id` | Yes | OK |
| `api.products.list` | GET `/products` | Yes | OK |
| `api.products.listAdmin` | GET `/products/admin/all` | Yes | OK |
| `api.products.get` | GET `/products/:id` | Yes | OK |
| `api.products.create` | POST `/products` | Yes | Risk if no description |
| `api.products.update` | PATCH `/products/:id` | Yes | Risk if no description |
| `api.products.remove` | DELETE `/products/:id` | Yes | OK |
| `api.upload.image` | POST `/products/upload` | Yes | OK |
| `api.orders.create` | POST `/orders` | Yes | Needs login |
| `api.orders.mine` | GET `/orders/mine` | Yes | Needs login |
| `api.orders.getMine` | GET `/orders/mine/:id` | Yes | Needs login |
| `api.orders.all` | GET `/admin/orders` | Yes | Admin only |
| `api.orders.get` | GET `/admin/orders/:id` | Yes | Admin only |
| `api.orders.updateStatus` | PATCH `/admin/orders/:id/status` | Yes | Admin only |
| `api.admin.dashboard` | GET `/admin/dashboard` | Yes | Admin only |
| `api.config.get` | GET `/config` | Yes | OK |

### Missing / broken wiring

| Item | Broken? | Notes |
|------|---------|-------|
| Path mismatch (wrong URL) | No | All paths align |
| Backend route with no mobile client | No | — |
| Mobile client with no backend | No | — |
| Product description validation | **Yes (soft)** | Empty description on admin create → API 400 |
| Guest calling order APIs | Expected fail | JWT required — app gates checkout/orders |
| Wrong `EXPO_PUBLIC_API_URL` | Env issue | Phone cannot reach API → “Can't reach the server” |
| Profile email update | Not wired | Type allows email; backend DTO does not; UI does not send it |

---

## 3. Pages created

### Auth

| Route | File | Purpose | Reachable |
|-------|------|---------|-----------|
| `/(auth)/login` | `mobile/app/(auth)/login.tsx` | Sign in (+ guest + admin hint) | Yes |
| `/(auth)/register` | `mobile/app/(auth)/register.tsx` | Create customer account | Yes |

### Customer (guest can browse home/menu/product/cart)

| Route | File | Purpose | Reachable |
|-------|------|---------|-----------|
| `/(customer)/home` | `(customer)/(tabs)/home.tsx` | Home, featured, categories | Tab |
| `/(customer)/menu` | `(customer)/(tabs)/menu.tsx` | Full menu + filters | Tab |
| `/(customer)/orders` | `(customer)/(tabs)/orders/index.tsx` | My orders (sign-in CTA if guest) | Tab |
| `/(customer)/orders/:id` | `(customer)/(tabs)/orders/[id].tsx` | Order detail + status | From list (login required) |
| `/(customer)/profile` | `(customer)/(tabs)/profile.tsx` | Profile / guest sign-in | Tab |
| `/(customer)/product/:id` | `(customer)/product/[id].tsx` | Product details | From home/menu |
| `/(customer)/cart` | `(customer)/cart.tsx` | Cart | Cart badge |
| `/(customer)/checkout` | `(customer)/checkout.tsx` | COD checkout | From cart (login required) |
| `/(customer)/order-confirmation` | `(customer)/order-confirmation.tsx` | Order success | After place order |

### Admin (login as admin only)

| Route | File | Purpose | Reachable |
|-------|------|---------|-----------|
| `/(admin)/dashboard` | `(admin)/(tabs)/dashboard.tsx` | Stats + recent orders | Tab |
| `/(admin)/orders` | `(admin)/(tabs)/orders/index.tsx` | All orders | Tab |
| `/(admin)/orders/:id` | `(admin)/(tabs)/orders/[id].tsx` | Order detail + status update | From list |
| `/(admin)/products` | `(admin)/(tabs)/products/index.tsx` | Product list | Tab |
| `/(admin)/products/new` | `(admin)/(tabs)/products/new.tsx` | Add product + image | From products |
| `/(admin)/products/:id` | `(admin)/(tabs)/products/[id].tsx` | Edit / delete product | From products |
| `/(admin)/settings` | `(admin)/(tabs)/settings.tsx` | Admin profile / logout | Tab |
| `/(admin)/categories` | `(admin)/categories.tsx` | Category CRUD | From settings |

### Entry / shell

| Route | File | Purpose |
|-------|------|---------|
| `/` | `mobile/app/index.tsx` | Redirect by role (guest → home) |
| Root layout | `mobile/app/_layout.tsx` | Fonts, auth hydrate, React Query |

**Unreachable pages:** none.

---

## 4. Page → API map

| Page | APIs used |
|------|-----------|
| Login | `auth.login` |
| Register | `auth.register` |
| Home | `products.list`, `categories.list` |
| Menu | `products.list`, `categories.list` |
| Product detail | `products.get`, `products.list` (related) |
| Cart | `config.get` (delivery fee) |
| Checkout | `orders.create`, `config.get` |
| My orders | `orders.mine` |
| Order detail | `orders.getMine` |
| Profile | `users.updateMe` |
| Admin dashboard | `admin.dashboard` |
| Admin orders | `orders.all`, `orders.get`, `orders.updateStatus` |
| Admin products | `products.listAdmin`, `products.create/update/remove`, `upload.image`, `categories.listAdmin` |
| Admin categories | `categories.*` |

---

## 5. How to re-check

```bash
# Backend running
cd backend && npm run start:dev

# Seed admin + sample menu
npx prisma db seed

# Smoke login
curl -X POST http://127.0.0.1:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@momscloudkitchen.com","password":"Admin@123"}'
```

Mobile: ensure `mobile/.env` points at your Mac LAN IP (not `localhost` on a physical phone).

---

## 6. Suggested next fixes (if anything still “feels broken”)

1. Require product description in the admin form (or send a default) so create never 400s.
2. Keep `EXPO_PUBLIC_API_URL` in sync with the computer’s Wi‑Fi IP after network changes.
3. Remove unused `api.auth.me` or wire it for session refresh.
