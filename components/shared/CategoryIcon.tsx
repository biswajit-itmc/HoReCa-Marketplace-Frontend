import {
  ChefHat,
  Refrigerator,
  Utensils,
  Armchair,
  Table,
  Croissant,
  Coffee,
  Sparkles,
  Blend,
  Layers,
  Package,
  BedDouble,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ChefHat,
  Refrigerator,
  Utensils,
  Armchair,
  Table,
  Croissant,
  Coffee,
  Sparkles,
  Blend,
  Layers,
  Package,
  BedDouble,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Package;
  return <Icon className={className} />;
}
