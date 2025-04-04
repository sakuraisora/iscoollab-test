import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import Orders from "./Orders";
import { foodItems } from "../../utils/mock-data";
import type { Order } from "./orderSlice";

describe("Orders Component", () => {
  const mockOrders = [
    {
      id: "order-123",
      date: "2023-01-01T12:00:00.000Z",
      items: [
        // 2 * 8.99 = 17.98
        { item: foodItems[0], quantity: 2 }, 
        // 1 * 12.99 = 12.99
        { item: foodItems[1], quantity: 1 },
      ],
      total: 30.97,
    },
    {
      id: "order-456",
      date: "2023-01-02T12:00:00.000Z",
      items: [
        // 3 * 7.5 = 22.5
        { item: foodItems[2], quantity: 3 }, 
      ],
      total: 22.5,
    },
  ];

  it("should display 'No order history' when there are no orders", () => {
    renderWithProviders(<Orders />);

    expect(screen.getByText("No order history")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear History" }),
    ).not.toBeInTheDocument();
  });

  it("should display order history when orders exist", () => {
    const preloadedState = {
      order: {
        orders: mockOrders as Order[],
        status: "idle" as const,
      },
    };

    renderWithProviders(<Orders />, { preloadedState });
    // Should display order IDs in the summary
    expect(
      screen.getByText((content, element) => {
        return (
          content.includes("order-123") &&
          element?.tagName.toLowerCase() !== "button"
        );
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return (
          content.includes("order-456") &&
          element?.tagName.toLowerCase() !== "button"
        );
      }),
    ).toBeInTheDocument();
  });

  it("should expand order details when clicking on an order", async () => {
    const preloadedState = {
      order: {
        orders: mockOrders as Order[],
        status: "idle" as const,
      },
    };

    const { user } = renderWithProviders(<Orders />, { preloadedState });

    // Find and click the first accordion summary
    const accordionButtons = screen.getAllByRole("button", { expanded: false });
    await user.click(accordionButtons[0]);
    // Now item quantities should be visible (using unique identifiers)
    expect(screen.getByText(`${foodItems[0].name} x2`)).toBeInTheDocument();
    expect(screen.getByText(`${foodItems[1].name} x1`)).toBeInTheDocument();
    // Find the total for the specific order by using a more specific selector
    const totalElements = screen.getAllByText((content, element) => {
      return (
        content.includes("Total:") &&
        element?.tagName.toLowerCase() === "h6" &&
        content.includes("30.97")
      );
    });

    expect(totalElements.length).toBe(1);
  });

  it("should clear order history when clicking 'Clear History'", async () => {
    const preloadedState = {
      order: {
        orders: mockOrders as Order[],
        status: "idle" as const,
      },
    };

    const { user, store } = renderWithProviders(<Orders />, { preloadedState });

    // Clear History button should be visible
    const clearButton = screen.getByRole("button", { name: "Clear History" });
    await user.click(clearButton);
    // Order history should be cleared
    expect(store.getState().order.orders).toEqual([]);
    // UI should show "No order history"
    expect(screen.getByText("No order history")).toBeInTheDocument();
  });

  it("should display correct item prices in order details", async () => {
    const preloadedState = {
      order: {
        // Use only the first order to simplify the test
        orders: [mockOrders[0]] as Order[], 
        status: "idle" as const,
      },
    };

    const { user } = renderWithProviders(<Orders />, { preloadedState });

    // Find and click the accordion summary to expand it
    const accordionButton = screen.getByRole("button", { expanded: false });
    await user.click(accordionButton);
    // Check if prices are displayed correctly
    const secondaryTexts = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "p" &&
        element?.className.includes("MuiListItemText-secondary")
      );
    });
    // We expect two price elements
    expect(secondaryTexts.length).toBe(2);
    // Check specific prices
    expect(screen.getByText("$17.98")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });
});
