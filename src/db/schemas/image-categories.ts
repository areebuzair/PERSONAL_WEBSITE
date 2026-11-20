import { text, index, snakeCase } from 'drizzle-orm/pg-core';
import { tableMetaData } from '../utils';

export const imageCategories = snakeCase.table(
  'image-categories',
  {
    ...tableMetaData,
    name: text('name').notNull().unique(),
  },
  (table) => [
    index('categories_name_idx').on(table.name),
  ]
);