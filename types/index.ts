export type Role = 'buyer' | 'seller' | 'admin' | 'guest';

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash on Delivery' | 'Credit / Pay Later';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  logo: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  categories: string[];
  yearsInBusiness: number;
  established: number;
  description: string;
  serviceArea: string;
  operatingHours: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  responseTime: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  supplierId: string;
  supplierName: string;
  category: string;
  categoryId: string;
  price: number;
  unit: string;
  moq: number;
  currency: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  status: ProductStatus;
  description: string;
  specifications: Record<string, string>;
  deliveryInfo: string;
  deliveryTime: string;
  location: string;
  ordersCount: number;
  createdAt: string;
  trending: boolean;
  discount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  supplierId: string;
  supplierName: string;
  price: number;
  unit: string;
  moq: number;
  quantity: number;
  image: string;
  category: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  supplierId: string;
  supplierName: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  date: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  buyerPhone: string;
  buyerEmail: string;
  timeline: OrderTimelineEvent[];
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  completed: boolean;
  date?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  supplierId: string;
  supplierName: string;
  buyerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'product' | 'offer' | 'system' | 'payment';
  title: string;
  message: string;
  date: string;
  read: boolean;
  role: Role | 'all';
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  bgClass: string;
  role: 'buyer' | 'seller' | 'all';
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  city: string;
  address: string;
  gstin: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  savedSuppliers: string[];
}

export interface Review {
  id: string;
  productId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  location: string;
}
