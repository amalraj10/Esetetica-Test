import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isSelected?: boolean;
}

const ProductCard = ({ product, onAddToCart, isSelected }: ProductCardProps) => {
  return (
    <div
      className={`bg-card rounded-2xl p-4 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? "ring-2 ring-accent shadow-lg scale-105" : ""
      }`}
      onClick={() => onAddToCart(product)}
    >
      <div className="aspect-square bg-secondary/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute bottom-2 right-2 bg-card rounded-full p-1.5 shadow-md">
            <Plus className="h-4 w-4 text-accent" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-foreground truncate">
        {product.name}
      </h3>
    </div>
  );
};

export default ProductCard;
