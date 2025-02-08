import { type Product, type InsertProduct, type Admin, type InsertAdmin } from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string, subcategory?: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private products: Product[];
  private admins: Admin[];

  constructor() {
    this.admins = [];
    // Initialize the default admin account
    this.initializeDefaultAdmin();

    // Initialize with mock data using stock photos
    this.products = [
      {
        id: 1,
        name: "Modern Sofa",
        description: "Elegant and comfortable modern sofa",
        category: "furniture",
        subcategory: "sofas",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        mrp: 999,
        discount: 10,
        finalPrice: 899
      },
      {
        id: 2,
        name: "Premium Bed",
        description: "Luxurious king-size bed",
        category: "furniture",
        subcategory: "beds",
        imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd",
        mrp: 1499,
        discount: 15,
        finalPrice: 1274
      },
      {
        id: 3,
        name: "Minimalist Chair",
        description: "Stylish dining chair",
        category: "furniture",
        subcategory: "chairs",
        imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
        mrp: 199,
        discount: 5,
        finalPrice: 189
      },
      {
        id: 4,
        name: "Premium Laptop",
        description: "High-performance laptop",
        category: "electronics",
        subcategory: "laptops",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        mrp: 1999,
        discount: 20,
        finalPrice: 1599
      },
      {
        id: 5,
        name: "Smartphone",
        description: "Latest smartphone model",
        category: "electronics",
        subcategory: "smartphones",
        imageUrl: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923",
        mrp: 999,
        discount: 10,
        finalPrice: 899
      }
    ];
  }

  private async initializeDefaultAdmin() {
    const defaultAdmin = {
      username: 'admin',
      passwordHash: 'admin123'
    };

    // Only create if no admin exists
    const existingAdmin = await this.getAdminByUsername(defaultAdmin.username);
    if (!existingAdmin) {
      await this.createAdmin(defaultAdmin);
      console.log('Default admin account created');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductsByCategory(category: string, subcategory?: string): Promise<Product[]> {
    return this.products.filter(p => 
      p.category === category && 
      (!subcategory || p.subcategory === subcategory)
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase().trim();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = {
      ...product,
      id: this.products.length + 1,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    this.products[index] = {
      ...this.products[index],
      ...update,
    };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    this.products.splice(index, 1);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return this.admins.find(a => a.username === username);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const passwordHash = await bcrypt.hash(admin.passwordHash, 10);
    const newAdmin = {
      id: this.admins.length + 1,
      username: admin.username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }
}

export const storage = new MemStorage();