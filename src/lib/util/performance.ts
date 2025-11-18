/**
 * Performance Optimization Utilities
 *
 * INDUSTRY BEST PRACTICES for performance optimization:
 * - Debouncing for user input
 * - Throttling for frequent events
 * - Memoization helpers
 * - Deep comparison utilities
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * Perfect for search inputs, resize events, etc.
 *
 * @param func - The function to debounce
 * @param wait - The wait time in milliseconds (default: 300ms)
 * @returns Debounced function
 *
 * @example
 * const debouncedSearch = debounce((searchTerm: string) => {
 *   fetchResults(searchTerm);
 * }, 500);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Debounce with Promise support - returns a promise that resolves with the result
 * Useful for async operations
 *
 * @example
 * const search = debounceAsync(async (term: string) => {
 *   return await api.get(`/search?q=${term}`);
 * }, 500);
 *
 * search('test').then(results => console.log(results));
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let resolveFunc: ((value: any) => void) | null = null;

  return function debouncedAsync(...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If there's a pending promise, resolve it with the new one
      resolveFunc = resolve;

      timeoutId = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
}

/**
 * Throttle function - limits execution to once per wait period
 * Perfect for scroll events, mouse move, etc.
 *
 * @param func - The function to throttle
 * @param wait - The wait time in milliseconds (default: 100ms)
 * @returns Throttled function
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 100
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }

    return lastResult;
  };
}

/**
 * Deep equality check for objects and arrays
 * Useful for dependency arrays in React hooks
 *
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns true if objects are deeply equal
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Shallow equality check for objects
 * Faster than deep equality, use when you know objects are not nested
 *
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns true if objects are shallowly equal
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

/**
 * Memoize function results based on arguments
 * Caches the result of expensive function calls
 *
 * @param func - The function to memoize
 * @param resolver - Optional custom resolver for cache key
 * @returns Memoized function
 *
 * @example
 * const expensiveCalc = memoize((a: number, b: number) => {
 *   // expensive calculation
 *   return a * b;
 * });
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Create a rate limiter for API calls
 * Ensures no more than maxCalls in timeWindow milliseconds
 *
 * @param maxCalls - Maximum number of calls allowed
 * @param timeWindow - Time window in milliseconds
 * @returns Rate limiter function
 *
 * @example
 * const rateLimiter = createRateLimiter(5, 1000); // 5 calls per second
 * rateLimiter(() => apiCall());
 */
export function createRateLimiter(maxCalls: number, timeWindow: number) {
  const calls: number[] = [];

  return async <T>(func: () => Promise<T>): Promise<T> => {
    const now = Date.now();

    // Remove calls outside the time window
    const validCalls = calls.filter(time => now - time < timeWindow);

    if (validCalls.length >= maxCalls) {
      // Wait until the oldest call expires
      const oldestCall = Math.min(...validCalls);
      const waitTime = timeWindow - (now - oldestCall);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    calls.length = 0;
    calls.push(...validCalls, now);

    return func();
  };
}

/**
 * Batch multiple requests into a single call
 * Useful for reducing API calls when multiple components request the same data
 *
 * @param batchFn - Function that processes a batch of requests
 * @param delay - Delay before executing batch (in milliseconds)
 * @returns Batched function
 */
export function createBatcher<T, R>(
  batchFn: (items: T[]) => Promise<R[]>,
  delay: number = 10
) {
  let batch: T[] = [];
  let timeoutId: NodeJS.Timeout | null = null;
  const promises: Array<{
    resolve: (value: R) => void;
    reject: (reason: any) => void;
  }> = [];

  const executeBatch = async () => {
    const currentBatch = [...batch];
    const currentPromises = [...promises];

    batch = [];
    promises.length = 0;
    timeoutId = null;

    try {
      const results = await batchFn(currentBatch);
      results.forEach((result, index) => {
        currentPromises[index].resolve(result);
      });
    } catch (error) {
      currentPromises.forEach(promise => {
        promise.reject(error);
      });
    }
  };

  return (item: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      batch.push(item);
      promises.push({ resolve, reject });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(executeBatch, delay);
    });
  };
}

/**
 * Format bytes to human-readable string
 * Useful for file sizes, bundle sizes, etc.
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Measure execution time of a function
 * Useful for performance profiling
 */
export async function measurePerformance<T>(
  name: string,
  func: () => Promise<T> | T
): Promise<T> {
  const start = performance.now();

  try {
    const result = await func();
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === 'development') {
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`);
    }

    throw error;
  }
}
