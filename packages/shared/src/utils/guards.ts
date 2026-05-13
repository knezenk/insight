/**
 * Type guards reutilizáveis.
 */
export function isString(v: unknown): v is string {
  return typeof v === 'string';
}

export function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isNonEmptyArray<T>(v: unknown): v is [T, ...T[]] {
  return Array.isArray(v) && v.length > 0;
}
