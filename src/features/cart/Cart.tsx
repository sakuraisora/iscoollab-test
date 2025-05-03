import {
  Box,
  Button,
  List,
  Paper,
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
import CartItem from "./CartItem";

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
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const hasItems = useAppSelector(selectHasItems);
  const orderStatus = useAppSelector(selectOrderStatus);
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
            {items.map(cartItem => (
              <CartItem
                key={cartItem.item.id}
                cartItem={cartItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={(id) => dispatch(removeFromCart(id))}
              />
            ))}
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
