import { Minus, Plus } from "lucide-react";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartItem = ({ item, onUpdateQuantity }: CartItemProps) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-12 w-12 rounded-lg bg-secondary/50 flex-shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">
          {item.name}
        </h4>
        <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="h-6 w-6 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="h-6 w-6 rounded-md bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
