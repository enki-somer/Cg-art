interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitInfo>();
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "5");
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes

export async function rateLimit(ip: string) {
  const now = Date.now();
  const info = store.get(ip);

  if (!info) {
    store.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { success: true };
  }

  if (now > info.resetTime) {
    store.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { success: true };
  }

  if (info.count >= MAX_REQUESTS) {
    return { success: false };
  }

  info.count += 1;
  return { success: true };
} 