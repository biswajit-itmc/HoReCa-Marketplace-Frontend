'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Eye, Power, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProductStatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatINRFull } from '@/lib/format';
import { categories } from '@/data/categories';
import type { Product } from '@/types';

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=800';

const emptyForm = {
  name: '',
  categoryId: '',
  price: '',
  unit: 'Unit',
  moq: '1',
  stock: '',
  description: '',
  image: '',
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function SellerProductsPage() {
  const { sellerProducts, addSellerProduct, updateSellerProduct } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const filtered = useMemo(
    () =>
      sellerProducts.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [sellerProducts, search, categoryFilter]
  );

  const resetForm = () => setForm(emptyForm);

  const handleAdd = () => {
    if (!form.name.trim() || !form.categoryId || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }
    const category = categories.find((c) => c.id === form.categoryId);
    const image = form.image.trim() || FALLBACK_IMAGE;
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: form.name.trim(),
      slug: slugify(form.name),
      supplierId: 'sup-1',
      supplierName: 'Royal Kitchen Equipments',
      category: category?.name ?? '',
      categoryId: form.categoryId,
      price: Number(form.price),
      unit: form.unit || 'Unit',
      moq: Number(form.moq) || 1,
      currency: 'INR',
      image,
      gallery: [image, image],
      rating: 0,
      reviewCount: 0,
      stock: Number(form.stock),
      status: 'active',
      description: form.description.trim() || 'No description provided.',
      specifications: {},
      deliveryInfo: 'Delivery timelines vary by location.',
      deliveryTime: '5-7 business days',
      location: 'Delhi',
      ordersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      trending: false,
    };
    addSellerProduct(newProduct);
    toast.success(`${newProduct.name} added to your catalogue`);
    resetForm();
    setAddOpen(false);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      categoryId: product.categoryId,
      price: String(product.price),
      unit: product.unit,
      moq: String(product.moq),
      stock: String(product.stock),
      description: product.description,
      image: product.image,
    });
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    if (!editForm.name.trim() || !editForm.categoryId || !editForm.price || !editForm.stock) {
      toast.error('Please fill in all required fields');
      return;
    }
    const category = categories.find((c) => c.id === editForm.categoryId);
    updateSellerProduct(editProduct.id, {
      name: editForm.name.trim(),
      categoryId: editForm.categoryId,
      category: category?.name ?? editProduct.category,
      price: Number(editForm.price),
      unit: editForm.unit,
      moq: Number(editForm.moq) || 1,
      stock: Number(editForm.stock),
      description: editForm.description,
      image: editForm.image.trim() || editProduct.image,
    });
    toast.success(`${editForm.name} updated`);
    setEditProduct(null);
  };

  const toggleActive = (product: Product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    updateSellerProduct(product.id, { status: nextStatus });
    toast.success(`${product.name} marked ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product catalogue.">
        <Button className="bg-forest-500 text-white hover:bg-forest-600" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Product
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={sellerProducts.length === 0 ? 'No products yet' : 'No products found'}
          description={
            sellerProducts.length === 0
              ? 'Add your first product to start selling on HoReCaConnect.'
              : 'Try adjusting your search or category filter.'
          }
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image src={product.image} alt={product.name} fill sizes="44px" className="object-cover" />
                        </div>
                        <span className="max-w-[200px] truncate font-medium text-foreground">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {formatINRFull(product.price)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={product.stock <= 15 ? 'font-medium text-amber-600' : 'text-foreground'}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{product.ordersCount}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewProduct(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleActive(product)}>
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Add Product</DialogTitle>
          </DialogHeader>
          <ProductForm form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-forest-500 text-white hover:bg-forest-600" onClick={handleAdd}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button className="bg-forest-500 text-white hover:bg-forest-600" onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={(open) => !open && setViewProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{viewProduct?.name}</DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-3">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
                <Image src={viewProduct.image} alt={viewProduct.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{viewProduct.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium text-foreground">{formatINRFull(viewProduct.price)} / {viewProduct.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-medium text-foreground">{viewProduct.stock}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MOQ</p>
                  <p className="font-medium text-foreground">{viewProduct.moq}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <ProductStatusBadge status={viewProduct.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Orders</p>
                  <p className="font-medium text-foreground">{viewProduct.ordersCount}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Description</p>
                <p className="text-sm text-foreground">{viewProduct.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProductFormProps {
  form: typeof emptyForm;
  setForm: (form: typeof emptyForm) => void;
}

function ProductForm({ form, setForm }: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Commercial 6 Burner Gas Range"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input id="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="price">Price (INR) *</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="moq">MOQ</Label>
          <Input id="moq" type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="https://images.pexels.com/..."
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
    </div>
  );
}
