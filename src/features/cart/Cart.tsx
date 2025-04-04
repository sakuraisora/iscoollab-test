import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  selectHasItems,
  updateQuantity,
} from "./cartSlice";
import {
  selectOrderStatus,
  submitOrderAndClearCart,
} from "../orders/orderSlice";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

/**
 * @file Cart.tsx
 * @description Displays the shopping cart contents and allows users to:
 * - View items in their cart with prices
 * - Adjust quantities via text input or increment/decrement buttons
 * - Remove items from the cart
 * - View the cart total
 * - Submit orders
 */
const Cart = () => {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const hasItems = useAppSelector(selectHasItems);
  const orderStatus = useAppSelector(selectOrderStatus);
  // Local state for text field values
  const [editValue, setEditValue] = useState<Record<string, string>>({});
  /**
   * @description Updates the quantity of a cart item or removes it if quantity is 0 or less
   * @param id - The ID of the item to update
   * @param quantity - The new quantity to set
   */
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    } else if (quantity <= 0) {
      dispatch(removeFromCart(id));
    }
  };
  /**
   * @description Handles the submission of quantity changes from the text input
   * - Validates the input to ensure it's a positive number
   * - Updates the quantity if valid, resets to previous value if invalid
   * - Clears the edit state for the processed item
   * @param id - The ID of the item being updated
   */
  const handleQuantitySubmit = (id: string) => {
    const inputValue = editValue[id] || "";
    const numValue = parseInt(inputValue);
    // Validate input: must be a positive number
    if (!isNaN(numValue) && numValue > 0) {
      handleUpdateQuantity(id, numValue);
    } else {
      // Reset to current quantity if invalid input
      const item = items.find(i => i.item.id === id);
      const resetValue = item ? item.quantity : 1;
      setEditValue({
        ...editValue,
        [id]: resetValue.toString(),
      });
    }
    // Clear edit state for this item
    const newEditValues = { ...editValue };
    delete newEditValues[id];
    setEditValue(newEditValues);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Cart
      </Typography>

      {!hasItems ? (
        <Typography variant="body1">Your cart is empty</Typography>
      ) : (
        <>
          <List>
            {items.map(cartItem => {
              const itemId = cartItem.item.id;
              return (
                <ListItem
                  key={itemId}
                  secondaryAction={
                    // Delete action
                    <IconButton
                      edge="end"
                      onClick={() => dispatch(removeFromCart(itemId))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={cartItem.item.name}
                    secondary={`$${cartItem.item.price.toFixed(2)}`}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    {/* Decrease action */}
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(itemId, cartItem.quantity - 1)
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    {/* Items quantity with text */}
                    <TextField
                      size="small"
                      value={
                        itemId in editValue
                          ? editValue[itemId]
                          : cartItem.quantity.toString()
                      }
                      onChange={e =>
                        setEditValue({
                          ...editValue,
                          [itemId]: e.target.value,
                        })
                      }
                      onBlur={() => handleQuantitySubmit(itemId)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleQuantitySubmit(itemId);
                        }
                      }}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          style: { textAlign: "center", width: "30px" },
                        },
                      }}
                      variant="outlined"
                      sx={{ mx: 1 }}
                    />
                    {/* Increase action */}
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(itemId, cartItem.quantity + 1)
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
          {/* Submit */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(submitOrderAndClearCart(items))}
              fullWidth
              sx={{ mt: 2 }}
              disabled={orderStatus === "loading"}
            >
              {orderStatus === "loading" ? "Processing..." : "Submit Order"}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Cart;
