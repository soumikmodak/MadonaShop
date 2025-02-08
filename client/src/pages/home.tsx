
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [sortBy, setSortBy] = useState<string>("default");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products']
  });

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.finalPrice - b.finalPrice;
      case "price-desc":
        return b.finalPrice - a.finalPrice;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[300px]" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">Featured Products</h1>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProductGrid products={sortedProducts} />
    </div>
  );
}
