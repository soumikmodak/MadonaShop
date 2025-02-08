
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState,useEffect } from "react";
import { productCategories, type InsertProduct } from "@shared/schema";

export default function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<"furniture" | "electronics">("furniture");
  const [mrp, setMrp] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const { data: products, refetch } = useQuery({ queryKey: ['/api/products'] });

  useEffect(() => {
    if (mrp && discount) {
      const discounted = mrp - (mrp * discount / 100);
      setFinalPrice(Math.round(discounted));
    }
  }, [mrp, discount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement).files?.[0];
    
    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    formData.append('image', imageFile);
    formData.append('category', category);
    formData.append('mrp', mrp.toString());
    formData.append('discount', discount.toString());
    formData.append('finalPrice', finalPrice.toString());

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setShowForm(false);
      refetch();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button onClick={() => setShowForm(true)}>Add Product</Button>
      </div>
      
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <Input name="name" placeholder="Product Name" required />
                <Textarea name="description" placeholder="Description" required />
                <Select value={category} onValueChange={(v: "furniture" | "electronics") => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="subcategory">
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories[category].map(sub => (
                      <SelectItem key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="file" accept="image/*" className="cursor-pointer" required />
                <Input 
                  name="mrp" 
                  type="number" 
                  placeholder="MRP" 
                  value={mrp || ''} 
                  onChange={(e) => setMrp(Number(e.target.value))}
                  required 
                />
                <Input 
                  name="discount" 
                  type="number" 
                  placeholder="Discount %" 
                  value={discount || ''} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  required 
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Final Price:</span>
                  <span className="font-semibold">${finalPrice}</span>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Product</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
