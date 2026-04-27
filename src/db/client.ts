import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl =
  process.env.DATABASE_URL ??
  (process.env.NODE_ENV === 'production'
    ? undefined
    : 'postgres://postgres:postgres@localhost:5432/todayshop');

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required in production.');
}

const client = postgres(databaseUrl, {
  max: 5,
  prepare: false,
});

export const db = drizzle(client, { schema });
