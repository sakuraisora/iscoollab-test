import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./utils/test-utils";
import { foodItems } from "./utils/mock-data";
import type { Order } from "./features/orders/orderSlice";

describe("App Component", () => {
  it("should render main application sections", () => {
    renderWithProviders(<App />);

    // Check for main header
    expect(screen.getByText("Order System")).toBeInTheDocument();
    // Check for Order History button
    expect(
      screen.getByRole("button", { name: "Order history" }),
    ).toBeInTheDocument();
    // Check for Menu and Cart sections
    expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
  });

  it("should open order history dialog when clicking the button", async () => {
    const { user } = renderWithProviders(<App />);

    // Order history dialog should be closed initially
    expect(screen.queryByText("Order History")).not.toBeInTheDocument();
    // Click on Order history button
    await user.click(screen.getByRole("button", { name: "Order history" }));
    // Dialog should be open with title
    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(screen.getByText("No order history")).toBeInTheDocument();
  });

  it("should show empty cart initially", () => {
    renderWithProviders(<App />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("should add items to cart from menu", async () => {
    const { user } = renderWithProviders(<App />);

    // Select a menu item and add it to cart
    const menuItem = foodItems[0]; // Burger
    await user.click(screen.getByText(menuItem.name));
    // Check if item was added to cart
    await waitFor(() => {
      expect(
        screen.getByText(`$${menuItem.price.toFixed(2)}`),
      ).toBeInTheDocument();
    });
    // Cart should show the item
    expect(screen.queryByText("Your cart is empty")).not.toBeInTheDocument();
  });

  it("should handle order submission flow", async () => {
    // Preload state with an item in cart
    const preloadedState = {
      cart: {
        items: [{ item: foodItems[0], quantity: 1 }],
      },
      order: {
        orders: [] as Order[],
        status: "idle" as const,
      },
    };

    const { user, store } = renderWithProviders(<App />, { preloadedState });

    // Find and click Submit Order button
    const submitButton = screen.getByRole("button", { name: "Submit Order" });
    await user.click(submitButton);

    // Order should be processing
    expect(store.getState().order.status).toBe("loading");

    // After processing, cart should be empty and order should be added
    await waitFor(() => {
      expect(store.getState().order.status).toBe("idle");
      expect(store.getState().cart.items).toHaveLength(0);
      expect(store.getState().order.orders).toHaveLength(1);
    });
    // Cart should now show empty message
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("should maintain theme consistency", () => {
    renderWithProviders(<App />);

    // Theme elements should be consistent (check for primary green color buttons)
    const submitOrderBtn = screen.queryByRole("button", {
      name: "Submit Order",
    });
    // If the cart has items, the submit button would be visible
    if (submitOrderBtn) {
      expect(submitOrderBtn).toHaveClass("MuiButton-containedPrimary");
    }

    const orderHistoryBtn = screen.getByRole("button", {
      name: "Order history",
    });
    expect(orderHistoryBtn).toHaveClass("MuiButton-outlined");
  });
});
