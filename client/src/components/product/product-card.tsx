import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 sm:h-48 object-cover"
      />
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-lg text-[#1F2937]">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">MRP:</span>
            <span className="line-through">${product.mrp}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#E11D48]">
              {product.discount}% OFF
            </span>
            <span className="font-bold text-lg">
              ${product.finalPrice}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <button className="w-full bg-[#1E3A8A] text-white py-2 rounded-md hover:bg-[#1E3A8A]/90 transition-colors">
          Add to Cart
        </button>
      </CardFooter>
    </Card>
  );
}
