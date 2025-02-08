import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import Home from "@/pages/home";
import Category from "@/pages/category";
import SearchResults from "@/pages/search";
import AdminLogin from "@/pages/admin/login";
import AdminProducts from "@/pages/admin/products";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:category" component={Category} />
      <Route path="/search" component={SearchResults} />
      <Route path="/admin" exact component={AdminLogin} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;