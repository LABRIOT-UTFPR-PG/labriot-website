interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  namespace: string;
  maxRequests: number;
  windowMs: number;
}

const MAX_STORE_ENTRIES = 5000;
const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(namespace: string): Map<string, RateLimitEntry> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map<string, RateLimitEntry>();
    stores.set(namespace, store);
  }
  return store;
}

function pruneExpired(store: Map<string, RateLimitEntry>, now: number) {
  if (store.size < MAX_STORE_ENTRIES) return;
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
  // Se ainda estiver acima do limite, remove os mais antigos
  if (store.size >= MAX_STORE_ENTRIES) {
    const excess = store.size - Math.floor(MAX_STORE_ENTRIES / 2);
    let removed = 0;
    for (const key of store.keys()) {
      store.delete(key);
      removed++;
      if (removed >= excess) break;
    }
  }
}

export function getClientIp(headersList: Headers): string {
  // Em produção atrás do Nginx na OCI, X-Real-IP é definido pelo proxy como $remote_addr
  const cfIp = headersList.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  const realIp = headersList.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = headersList.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;

  return 'unknown';
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const store = getStore(options.namespace);
  pruneExpired(store, now);

  const record = store.get(identifier);

  if (record && now < record.resetAt) {
    if (record.count >= options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
      };
    }
    record.count += 1;
    return {
      allowed: true,
      remaining: Math.max(0, options.maxRequests - record.count),
      retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  store.set(identifier, { count: 1, resetAt: now + options.windowMs });
  return {
    allowed: true,
    remaining: Math.max(0, options.maxRequests - 1),
    retryAfterSeconds: Math.ceil(options.windowMs / 1000),
  };
}
