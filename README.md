# Mom's Cloud Kitchen

Premium cloud-kitchen ordering MVP: customers browse the menu and place Cash-on-Delivery orders; the kitchen admin manages products, categories, and order status.

## Structure

```
moms cloud kitchen/
├── mobile/     # Expo (SDK 58) + TypeScript + Expo Router
├── backend/    # NestJS + Prisma + SQLite REST API
└── food-delivery-app-react-native/  # Legacy demo (not used)
```

## Quick start

### 1. API

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API: `http://localhost:3000`

**Seed accounts**

| Role     | Login                         | Password      |
|----------|-------------------------------|---------------|
| Admin    | `admin@momscloudkitchen.com`  | `Admin@123`   |
| Customer | `03001234567`                 | `Customer@123`|

### 2. Mobile

```bash
cd mobile
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` if needed (default `http://localhost:3000`).  
Android emulator: use `http://10.0.2.2:3000`.

## Brand

- White `#FFFFFF` · Black `#171717` · Blue `#426B96` · Silver `#C5CBD3`
- Typography: DM Sans
- Payment: Cash on Delivery only

## MVP scope

Admin: login, dashboard, product CRUD + images, categories, order status.  
Customer: home, menu, details, cart, checkout (COD), orders, profile.
