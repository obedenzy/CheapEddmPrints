import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import { 
  insertUserSchema, 
  insertAddressSchema, 
  insertSavedDesignSchema,
  insertDemographicsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to parse request bodies
  app.use(express.json());

  // Error handling middleware for Zod validation errors
  const handleZodError = (err: any, req: Request, res: Response, next: Function) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationError.details 
      });
    }
    next(err);
  };

  // Authentication Routes
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Check password (in a real app, we'd use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Don't return password in response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  });

  // User Profile Routes
  app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  });

  // Address Routes
  app.get('/api/users/:userId/addresses', async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const addresses = await storage.getAddresses(userId);
    res.json(addresses);
  });

  app.post('/api/users/:userId/addresses', async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId
      });
      
      const address = await storage.createAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  });

  // Saved Designs Routes
  app.get('/api/users/:userId/designs', async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const designs = await storage.getSavedDesigns(userId);
    res.json(designs);
  });

  app.post('/api/users/:userId/designs', async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const designData = insertSavedDesignSchema.parse({
        ...req.body,
        userId
      });
      
      const design = await storage.createSavedDesign(designData);
      res.status(201).json(design);
    } catch (error) {
      next(error);
    }
  });

  // Orders Routes
  app.get('/api/users/:userId/orders', async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  app.get('/api/orders/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Get order items
    const items = await storage.getOrderItems(orderId);
    
    res.json({
      ...order,
      items
    });
  });

  app.post('/api/orders', async (req, res, next) => {
    try {
      const { order, items } = req.body;
      
      if (!order || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order and items are required" });
      }
      
      const createdOrder = await storage.createOrder(order, items);
      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  });

  // USPS Routes - Demographics data
  app.get('/api/eddm/routes', async (req, res) => {
    try {
      const routes = await storage.getDemographics();
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching EDDM routes", error: error.message });
    }
  });

  app.get('/api/eddm/routes/zip/:zipCode', async (req, res) => {
    try {
      const { zipCode } = req.params;
      
      if (!zipCode || zipCode.length < 5) {
        return res.status(400).json({ message: "Valid ZIP code is required" });
      }
      
      const routes = await storage.getDemographicsByZipCode(zipCode);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching EDDM routes", error: error.message });
    }
  });

  app.get('/api/eddm/routes/:id', async (req, res) => {
    try {
      const routeId = parseInt(req.params.id);
      
      if (isNaN(routeId)) {
        return res.status(400).json({ message: "Invalid route ID" });
      }
      
      const route = await storage.getDemographicsById(routeId);
      
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      
      res.json(route);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching EDDM route", error: error.message });
    }
  });

  app.post('/api/eddm/routes', async (req, res, next) => {
    try {
      const routeData = insertDemographicsSchema.parse(req.body);
      const route = await storage.createDemographic(routeData);
      res.status(201).json(route);
    } catch (error: any) {
      next(error);
    }
  });

  // Apply error handling middleware
  app.use(handleZodError);

  const httpServer = createServer(app);
  return httpServer;
}
