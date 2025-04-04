/** Food */
export interface FoodItem {
  /** Food ID */
  id: string;
  /** Category ID */
  categoryId: string;
  /** Food name */
  name: string;
  /** Food price */
  price: number;
  /** Food description */
  description: string;
}

/** Category */
export interface Category {
  /** Category ID */
  id: string;
  /** Category name */
  name: string;
}

export const categories: Category[] = [
  { id: "food", name: "Food" },
  { id: "drink", name: "Drink" },
  { id: "dessert", name: "Dessert" },
];

export const foodItems: FoodItem[] = [
  // Food
  {
    id: "food-1",
    categoryId: "food",
    name: "Burger",
    price: 8.99,
    description: "Classic burger + cheese & bacon",
  },
  {
    id: "food-2",
    categoryId: "food",
    name: "Pizza",
    price: 12.99,
    description: "Pepperoni pizza + extra cheese",
  },
  {
    id: "food-3",
    categoryId: "food",
    name: "Salad",
    price: 7.5,
    description: "Fresh garden salad + vinaigrette",
  },
  // Drink
  {
    id: "drink-1",
    categoryId: "drink",
    name: "Black Tea",
    price: 3.5,
    description: "Hot black tea",
  },
  {
    id: "drink-2",
    categoryId: "drink",
    name: "Green Tea",
    price: 3.75,
    description: "Hot green tea",
  },
  {
    id: "drink-3",
    categoryId: "drink",
    name: "Oolong Tea",
    price: 4.0,
    description: "Hot oolong tea",
  },
  // Dessert
  {
    id: "dessert-1",
    categoryId: "dessert",
    name: "Chocolate Cake",
    price: 5.99,
    description: "Rich chocolate cake + frosting",
  },
  {
    id: "dessert-2",
    categoryId: "dessert",
    name: "Cheesecake",
    price: 6.5,
    description: "New York style cheesecake",
  },
  {
    id: "dessert-3",
    categoryId: "dessert",
    name: "Ice Cream",
    price: 4.5,
    description: "Vanilla ice cream + caramel sauce",
  },
];
