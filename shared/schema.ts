import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'furniture' or 'electronics'
  subcategory: text("subcategory").notNull(),
  imageUrl: text("image_url").notNull(),
  mrp: integer("mrp").notNull(),
  discount: integer("discount").notNull(),
  finalPrice: integer("final_price").notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().$default(() => new Date().toISOString()),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export const productCategories = {
  furniture: ['beds', 'sofas', 'chairs', 'almirahs'],
  electronics: ['laptops', 'smartphones', 'tablets', 'accessories']
} as const;