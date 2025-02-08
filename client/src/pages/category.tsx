import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { productCategories } from "@shared/schema";

export default function Category() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category;
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products/category', category, selectedSubcategory],
    queryFn: async () => {
      const url = `/api/products/category/${category}${
        selectedSubcategory ? `?subcategory=${selectedSubcategory}` : ''
      }`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch category products');
      }
      return res.json();
    },
    enabled: !!category
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[300px]" />
      ))}
    </div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  const subcategories = productCategories[category as keyof typeof productCategories] || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#1F2937] capitalize">{category}</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              !selectedSubcategory ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'
            } text-sm`}
            onClick={() => setSelectedSubcategory(undefined)}
          >
            All
          </button>
          {subcategories.map(sub => (
            <button
              key={sub}
              className={`px-4 py-2 rounded-md ${
                selectedSubcategory === sub ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'
              } text-sm capitalize`}
              onClick={() => setSelectedSubcategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}