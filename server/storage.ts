import { 
  users, type User, type InsertUser,
  addresses, type Address, type InsertAddress,
  savedDesigns, type SavedDesign, type InsertSavedDesign,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Address methods
  getAddresses(userId: number): Promise<Address[]>;
  getAddress(id: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  
  // Saved designs methods
  getSavedDesigns(userId: number): Promise<SavedDesign[]>;
  getSavedDesign(id: number): Promise<SavedDesign | undefined>;
  createSavedDesign(design: InsertSavedDesign): Promise<SavedDesign>;
  updateSavedDesign(id: number, design: Partial<InsertSavedDesign>): Promise<SavedDesign | undefined>;
  deleteSavedDesign(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  
  // Order items methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Address methods
  async getAddresses(userId: number): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }
  
  async getAddress(id: number): Promise<Address | undefined> {
    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    return address;
  }
  
  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const [address] = await db
      .insert(addresses)
      .values(insertAddress)
      .returning();
    return address;
  }
  
  async updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined> {
    const [updatedAddress] = await db
      .update(addresses)
      .set(address)
      .where(eq(addresses.id, id))
      .returning();
    return updatedAddress;
  }
  
  async deleteAddress(id: number): Promise<boolean> {
    const result = await db
      .delete(addresses)
      .where(eq(addresses.id, id))
      .returning({ id: addresses.id });
    return result.length > 0;
  }
  
  // Saved designs methods
  async getSavedDesigns(userId: number): Promise<SavedDesign[]> {
    return await db.select().from(savedDesigns).where(eq(savedDesigns.userId, userId));
  }
  
  async getSavedDesign(id: number): Promise<SavedDesign | undefined> {
    const [design] = await db.select().from(savedDesigns).where(eq(savedDesigns.id, id));
    return design;
  }
  
  async createSavedDesign(insertDesign: InsertSavedDesign): Promise<SavedDesign> {
    const [design] = await db
      .insert(savedDesigns)
      .values(insertDesign)
      .returning();
    return design;
  }
  
  async updateSavedDesign(id: number, design: Partial<InsertSavedDesign>): Promise<SavedDesign | undefined> {
    const [updatedDesign] = await db
      .update(savedDesigns)
      .set({ ...design, updatedAt: new Date() })
      .where(eq(savedDesigns.id, id))
      .returning();
    return updatedDesign;
  }
  
  async deleteSavedDesign(id: number): Promise<boolean> {
    const result = await db
      .delete(savedDesigns)
      .where(eq(savedDesigns.id, id))
      .returning({ id: savedDesigns.id });
    return result.length > 0;
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }
  
  async createOrder(insertOrder: InsertOrder, orderItemsToInsert: InsertOrderItem[]): Promise<Order> {
    // Generate order number
    const orderData = {
      ...insertOrder,
      orderNumber: `EDDM-${nanoid(6).toUpperCase()}`
    };
    
    // Create transaction to ensure both order and order items are saved
    const [order] = await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values(orderData)
        .returning();
      
      // Add order ID to order items
      const itemsWithOrderId = orderItemsToInsert.map(item => ({
        ...item,
        orderId: newOrder.id
      }));
      
      // Insert all order items
      await tx
        .insert(orderItems)
        .values(itemsWithOrderId);
      
      return [newOrder];
    });
    
    return order;
  }
  
  // Order items methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private addresses: Map<number, Address>;
  private savedDesigns: Map<number, SavedDesign>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private currentUserId: number;
  private currentAddressId: number;
  private currentDesignId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.addresses = new Map();
    this.savedDesigns = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentUserId = 1;
    this.currentAddressId = 1;
    this.currentDesignId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Address methods
  async getAddresses(userId: number): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(
      (address) => address.userId === userId,
    );
  }

  async getAddress(id: number): Promise<Address | undefined> {
    return this.addresses.get(id);
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = this.currentAddressId++;
    const address: Address = { ...insertAddress, id };
    this.addresses.set(id, address);
    return address;
  }

  async updateAddress(id: number, addressUpdate: Partial<InsertAddress>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...addressUpdate };
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }

  async deleteAddress(id: number): Promise<boolean> {
    return this.addresses.delete(id);
  }

  // Saved designs methods
  async getSavedDesigns(userId: number): Promise<SavedDesign[]> {
    return Array.from(this.savedDesigns.values()).filter(
      (design) => design.userId === userId,
    );
  }

  async getSavedDesign(id: number): Promise<SavedDesign | undefined> {
    return this.savedDesigns.get(id);
  }

  async createSavedDesign(insertDesign: InsertSavedDesign): Promise<SavedDesign> {
    const id = this.currentDesignId++;
    const now = new Date();
    const design: SavedDesign = { 
      ...insertDesign, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.savedDesigns.set(id, design);
    return design;
  }

  async updateSavedDesign(id: number, designUpdate: Partial<InsertSavedDesign>): Promise<SavedDesign | undefined> {
    const design = this.savedDesigns.get(id);
    if (!design) return undefined;
    
    const updatedDesign = { 
      ...design, 
      ...designUpdate,
      updatedAt: new Date()
    };
    this.savedDesigns.set(id, updatedDesign);
    return updatedDesign;
  }

  async deleteSavedDesign(id: number): Promise<boolean> {
    return this.savedDesigns.delete(id);
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber,
    );
  }

  async createOrder(insertOrder: InsertOrder, orderItemsToInsert: InsertOrderItem[]): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id,
      orderNumber: `EDDM-${nanoid(6).toUpperCase()}`,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, order);
    
    // Create order items
    const items: OrderItem[] = orderItemsToInsert.map(item => {
      const itemId = this.currentOrderItemId++;
      return { ...item, id, orderId: id };
    });
    
    this.orderItems.set(id, items);
    
    return order;
  }

  // Order items methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }
}

// Always use DatabaseStorage since we have a PostgreSQL database available
export const storage = new DatabaseStorage();
