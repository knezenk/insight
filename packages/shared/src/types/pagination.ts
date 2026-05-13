/**
 * Cursor-based ou offset-based pagination.
 * Convencionamos offset por simplicidade no MVP — cursor pode ser
 * adicionado depois sem breaking change pelo discriminador `mode`.
 */
export interface Pagination {
  page: number;
  pageSize: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 200;
