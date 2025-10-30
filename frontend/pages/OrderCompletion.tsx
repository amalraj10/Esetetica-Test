import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Edit, Trash2, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createAppointment, previewAppointment, type AppointmentResponse } from "@/lib/api";
import { getUserId } from "@/lib/user";

const OrderCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const localCart = location.state?.cart || [] as { productId: string; quantity: number }[];
  const userId = useMemo(() => getUserId(), []);

  const [serviceTotal] = useState<number>(1800);
  const [discount] = useState<number>(0);
  const [preview, setPreview] = useState<AppointmentResponse | null>(null);

  useEffect(() => {
    if (!localCart || localCart.length === 0) return;
    const loadPreview = async () => {
      try {
        const data = await previewAppointment({
          items: localCart,
          serviceTotal,
          discount,
        });
        setPreview(data);
      } catch {
        setPreview(null);
      }
    };
    void loadPreview();
  }, [localCart, serviceTotal, discount]);

  if (!localCart || localCart.length === 0) {
    navigate("/");
    return null;
  }

  const createMutation = useMutation<AppointmentResponse, Error, void>({
    mutationFn: () =>
      createAppointment({
        userId,
        items: localCart,
        serviceTotal,
        discount,
      }),
    onSuccess: (res) => {
      toast.success(`Payment completed`, {
        description: `Invoice ${res.invoiceNumber} · Total ₹${res.finalTotal.toFixed(2)}`,
      });
      navigate("/");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-6">
        <div className="bg-accent/10 border-2 border-accent rounded-lg px-4 py-3 mb-6 inline-block">
          <h2 className="text-lg font-semibold text-foreground">
            Order Completion
          </h2>
          <p className="text-sm text-muted-foreground">
            Booking Summary - APT-001
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-xs text-background">✓</span>
              </div>
              <h3 className="text-lg font-semibold">Products Used</h3>
            </div>

            <div className="space-y-6">
              {preview?.items?.map((item: any) => (
                <div
                  key={item.product._id}
                  className="border border-border rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <div className="flex gap-2">
                      <button className="text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Unit Price</p>
                      <p className="font-medium">₹{item.unitPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total</p>
                      <p className="font-medium">₹{item.total}</p>
                    </div>
                  </div>

                  <button className="mt-3 text-sm text-accent flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Special Discount
                  </button>
                </div>
              ))}

              <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium hover:border-accent hover:text-accent transition-colors">
                + Add Extra Products
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Billing Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Total</span>
                <span className="font-medium">₹{serviceTotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product Total</span>
                <span className="font-medium">₹{preview?.productTotal ?? 0}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Discount (%)</span>
                <Input
                  type="number"
                  value={discount}
                  className="w-20 h-8 text-right"
                  readOnly
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="font-medium">₹{(preview?.taxAmount ?? 0).toFixed(2)}</span>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Final Total</span>
                  <span>₹{(preview?.finalTotal ?? 0).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
                onClick={() => createMutation.mutate()}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Complete Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletion;
