import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

declare module "express-session" {
  interface SessionData {
    adminId?: number;
  }
}

export function registerRoutes(app: Express): Server {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    })
  );

  // Admin authentication middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Regular product routes
  app.get("/api/products", async (req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const { category } = req.params;
    const { subcategory } = req.query;
    const products = await storage.getProductsByCategory(
      category, 
      subcategory?.toString()
    );
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const query = req.query.q?.toString() || '';
    if (!query.trim()) {
      return res.status(400).json({ message: "Search query required" });
    }
    const products = await storage.searchProducts(query);
    res.json(products);
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await storage.getAdminByUsername(username);

    if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.adminId = admin.id;
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/admin/logout", requireAdmin, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.post("/api/admin/products", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const imageUrl = `/uploads/${req.file?.filename}`;
      const product = await storage.createProduct({
        ...req.body,
        imageUrl
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(Number(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(Number(req.params.id));
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}