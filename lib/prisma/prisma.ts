import pgvector from '@prisma/orm-extension-pgvector/runtime';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './schema';
import contractJson from './schema.json' with { type: 'json' };

export const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env['DATABASE_URL']!,
  extensions: [pgvector],
});

