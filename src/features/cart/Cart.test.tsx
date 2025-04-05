import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import Cart from "./Cart";
import { foodItems } from "../../utils/mock-data";
import type { Order } from "../orders/orderSlice";

describe("Cart Component", () => {
  it("should display empty cart message when cart is empty", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
  });

  it("should display cart items with correct details", () => {
    // Burger price: 8.99
    const item1 = foodItems[0];
    // Pizza price: 12.99
    const item2 = foodItems[1];

    const preloadedState = {
      cart: {
        items: [
          { item: item1, quantity: 2 },
          { item: item2, quantity: 1 },
        ],
      },
    };

    renderWithProviders(<Cart />, { preloadedState });

    expect(screen.getByText(item1.name)).toBeInTheDocument();
    expect(screen.getByText(`$${item1.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(item2.name)).toBeInTheDocument();
    expect(screen.getByText(`$${item2.price.toFixed(2)}`)).toBeInTheDocument();

    // 2 * 8.99 + 1 * 12.99 = 30.97
    expect(screen.getByText(`Total: $30.97`)).toBeInTheDocument();
  });

  it("should be able to update quantity", async () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 1 }],
      },
    };

    const { store } = renderWithProviders(<Cart />, { preloadedState });

    // Find the quantity input field
    const input = screen.getByRole("textbox");

    // Update quantity via text field
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.blur(input);

    // Check if the quantity was updated in the store
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items[0].quantity).toBe(3);
    });
  });

  it("should remove item when clicking delete button", async () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 1 }],
      },
    };

    const { user, store } = renderWithProviders(<Cart />, { preloadedState });

    // Find the delete button (using aria-label which is added by MUI)
    const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
    if (!deleteButton) throw new Error("Delete button not found");

    // Click delete button
    await user.click(deleteButton);

    // Check if the item was removed
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items).toHaveLength(0);
    });

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("should increase quantity when clicking plus button", async () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 1 }],
      },
    };

    const { user, store } = renderWithProviders(<Cart />, { preloadedState });

    // Find the plus button
    const addButton = screen.getByTestId("AddIcon").closest("button");
    if (!addButton) throw new Error("Add button not found");

    // Click plus button
    await user.click(addButton);

    // Check if the quantity was increased
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items[0].quantity).toBe(2);
    });
  });

  it("should decrease quantity when clicking minus button", async () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 2 }],
      },
    };

    const { user, store } = renderWithProviders(<Cart />, { preloadedState });

    // Find the minus button
    const removeButton = screen.getByTestId("RemoveIcon").closest("button");
    if (!removeButton) throw new Error("Remove button not found");

    // Click minus button
    await user.click(removeButton);

    // Check if the quantity was decreased
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items[0].quantity).toBe(1);
    });
  });

  it("should remove item when clicking minus button and quantity is 1", async () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 1 }],
      },
    };

    const { user, store } = renderWithProviders(<Cart />, { preloadedState });

    // Find the minus button
    const removeButton = screen.getByTestId("RemoveIcon").closest("button");
    if (!removeButton) throw new Error("Remove button not found");

    // Click minus button
    await user.click(removeButton);

    // Check if the item was removed
    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items).toHaveLength(0);
    });
  });

  it("should disable submit button when order is processing", () => {
    const item = foodItems[0];
    const preloadedState = {
      cart: {
        items: [{ item, quantity: 1 }],
      },
      order: {
        orders: [] as Order[],
        status: "loading" as const,
      },
    };

    renderWithProviders(<Cart />, { preloadedState });

    const submitButton = screen.getByText("Processing...");
    expect(submitButton).toBeDisabled();
  });
});
