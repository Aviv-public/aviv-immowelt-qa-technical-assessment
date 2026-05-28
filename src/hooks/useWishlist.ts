import { useEffect } from 'react';
import { create } from 'zustand';
import { wishlistApi } from '../services/api';
import { useAuth } from './useAuth';
import { Property } from '../types';

interface WishlistState {
  wishlist: Property[];
  isLoading: boolean;
  load: () => Promise<void>;
  addToWishlist: (property: Property) => Promise<void>;
  removeFromWishlist: (propertyId: string) => Promise<void>;
  isInWishlist: (propertyId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,

  load: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await wishlistApi.list();
      set({ wishlist: items });
    } catch {
      set({ wishlist: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (property) => {
    if (get().wishlist.some((p) => p.id === property.id)) return;
    // Optimistic.
    set({ wishlist: [...get().wishlist, property] });
    try {
      await wishlistApi.add(property.id);
    } catch {
      set({
        wishlist: get().wishlist.filter((p) => p.id !== property.id),
      });
      throw new Error('Could not add to wishlist');
    }
  },

  removeFromWishlist: async (propertyId) => {
    const previous = get().wishlist;
    set({ wishlist: previous.filter((p) => p.id !== propertyId) });
    try {
      await wishlistApi.remove(propertyId);
    } catch {
      set({ wishlist: previous });
      throw new Error('Could not remove from wishlist');
    }
  },

  isInWishlist: (propertyId) =>
    get().wishlist.some((p) => p.id === propertyId),

  clear: () => set({ wishlist: [] }),
}));

/** Loads/clears the wishlist whenever the authenticated user changes. */
export const useWishlistSync = () => {
  const userId = useAuth((s) => s.user?.id ?? null);
  const load = useWishlist((s) => s.load);
  const clear = useWishlist((s) => s.clear);
  useEffect(() => {
    if (userId) void load();
    else clear();
  }, [userId, load, clear]);
};
