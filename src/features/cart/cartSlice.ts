import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import type { FoodItem } from "../../utils/mock-data";

/**
 * Represents an item in the shopping cart with its quantity
 */
export interface CartItem {
  /** The food item */
  item: FoodItem;
  /** Quantity of this item in cart */
  quantity: number;
}
/**
 * The state shape for the cart slice
 */
interface CartState {
  /** Items currently in the cart */
  items: CartItem[];
}
/**
 * Initial empty cart state
 */
const initialState: CartState = {
  /** Food items */
  items: [],
};

/**
 * @file cartSlice.ts
 * @description Redux slice for managing the shopping cart state, including:
 * - Adding items to cart
 * - Removing items from cart
 * - Updating item quantities
 * - Clearing the entire cart
 * - Calculating totals and other derived state
 */
export const cartSlice = createAppSlice({
  name: "cart",
  initialState,
  reducers: create => ({
    /**
     * @description Adds an item to the cart or increments its quantity if already present
     * @param state - The current cart state
     * @param action - Action containing the food item to add
     */
    addToCart: create.reducer((state, action: PayloadAction<FoodItem>) => {
      const existingItem = state.items.find(
        cartItem => cartItem.item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ item: action.payload, quantity: 1 });
      }
    }),
    /**
     * @description Removes an item completely from the cart
     * @param state - The current cart state
     * @param action - Action containing the item ID to remove
     */
    removeFromCart: create.reducer((state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.item.id !== action.payload);
    }),
    /**
     * @description Updates the quantity of an item in the cart
     * @param state - The current cart state
     * @param action - Action containing the item ID and new quantity
     */
    updateQuantity: create.reducer(
      (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const { id, quantity } = action.payload;
        const cartItem = state.items.find(item => item.item.id === id);

        if (cartItem) {
          if (quantity <= 0) {
            state.items = state.items.filter(item => item.item.id !== id);
          } else {
            cartItem.quantity = quantity;
          }
        }
      },
    ),
    /**
     * @description Clears all items from the cart
     * @param state - The current cart state
     */
    clearCart: create.reducer(state => {
      state.items = [];
    }),
  }),
  selectors: {
    /**
     * @description Selects all cart items
     * @returns Array of cart items or empty array if items don't exist
     */
    selectCartItems: (state: CartState) => state.items || [],
    /**
     * @description Calculates the total number of items in cart (sum of quantities)
     * @returns The total count of all items
     */
    selectCartItemCount: createSelector(
      (state: CartState) => state.items,
      items =>
        items ? items.reduce((total, item) => total + item.quantity, 0) : 0,
    ),
    /**
     * @description Calculates the total price of all items in the cart
     * @returns The total price in currency units
     */
    selectCartTotal: createSelector(
      (state: CartState) => state.items,
      items =>
        items
          ? items.reduce(
              (total, item) => total + item.item.price * item.quantity,
              0,
            )
          : 0,
    ),
    /**
     * @description Determines if the cart has any items
     * @returns Boolean indicating if the cart has items
     */
    selectHasItems: createSelector(
      (state: CartState) => state.items,
      items => (items ? items.length > 0 : false),
    ),
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const {
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectHasItems,
} = cartSlice.selectors;
