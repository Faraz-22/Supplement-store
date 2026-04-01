// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  isOpen: false,
};

// Load from localStorage if available
if (typeof window !== 'undefined') {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      const parsed = JSON.parse(storedCart);
      initialState.items = parsed.items || [];
      initialState.totalItems = parsed.totalItems || 0;
      initialState.subtotal = parsed.subtotal || 0;
    } catch (error) {
      console.error('Failed to parse cart from localStorage');
    }
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId
      );

      if (existingItem) {
        // Update quantity if item exists
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += action.payload.quantity;
        }
      } else {
        // Add new item
        state.items.push(action.payload);
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalItems: state.totalItems,
          subtotal: state.subtotal,
        }));
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        item => item.productId === action.payload.productId
      );

      if (item) {
        // Don't exceed stock
        item.quantity = Math.min(action.payload.quantity, item.stock);

        // Remove if quantity is 0
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            i => i.productId !== action.payload.productId
          );
        }

        // Recalculate totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Persist
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify({
            items: state.items,
            totalItems: state.totalItems,
            subtotal: state.subtotal,
          }));
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);

      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Persist
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalItems: state.totalItems,
          subtotal: state.subtotal,
        }));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
