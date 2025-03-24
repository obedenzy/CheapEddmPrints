import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Addresses table
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  company: text("company"),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  isDefault: boolean("is_default").default(false),
});

// Saved designs table
export const savedDesigns = pgTable("saved_designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  frontImageUrl: text("front_image_url").notNull(),
  backImageUrl: text("back_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  billingAddress: jsonb("billing_address").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  paperType: text("paper_type").notNull(),
  finishType: text("finish_type").notNull(),
  printType: text("print_type").notNull(),
  indiciaOption: text("indicia_option").notNull(),
  frontImageUrl: text("front_image_url"),
  backImageUrl: text("back_image_url"),
  uspsRoutes: jsonb("usps_routes"),
  pricePerPiece: decimal("price_per_piece", { precision: 10, scale: 4 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Demographics table for USPS EDDM routes
export const demographics = pgTable("demographics", {
  id: serial("id").primaryKey(),
  routeId: varchar("route_id", { length: 50 }).notNull().unique(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  routeName: text("route_name").notNull(),
  city: text("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  residentialAddresses: integer("residential_addresses").notNull(),
  businessAddresses: integer("business_addresses").default(0),
  totalAddresses: integer("total_addresses").notNull(),
  averageIncome: decimal("average_income", { precision: 10, scale: 2 }),
  populationDensity: decimal("population_density", { precision: 10, scale: 2 }),
  geographicArea: decimal("geographic_area", { precision: 10, scale: 2 }),
  routeType: varchar("route_type", { length: 20 }).default('residential'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});

export const insertSavedDesignSchema = createInsertSchema(savedDesigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertDemographicsSchema = createInsertSchema(demographics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create types from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type InsertSavedDesign = z.infer<typeof insertSavedDesignSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertDemographics = z.infer<typeof insertDemographicsSchema>;

export type User = typeof users.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type SavedDesign = typeof savedDesigns.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Demographic = typeof demographics.$inferSelect;
