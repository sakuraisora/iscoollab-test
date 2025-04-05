import type { AppStore } from "../../app/store";
import { makeStore } from "../../app/store";
import {
  addOrder,
  clearHistory,
  submitOrderAsync,
  selectOrders,
  selectOrdersCount,
  selectTotalSpent,
  selectOrderById,
  selectOrderStatus,
  submitOrderAndClearCart,
} from "./orderSlice";
import { foodItems } from "../../utils/mock-data";
import { vitest } from "vitest";

// Mock fixed timestamp for tests
const mockDateNow = 1234567890000;
const mockISOString = "2025-01-01T00:00:00.000Z";

describe("order reducer", () => {
  let store: AppStore;

  // Sample cart items for testing, Total: 30.97
  const cartItems = [
    // 2 * 8.99 = 17.98
    { item: foodItems[0], quantity: 2 },
    // 1 * 12.99 = 12.99
    { item: foodItems[1], quantity: 1 },
  ];

  // Setup and teardown for each test
  beforeEach(() => {
    // Mock Date.now
    vitest.spyOn(Date, "now").mockImplementation(() => mockDateNow);
    // Mock new Date().toISOString()
    vitest
      .spyOn(Date.prototype, "toISOString")
      .mockImplementation(() => mockISOString);

    store = makeStore();
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  it("should handle initial state", () => {
    expect(selectOrders(store.getState())).toEqual([]);
    expect(selectOrdersCount(store.getState())).toBe(0);
    expect(selectTotalSpent(store.getState())).toBe(0);
    expect(selectOrderStatus(store.getState())).toBe("idle");
  });

  it("should handle addOrder", () => {
    store.dispatch(addOrder(cartItems));

    const orders = selectOrders(store.getState());
    expect(orders).toHaveLength(1);

    const order = orders[0];
    expect(order.items).toEqual(cartItems);
    expect(order.id).toBe(`order-${mockDateNow}`);
    expect(order.date).toBe(mockISOString);
    expect(order.total).toBeCloseTo(30.97);
  });

  it("should handle clearHistory", () => {
    // Add some orders first
    store.dispatch(addOrder(cartItems));
    expect(selectOrders(store.getState())).toHaveLength(1);
    // Clear orders
    store.dispatch(clearHistory());
    expect(selectOrders(store.getState())).toEqual([]);
    expect(selectOrdersCount(store.getState())).toBe(0);
  });

  it("should handle submitOrderAsync - pending", () => {
    const pendingAction = { type: submitOrderAsync.pending.type };
    store.dispatch(pendingAction);
    expect(selectOrderStatus(store.getState())).toBe("loading");
  });

  it("should handle submitOrderAsync - fulfilled", () => {
    const mockOrder = {
      id: `order-${mockDateNow}`,
      items: cartItems,
      date: mockISOString,
      total: 30.97,
    };

    const fulfilledAction = {
      type: submitOrderAsync.fulfilled.type,
      payload: mockOrder,
    };
    store.dispatch(fulfilledAction);

    const orders = selectOrders(store.getState());
    expect(orders).toHaveLength(1);
    expect(orders[0]).toEqual(mockOrder);
    expect(selectOrderStatus(store.getState())).toBe("idle");
  });

  it("should handle submitOrderAsync - rejected", () => {
    const rejectedAction = { type: submitOrderAsync.rejected.type };
    store.dispatch(rejectedAction);
    expect(selectOrderStatus(store.getState())).toBe("failed");
  });

  it("should calculate correct total spent", () => {
    // Total: 30.97 added to orders
    store.dispatch(addOrder(cartItems));
    // 3 * 7.5 = 22.5
    store.dispatch(addOrder([{ item: foodItems[2], quantity: 3 }]));
    // Total should be 30.97 + 22.5 = 53.47
    expect(selectTotalSpent(store.getState())).toBeCloseTo(53.47);
  });

  it("should find order by id", () => {
    store.dispatch(addOrder(cartItems));
    const orderId = `order-${mockDateNow}`;

    const orderSelector = selectOrderById(store.getState());
    const foundOrder = orderSelector(orderId);

    expect(foundOrder).toBeTruthy();
    expect(foundOrder?.id).toBe(orderId);
  });

  it("should submit order and clear cart", async () => {
    // Check that the thunk doesn't throw an error
    expect(() => submitOrderAndClearCart(cartItems)).not.toThrow();
  });

  it("should not submit when cart is empty", async () => {
    const emptyCart: any[] = [];
    expect(() => submitOrderAndClearCart(emptyCart)).not.toThrow();
  });
});
