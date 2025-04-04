import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import type { AppThunk } from "../../app/store";
import { clearCart, type CartItem } from "../cart/cartSlice";

/**
 * Represents a submitted order
 */
export interface Order {
  /** Unique order identifier */
  id: string;
  /** Items in the order with quantities */
  items: CartItem[];
  /** ISO timestamp of order creation */
  date: string;
  /** Total order amount */
  total: number;
}

/**
 * The state shape for the orders slice
 */
export interface OrderState {
  /** Array of completed orders */
  orders: Order[];
  /** Status of current order submission */
  status: "idle" | "loading" | "failed";
}

/**
 * Initial empty orders state
 */
const initialState: OrderState = {
  /** Orders */
  orders: [],
  /** Orders status */
  status: "idle",
};

/**
 * @file orderSlice.ts
 * @description Redux slice for managing orders and order history, including:
 * - Creating new orders
 * - Managing order history
 * - Tracking order submission status
 * - Calculating order totals and derived state
 */
export const orderSlice = createAppSlice({
  name: "order",
  initialState,
  reducers: create => ({
    /**
     * @description Creates a new order from cart items and adds it to order history
     * @param state - The current order state
     * @param action - Action containing the cart items for the order
     */
    addOrder: create.reducer((state, action: PayloadAction<CartItem[]>) => {
      // Calculate order total
      const total = action.payload.reduce(
        (sum, item) => sum + item.item.price * item.quantity,
        0,
      );
      // Create new order with timestamp and unique ID
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        items: action.payload,
        date: new Date().toISOString(),
        total,
      };
      // Add to order history
      state.orders.push(newOrder);
    }),
    /**
     * @description Clears all order history
     * @param state - The current order state
     */
    clearHistory: create.reducer(state => {
      state.orders = [];
    }),
    /**
     * @description Async thunk for submitting an order with network simulation
     */
    submitOrderAsync: create.asyncThunk(
      async (orderItems: CartItem[]) => {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const total = orderItems.reduce(
          (sum, item) => sum + item.item.price * item.quantity,
          0,
        );
        // Return a new payload
        return {
          id: `order-${Date.now()}`,
          items: orderItems,
          date: new Date().toISOString(),
          total,
        };
      },
      {
        // State handlers for the async operation
        pending: state => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.orders.push(action.payload);
        },
        rejected: state => {
          state.status = "failed";
        },
      },
    ),
  }),
  selectors: {
    /**
     * @description Selects all orders in chronological order
     * @returns Array of orders
     */
    selectOrders: state => state.orders,
    /**
     * @description Selects the count of all orders
     * @returns Number of orders
     */
    selectOrdersCount: state => state.orders.length,
    /**
     * @description Calculates the total spent across all orders
     * @returns Total amount spent
     */
    selectTotalSpent: state =>
      state.orders.reduce((total, order) => total + order.total, 0),
    /**
     * @description Creates a selector to find an order by its ID
     * @returns A function that takes an ID and returns the matching order or undefined
     */
    selectOrderById: state => (id: string) =>
      state.orders.find(order => order.id === id),
    /**
     * @description Selects the current order submission status
     * @returns The status string: "idle", "loading", or "failed"
     */
    selectOrderStatus: state => state.status,
  },
});

export const { addOrder, clearHistory, submitOrderAsync } = orderSlice.actions;

export const {
  selectOrders,
  selectOrdersCount,
  selectTotalSpent,
  selectOrderById,
  selectOrderStatus,
} = orderSlice.selectors;

/**
 * @description Thunk that submits an order and clears the cart
 * @param items - The cart items to submit as an order
 * @returns A thunk function that handles the order submission flow
 */
export const submitOrderAndClearCart =
  (items: CartItem[]): AppThunk =>
  async (dispatch, getState) => {
    // Don't process empty orders
    if (items.length === 0) return;

    try {
      // Submit the order and wait for it to complete
      await dispatch(submitOrderAsync(items)).unwrap();
      // Clear the cart if order submission was successful
      dispatch(clearCart());
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };
