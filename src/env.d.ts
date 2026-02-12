// =============================================================================
// HaruKorean (하루국어) - Cloudflare Environment Type Definitions
// =============================================================================

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
    served_by: string;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Augment the global CloudflareEnv interface declared by @opennextjs/cloudflare
interface CloudflareEnv {
  DB: D1Database;
  JWT_SECRET: string;
  GEMINI_API_KEY: string;
  ASSETS: { fetch: typeof fetch };
}
