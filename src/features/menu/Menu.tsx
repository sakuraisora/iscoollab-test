import { useState } from "react";
import { categories, foodItems } from "../../utils/mock-data";
import type { Category, FoodItem } from "../../utils/mock-data";
import { useAppDispatch } from "../../app/hooks";
import { addToCart } from "../cart/cartSlice";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

/**
 * @file Menu.tsx
 * @description Displays the restaurant menu with:
 * - Categories (expandable/collapsible)
 * - Food items organized by category
 * - Add to cart functionality
 */
const Menu = () => {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useAppDispatch();
  /**
   * @description State for tracking which category is currently expanded
   */
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].id,
  );
  /**
   * @description Filtered food items based on the currently selected category
   */
  const filteredItems = foodItems.filter(
    item => item.categoryId === selectedCategory,
  );
  /**
   * Handles adding a food item to the cart
   * @param item - The food item to add
   */
  const handleAddToCart = (item: FoodItem) => {
    dispatch(addToCart(item));
  };
  /**
   * @description Handles category selection - updates the active category
   * @param id - The ID of the selected category
   */
  const handleClick = (id: string) => {
    setSelectedCategory(id);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Menu
      </Typography>
      <List>
        {categories.map((category: Category) => (
          <div key={category.id}>
            <ListItemButton onClick={() => handleClick(category.id)}>
              <ListItemText primary={category.name} />
              {category.id === selectedCategory ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
            <Collapse
              in={category.id === selectedCategory}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {filteredItems.map((item: FoodItem) => (
                  <ListItemButton
                    key={item.id}
                    sx={{ pl: 4 }}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default Menu;
