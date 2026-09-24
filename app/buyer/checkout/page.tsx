'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, MapPin, Building2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { mockBuyer } from '@/data/mock';
import { formatINRFull, generateOrderId } from '@/lib/format';
import type { Order, OrderItem, PaymentMethod, PaymentStatus } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FREE_DELIVERY_THRESHOLD = 100000;
const DELIVERY_FEE = 1500;
const GST_RATE = 0.18;

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'Cash on Delivery', label: 'Cash on Delivery' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Credit / Pay Later', label: 'Credit / Pay Later' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, addOrder, clearCart, addNotification } = useApp();

  const [businessName, setBusinessName] = useState(mockBuyer.businessName);
  const [gstin, setGstin] = useState(mockBuyer.gstin);
  const [phone, setPhone] = useState(mockBuyer.phone);
  const [email, setEmail] = useState(mockBuyer.email);
  const [address, setAddress] = useState(mockBuyer.address);
  const [city, setCity] = useState(mockBuyer.city);
  const [pincode, setPincode] = useState('110001');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartTotal;
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Checkout" />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add products to your cart before proceeding to checkout."
          actionLabel="Browse Marketplace"
          actionHref="/buyer/marketplace"
        />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!businessName || !gstin || !phone || !email || !address || !city || !pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);

    // Note: carts can theoretically contain items from multiple suppliers.
    // For this prototype we simplify to a single order using the first
    // cart item's supplier — a real marketplace would split this into
    // one order per supplier.
    const first = cart[0];
    const items: OrderItem[] = cart.map((c) => ({
      productId: c.productId,
      name: c.name,
      supplierId: c.supplierId,
      supplierName: c.supplierName,
      price: c.price,
      unit: c.unit,
      quantity: c.quantity,
      image: c.image,
    }));

    const today = new Date().toISOString().split('T')[0];
    const paymentStatus: PaymentStatus = paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid';

    const order: Order = {
      id: generateOrderId(),
      buyerId: mockBuyer.id,
      buyerName: mockBuyer.businessName,
      supplierId: first.supplierId,
      supplierName: first.supplierName,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'placed',
      paymentStatus,
      paymentMethod,
      date: today,
      deliveryAddress: address,
      deliveryCity: city,
      deliveryPincode: pincode,
      buyerPhone: phone,
      buyerEmail: email,
      timeline: [
        { status: 'placed', label: 'Order Placed', completed: true, date: today },
        { status: 'accepted', label: 'Order Accepted', completed: false },
        { status: 'packed', label: 'Packed', completed: false },
        { status: 'dispatched', label: 'Dispatched', completed: false },
        { status: 'delivered', label: 'Delivered', completed: false },
      ],
    };

    addOrder(order);
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'order',
      title: 'New Order Received',
      message: `You have received a new order ${order.id} from ${mockBuyer.businessName}.`,
      date: today,
      read: false,
      role: 'seller',
    });
    clearCart();
    toast.success('Order placed successfully!');
    router.push(`/buyer/orders/${order.id}?success=1`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Checkout" description="Review and confirm your order details" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-forest-600" /> Business Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gstin">GSTIN *</Label>
                <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <MapPin className="h-5 w-5 text-forest-600" /> Delivery Address
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <ShoppingBag className="h-5 w-5 text-forest-600" /> Order Summary
            </h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.supplierName} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-foreground">
                    {formatINRFull(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <CreditCard className="h-5 w-5 text-forest-600" /> Payment Method
            </h2>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              {paymentMethods.map((pm) => (
                <label
                  key={pm.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-forest-500 has-[[data-state=checked]]:bg-forest-50"
                >
                  <RadioGroupItem value={pm.value} id={pm.value} />
                  <span className="text-sm font-medium text-foreground">{pm.label}</span>
                </label>
              ))}
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">
              This is a prototype checkout — no real payment integration is performed.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg font-semibold text-foreground">Payable Amount</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatINRFull(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-foreground">
                  {deliveryFee === 0 ? 'Free' : formatINRFull(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium text-foreground">{formatINRFull(tax)}</span>
              </div>
              <div className="my-2 border-t border-border" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-serif font-bold text-foreground">{formatINRFull(total)}</span>
              </div>
            </div>
            <Button
              className="mt-5 w-full bg-forest-500 text-white hover:bg-forest-600"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
