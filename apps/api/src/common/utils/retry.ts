/**
 * Retry com backoff exponencial e jitter.
 * Use em todas as chamadas a APIs externas (HttpProvider).
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (err: unknown) => boolean;
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 200, maxDelayMs = 3_000, shouldRetry = () => true } = opts;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts || !shouldRetry(err)) break;
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const jitter = delay * 0.3 * Math.random();
      await new Promise<void>((r) => setTimeout(r, delay + jitter));
    }
  }
  throw lastError;
}
