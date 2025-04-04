import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import Menu from "./Menu";
import { categories, foodItems } from "../../utils/mock-data";

describe("Menu Component", () => {
  it("should render the menu header", () => {
    renderWithProviders(<Menu />);

    expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
  });

  it("should display all categories", () => {
    renderWithProviders(<Menu />);

    // Check if all categories are displayed
    categories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should expand the first category by default", () => {
    renderWithProviders(<Menu />);

    const firstCategory = categories[0];
    const foodItemsInFirstCategory = foodItems.filter(
      item => item.categoryId === firstCategory.id,
    );

    // First category items should be visible
    foodItemsInFirstCategory.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("should switch categories when clicking on category header", async () => {
    const { user } = renderWithProviders(<Menu />);

    // Click on the second category
    const secondCategory = categories[1];
    await user.click(screen.getByText(secondCategory.name));

    // First category items should be hidden, second category items should be visible
    const foodItemsInSecondCategory = foodItems.filter(
      item => item.categoryId === secondCategory.id,
    );

    foodItemsInSecondCategory.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });

    // Items from first category should not be visible
    const firstCategory = categories[0];
    const foodItemsInFirstCategory = foodItems.filter(
      item => item.categoryId === firstCategory.id,
    );

    // First category items should no longer be visible
    foodItemsInFirstCategory.forEach(item => {
      expect(screen.queryByText(item.name)).not.toBeInTheDocument();
    });
  });

  it("should add item to cart when clicking on menu item", async () => {
    const { user, store } = renderWithProviders(<Menu />);

    const firstCategory = categories[0];
    const firstItem = foodItems.find(
      item => item.categoryId === firstCategory.id,
    );

    if (!firstItem) {
      throw new Error("Test data error: No items found in first category");
    }

    // Click on first menu item
    await user.click(screen.getByText(firstItem.name));

    // Check if the item was added to the cart
    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].item.id).toBe(firstItem.id);
    expect(cartItems[0].quantity).toBe(1);
  });

  it("should increment quantity when clicking an item already in cart", async () => {
    const firstCategory = categories[0];
    const firstItem = foodItems.find(
      item => item.categoryId === firstCategory.id,
    );

    if (!firstItem) {
      throw new Error("Test data error: No items found in first category");
    }

    // Preload with item already in cart
    const preloadedState = {
      cart: {
        items: [{ item: firstItem, quantity: 1 }],
      },
    };

    const { user, store } = renderWithProviders(<Menu />, { preloadedState });

    // Click on the same item again
    await user.click(screen.getByText(firstItem.name));

    // Check if quantity was incremented
    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].item.id).toBe(firstItem.id);
    expect(cartItems[0].quantity).toBe(2);
  });
});
