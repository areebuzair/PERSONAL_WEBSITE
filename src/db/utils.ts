import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const tableMetaData = {
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'date' })
        .defaultNow()
        .notNull()
        .$onUpdate(() => sql`now()`),
}