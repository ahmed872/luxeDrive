'use client';

import { ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export interface CartNavLinkProps {
  label: string;
  toastTitle: string;
  toastDescription: string;
}

/**
 * `cart` isn't built yet (P05 scope: storefront only). Rather than a dead
 * link or a fake "added to cart" success, clicking this honestly says so —
 * the same "never fake a missing thing into looking present" rule P04
 * applied to media applies here to commerce state that doesn't exist yet.
 */
export function CartNavLink({ label, toastTitle, toastDescription }: CartNavLinkProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() =>
        toast({ title: toastTitle, description: toastDescription, variant: 'default' })
      }
    >
      <ShoppingBag aria-hidden="true" />
    </Button>
  );
}
