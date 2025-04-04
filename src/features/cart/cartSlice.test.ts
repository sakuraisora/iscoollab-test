import type { AppStore } from "../../app/store";
import { makeStore } from "../../app/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectHasItems,
} from "./cartSlice";
import { foodItems } from "../../utils/mock-data";

describe("cart reducer", () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore();
  });

  it("should handle initial state", () => {
    expect(selectCartItems(store.getState())).toEqual([]);
    expect(selectCartItemCount(store.getState())).toBe(0);
    expect(selectCartTotal(store.getState())).toBe(0);
    expect(selectHasItems(store.getState())).toBe(false);
  });

  it("should handle addToCart", () => {
    const testItem = foodItems[0];
    store.dispatch(addToCart(testItem));

    const items = selectCartItems(store.getState());
    expect(items).toHaveLength(1);
    expect(items[0].item).toEqual(testItem);
    expect(items[0].quantity).toBe(1);
    expect(selectHasItems(store.getState())).toBe(true);
  });

  it("should increase quantity when adding the same item twice", () => {
    const testItem = foodItems[0];
    store.dispatch(addToCart(testItem));
    store.dispatch(addToCart(testItem));

    const items = selectCartItems(store.getState());
    expect(items).toHaveLength(1);
    expect(items[0].item).toEqual(testItem);
    expect(items[0].quantity).toBe(2);
    expect(selectCartItemCount(store.getState())).toBe(2);
  });

  it("should handle removeFromCart", () => {
    const testItem = foodItems[0];
    store.dispatch(addToCart(testItem));
    store.dispatch(removeFromCart(testItem.id));

    expect(selectCartItems(store.getState())).toEqual([]);
    expect(selectHasItems(store.getState())).toBe(false);
  });

  it("should handle updateQuantity", () => {
    const testItem = foodItems[0];
    store.dispatch(addToCart(testItem));
    store.dispatch(updateQuantity({ id: testItem.id, quantity: 5 }));

    const items = selectCartItems(store.getState());
    expect(items[0].quantity).toBe(5);
    expect(selectCartItemCount(store.getState())).toBe(5);
  });

  it("should remove item when updating quantity to zero or less", () => {
    const testItem = foodItems[0];
    store.dispatch(addToCart(testItem));
    store.dispatch(updateQuantity({ id: testItem.id, quantity: 0 }));

    expect(selectCartItems(store.getState())).toEqual([]);
  });

  it("should handle clearCart", () => {
    const testItem1 = foodItems[0];
    const testItem2 = foodItems[1];
    store.dispatch(addToCart(testItem1));
    store.dispatch(addToCart(testItem2));
    store.dispatch(clearCart());

    expect(selectCartItems(store.getState())).toEqual([]);
    expect(selectHasItems(store.getState())).toBe(false);
  });

  it("should calculate correct cart total", () => {
    // Price: 8.99
    const testItem1 = foodItems[0]; 
    // Price: 12.99
    const testItem2 = foodItems[1]; 
    
    store.dispatch(addToCart(testItem1));
    // 2 * 8.99 = 17.98
    store.dispatch(updateQuantity({ id: testItem1.id, quantity: 2 })); 
    // 17.98 + 12.99 = 30.97
    store.dispatch(addToCart(testItem2)); 

    expect(selectCartTotal(store.getState())).toBeCloseTo(30.97);
  });
});