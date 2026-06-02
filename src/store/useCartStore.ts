import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  priceInRupees: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; priceInRupees: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  // Adds an item to the cart or updates quantity if it already exists
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),

  // Removes an item from the cart by ID
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((i) => i.id !== id),
  })),

  // Updates the quantity of a specific item in the cart
  updateQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map((i) => i.id === id ? { ...i, quantity } : i),
  })),

  // Clears all items from the cart
  clearCart: () => set({ cart: [] }),

  // Calculates the total amount in rupees for all items in the cart
  getTotalAmount: () => {
    return get().cart.reduce((total, item) => total + (item.priceInRupees * item.quantity), 0);
  },
}));