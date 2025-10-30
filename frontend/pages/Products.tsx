import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import CartItem from "@/components/CartItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProducts, syncCart, fetchCart, type Product as ApiProduct } from "@/lib/api";
import { getUserId } from "@/lib/user";

interface CartItemShape {
  product: ApiProduct;
  quantity: number;
}

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Massage Therapy");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItemShape[]>([]);

  const userId = useMemo(() => getUserId(), []);

  const { data: prodData } = useQuery({
    queryKey: ["products", selectedCategory, searchQuery],
    queryFn: () => fetchProducts({ category: selectedCategory, search: searchQuery }),
  });

  const categories = prodData?.categories ?? [];
  const allProducts = prodData?.products ?? [];

  // Load existing cart from backend for this user
  const { data: serverCart } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => fetchCart(userId),
  });

  useEffect(() => {
    if (serverCart?.items) {
      setCart(serverCart.items.map((ci) => ({ product: ci.product, quantity: ci.quantity })));
    }
  }, [serverCart]);

  const syncCartMutation = useMutation({
    mutationFn: (items: { productId: string; quantity: number }[]) => syncCart(userId, items),
  });

  // --- helpers ------------------------------------------------------------
  const toSyncItems = (list: CartItemShape[]) =>
    list.map((i) => ({ productId: i.product._id, quantity: i.quantity }));

  const applyCartUpdate = (updater: (prev: CartItemShape[]) => CartItemShape[]) => {
    setCart((prev) => {
      const updated = updater(prev);
      syncCartMutation.mutate(toSyncItems(updated));
      return updated;
    });
  };

  const filteredProducts = allProducts; // server already filtered by category/search

  const addToCart = (product: ApiProduct) => {
    applyCartUpdate((prev) => {
      const exists = prev.some((i) => i.product._id === product._id);
      return exists
        ? prev.map((i) =>
            i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    applyCartUpdate((prev) =>
      prev
        .map((i) => (i.product._id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => applyCartUpdate(() => []);

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate("/order-completion", {
        state: {
          cart: cart.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-6">Products</h2>

            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for Product !"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>

            <div className="mb-6">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.name,
                    image: product.image || "",
                    category: product.category || "",
                    price: product.price,
                  } as any}
                  onAddToCart={() => addToCart(product)}
                  isSelected={cart.some((item) => item.product._id === product._id)}
                />
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="bg-card rounded-2xl p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Product Cart</h3>
                  <button
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem
                      key={item.product._id}
                      item={{
                        id: item.product._id,
                        name: item.product.name,
                        image: item.product.image || "",
                        price: item.product.price,
                        quantity: item.quantity,
                      }}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
