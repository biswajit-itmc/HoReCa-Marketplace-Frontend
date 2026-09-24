'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  Building2,
  MoreVertical,
  ShieldCheck,
  Ban,
  PlayCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { suppliers as initialSuppliers } from '@/data/suppliers';
import type { Supplier } from '@/types';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suspendTarget, setSuspendTarget] = useState<Supplier | null>(null);
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesVerification =
        verificationFilter === 'all' || s.verificationStatus === verificationFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesVerification && matchesStatus;
    });
  }, [suppliers, search, verificationFilter, statusFilter]);

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleVerify = (supplier: Supplier) => {
    updateSupplier(supplier.id, { verificationStatus: 'verified', verified: true });
    toast.success(`${supplier.name} has been verified.`);
  };

  const handleActivate = (supplier: Supplier) => {
    updateSupplier(supplier.id, { status: 'active' });
    toast.success(`${supplier.name} activated.`);
  };

  const confirmSuspend = () => {
    if (!suspendTarget) return;
    updateSupplier(suspendTarget.id, { status: 'suspended' });
    toast.success(`${suspendTarget.name} has been suspended.`);
    setSuspendTarget(null);
  };

  return (
    <div>
      <PageHeader title="Suppliers" description="Verify and manage supplier accounts on the marketplace." />

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg pl-9"
              />
            </div>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-44">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
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
            icon={Building2}
            title="No suppliers found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((supplier) => (
                      <TableRow
                        key={supplier.id}
                        className="cursor-pointer"
                        onClick={() => setDetailSupplier(supplier)}
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                              {supplier.logo}
                            </div>
                            <span className="font-medium text-foreground">{supplier.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{supplier.location}</TableCell>
                        <TableCell>
                          <StatusBadge status={supplier.verificationStatus} />
                        </TableCell>
                        <TableCell>{supplier.productCount}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {supplier.rating}
                          </span>
                        </TableCell>
                        <TableCell>{supplier.totalOrders}</TableCell>
                        <TableCell>
                          <StatusBadge status={supplier.status} />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="rounded-md p-1.5 hover:bg-muted">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {supplier.verificationStatus === 'pending' && (
                                <DropdownMenuItem onClick={() => handleVerify(supplier)}>
                                  <ShieldCheck className="mr-2 h-4 w-4 text-forest-600" />
                                  Verify
                                </DropdownMenuItem>
                              )}
                              {supplier.status === 'suspended' ? (
                                <DropdownMenuItem onClick={() => handleActivate(supplier)}>
                                  <PlayCircle className="mr-2 h-4 w-4 text-forest-600" />
                                  Activate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setSuspendTarget(supplier)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend
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

      <AlertDialog open={!!suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {suspendTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove their listings from the marketplace and block new orders. You can
              reactivate them at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSuspend}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!detailSupplier} onOpenChange={(open) => !open && setDetailSupplier(null)}>
        <DialogContent className="max-w-lg">
          {detailSupplier && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700">
                    {detailSupplier.logo}
                  </div>
                  <div>
                    <DialogTitle className="font-serif">{detailSupplier.name}</DialogTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={detailSupplier.verificationStatus} />
                      <StatusBadge status={detailSupplier.status} />
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">{detailSupplier.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {detailSupplier.address}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> {detailSupplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> {detailSupplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {detailSupplier.operatingHours}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Products</p>
                    <p className="font-serif text-lg font-semibold">{detailSupplier.productCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-serif text-lg font-semibold">{detailSupplier.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="flex items-center gap-1 font-serif text-lg font-semibold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {detailSupplier.rating}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                  {detailSupplier.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs font-medium text-forest-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
