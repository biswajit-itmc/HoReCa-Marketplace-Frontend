'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Users as UsersIcon, MoreVertical, CheckCircle2, Ban, PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { adminUsers as initialAdminUsers } from '@/data/mock';
import { formatDate } from '@/lib/format';
import type { AdminUser } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const setStatus = (id: string, status: AdminUser['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const handleApprove = (user: AdminUser) => {
    setStatus(user.id, 'active');
    toast.success(`${user.name} approved and activated.`);
  };

  const handleActivate = (user: AdminUser) => {
    setStatus(user.id, 'active');
    toast.success(`${user.name} activated.`);
  };

  const confirmSuspend = () => {
    if (!suspendTarget) return;
    setStatus(suspendTarget.id, 'suspended');
    toast.success(`${suspendTarget.name} has been suspended.`);
    setSuspendTarget(null);
  };

  return (
    <div>
      <PageHeader title="Users" description="Manage buyer and seller accounts on the platform." />

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full rounded-lg sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
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
            icon={UsersIcon}
            title="No users found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-forest-100 text-xs font-medium text-forest-700">
                                {user.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{user.location}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(user.joinedDate)}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="rounded-md p-1.5 hover:bg-muted">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleApprove(user)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-forest-600" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {user.status === 'suspended' ? (
                                <DropdownMenuItem onClick={() => handleActivate(user)}>
                                  <PlayCircle className="mr-2 h-4 w-4 text-forest-600" />
                                  Activate
                                </DropdownMenuItem>
                              ) : (
                                user.status === 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => setSuspendTarget(user)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                )
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
              This will suspend the account and restrict their access to the platform. You can
              reactivate the account at any time.
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
    </div>
  );
}
