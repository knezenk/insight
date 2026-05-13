/**
 * Tokens de injeção. Sempre que precisar resolver o provider correto
 * (mock vs http) injete pelo token, nunca pela classe concreta.
 */
export const CLIPPING_PROVIDER = Symbol('CLIPPING_PROVIDER');
export const SCORES_PROVIDER = Symbol('SCORES_PROVIDER');
export const NARRATIVES_PROVIDER = Symbol('NARRATIVES_PROVIDER');
export const INFLUENCERS_PROVIDER = Symbol('INFLUENCERS_PROVIDER');
export const COMPETITIVE_PROVIDER = Symbol('COMPETITIVE_PROVIDER');
export const ALERTS_PROVIDER = Symbol('ALERTS_PROVIDER');
