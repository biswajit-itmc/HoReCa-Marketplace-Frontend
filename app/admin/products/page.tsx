'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Package, MoreVertical, PlayCircle, Ban } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProductStatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { products as initialProducts } from '@/data/products';
import { categories } from '@/data/categories';
import { suppliers } from '@/data/suppliers';
import { formatINRFull } from '@/lib/format';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
      const matchesSupplier = supplierFilter === 'all' || p.supplierId === supplierFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
    });
  }, [products, search, categoryFilter, supplierFilter, statusFilter]);

  const toggleStatus = (product: Product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
    );
    toast.success(
      nextStatus === 'active'
        ? `${product.name} activated and visible in marketplace.`
        : `${product.name} deactivated and hidden from marketplace.`
    );
  };

  return (
    <div>
      <PageHeader title="Products" description="Oversee the full product catalogue across all suppliers." />

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-48">
                <SelectValue placeholder="Category" />
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
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-52">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="max-w-[220px] truncate font-medium text-foreground">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{product.supplierName}</TableCell>
                        <TableCell className="whitespace-nowrap">{product.category}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatINRFull(product.price)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <ProductStatusBadge status={product.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="rounded-md p-1.5 hover:bg-muted">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {product.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => toggleStatus(product)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => toggleStatus(product)}>
                                  <PlayCircle className="mr-2 h-4 w-4 text-forest-600" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
