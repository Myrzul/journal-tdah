import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Schéma minimal de phase 1 : sert uniquement à valider la connexion Neon
 * et la chaîne drizzle-kit. Le schéma applicatif complet sera défini en phase 3
 * (auth) et phase 4 (entrées de journal).
 */
export const healthcheck = pgTable("healthcheck", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
