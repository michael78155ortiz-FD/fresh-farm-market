import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Lazy initialization
let _redis: Redis | null = null;
let _checkoutRateLimit: Ratelimit | null = null;
let _fileUploadRateLimit: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn('Missing Upstash Redis credentials - rate limiting disabled');
    return null;
  }
  
  _redis = new Redis({ url, token });
  return _redis;
}

// Mock rate limiter for when Redis is not configured
const mockRateLimit = {
  limit: async () => ({ success: true, limit: 10, remaining: 10, reset: Date.now() })
};

export const checkoutRateLimit = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    const redis = getRedis();
    if (!redis) return mockRateLimit[prop as keyof typeof mockRateLimit];
    
    if (!_checkoutRateLimit) {
      _checkoutRateLimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        analytics: true,
        prefix: 'ratelimit:checkout',
      });
    }
    return _checkoutRateLimit[prop as keyof Ratelimit];
  }
});

export const fileUploadRateLimit = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    const redis = getRedis();
    if (!redis) return mockRateLimit[prop as keyof typeof mockRateLimit];
    
    if (!_fileUploadRateLimit) {
      _fileUploadRateLimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        analytics: true,
        prefix: 'ratelimit:file-upload',
      });
    }
    return _fileUploadRateLimit[prop as keyof Ratelimit];
  }
});
