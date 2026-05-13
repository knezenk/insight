import crypto from 'node:crypto';

/**
 * Gera chave determinística e curta para cache, ignorando ordem de
 * propriedades. Use para qualquer payload de filtro complexo.
 */
export function buildCacheKey(scope: string, payload: unknown): string {
  const normalized = JSON.stringify(payload, Object.keys(payload as object).sort());
  const hash = crypto.createHash('sha1').update(normalized).digest('hex').slice(0, 16);
  return `${scope}:${hash}`;
}
