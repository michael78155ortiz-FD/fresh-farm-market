import * as Sentry from '@sentry/nextjs';

export const PERFORMANCE_SLOS = {
  pageLoad: {
    p95: 3000, // 3 seconds
    p99: 5000, // 5 seconds
  },
  apiResponse: {
    p95: 1000, // 1 second
    p99: 2000, // 2 seconds
  },
  errorRate: 0.01, // 1% max
};

// Safe span tracking that works in both Edge and Node
export async function trackOperation<T>(
  name: string,
  op: string,
  fn: () => Promise<T>
): Promise<T> {
  return await Sentry.startSpan(
    {
      name,
      op,
    },
    async () => {
      return await fn();
    }
  );
}

// Helper functions
export function trackDatabaseQuery<T>(
  queryName: string,
  fn: () => Promise<T>
): Promise<T> {
  return trackOperation(queryName, 'db.query', fn);
}

export function trackAPICall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  return trackOperation(endpoint, 'http.client', fn);
}

// Usage example:
// const users = await trackDatabaseQuery('fetch-users', () => 
//   prisma.user.findMany()
// );
