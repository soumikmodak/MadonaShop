import { type Product } from "@shared/schema";

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];
  const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    if (res.status === 400) return [];
    throw new Error("Failed to search products");
  }
  return res.json();
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`/api/products/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}