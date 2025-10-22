import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Lazy initialization to avoid build-time crashes
let _redis: Redis | null = null;

function getRedis(): Redis {
  if (_redis) return _redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
    );
  }
  
  _redis = new Redis({ url, token });
  return _redis;
}

// Rate limiter instances (lazy-initialized)
export function getVendorApplicationRateLimit() {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(3, '15 m'), // 3 requests per 15 minutes
    analytics: true,
    prefix: 'ratelimit:vendor-application',
  });
}

export function getFileUploadRateLimit() {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 uploads per hour
    analytics: true,
    prefix: 'ratelimit:file-upload',
  });
}

// Usage in API route:
// const rateLimit = getVendorApplicationRateLimit();
// const { success } = await rateLimit.limit(identifier);
// if (!success) return new Response('Too many requests', { status: 429 });
