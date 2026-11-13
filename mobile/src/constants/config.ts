import Constants from 'expo-constants';

/**
 * API base URL resolution order:
 *  1. EXPO_PUBLIC_API_URL (mobile/.env) — preferred for local / device testing
 *  2. expo.extra.apiUrl in app.json — optional fallback
 *
 * There is intentionally no silent localhost default on device builds —
 * a missing URL surfaces a clear error instead of failing obscurely.
 *
 * Setup:
 *  - iOS Simulator:   EXPO_PUBLIC_API_URL=http://localhost:3000
 *  - Android Emulator: EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
 *  - Physical device:  EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
 *                      (same Wi‑Fi as the Mac running the Nest API)
 *
 * Copy mobile/.env.example → mobile/.env and set your reachable host.
 * Never put secrets in EXPO_PUBLIC_* vars — they ship in the client bundle.
 */
const extraUrl = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;
const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_URL = (fromEnv || extraUrl || 'http://localhost:3000').replace(/\/+$/, '');

export const BRAND_NAME = "Mom's Cloud Kitchen";

/** Fallback when the API does not expose a delivery fee config. */
export const DEFAULT_DELIVERY_FEE = 50;

export const CURRENCY = 'Rs.';

export const isApiUrlConfigured = Boolean(fromEnv || extraUrl);
