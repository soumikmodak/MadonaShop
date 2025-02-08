import { Link } from "wouter";
import { SearchBar } from "./search-bar";

export default function Navbar() {
  return (
    <nav className="bg-[#1E3A8A] text-white">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-xl font-bold">Madona</a>
          </Link>
          
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="flex gap-6">
            <Link href="/category/furniture">
              <a className="hover:text-[#FBBF24]">Furniture</a>
            </Link>
            <Link href="/category/electronics">
              <a className="hover:text-[#FBBF24]">Electronics</a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
