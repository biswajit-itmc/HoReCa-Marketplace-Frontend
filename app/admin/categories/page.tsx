'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, LayoutGrid, Pencil, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { categories as initialCategories } from '@/data/categories';
import type { Category } from '@/types';

const ICON_OPTIONS = [
  'ChefHat', 'Refrigerator', 'Utensils', 'Armchair', 'Table', 'Croissant',
  'Coffee', 'Sparkles', 'Blend', 'Layers', 'Package', 'BedDouble',
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: 'Package' });

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  );

  const openEdit = (category: Category) => {
    setEditTarget(category);
    setForm({ name: category.name, description: category.description, icon: category.icon });
  };

  const saveEdit = () => {
    if (!editTarget) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editTarget.id ? { ...c, name: form.name, description: form.description, icon: form.icon } : c
      )
    );
    toast.success(`Category "${form.name}" updated.`);
    setEditTarget(null);
  };

  const openAdd = () => {
    setForm({ name: '', description: '', icon: 'Package' });
    setIsAddOpen(true);
  };

  const saveAdd = () => {
    if (!form.name.trim()) {
      toast.error('Category name is required.');
      return;
    }
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, '-'),
      icon: form.icon,
      productCount: 0,
      description: form.description,
    };
    setCategories((prev) => [newCategory, ...prev]);
    toast.success(`Category "${form.name}" added.`);
    setIsAddOpen(false);
  };

  return (
    <div>
      <PageHeader title="Categories" description="Manage product categories across the marketplace.">
        <Button onClick={openAdd} className="gap-2 rounded-lg bg-forest-500 text-white hover:bg-forest-600">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </PageHeader>

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No categories found"
            description="Try a different search term."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
              >
                <Card className="h-full rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest-100 text-forest-600">
                        <CategoryIcon name={category.icon} className="h-5 w-5" />
                      </div>
                      <button
                        onClick={() => openEdit(category)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="mt-3 font-serif text-base font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Slug: {category.slug}</span>
                      <span className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs font-medium text-forest-700">
                        {category.productCount} products
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-lg"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={saveEdit} className="rounded-lg bg-forest-500 text-white hover:bg-forest-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                placeholder="e.g. Outdoor Furniture"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-desc">Description</Label>
              <Textarea
                id="add-desc"
                placeholder="Short description of this category"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-lg"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, icon }))}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                      form.icon === icon
                        ? 'border-forest-500 bg-forest-100 text-forest-700'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <CategoryIcon name={icon} className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={saveAdd} className="rounded-lg bg-forest-500 text-white hover:bg-forest-600">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
