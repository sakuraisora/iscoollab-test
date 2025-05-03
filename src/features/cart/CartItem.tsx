import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import type { CartItem as CartItemType } from "./cartSlice";

interface CartItemProps {
  cartItem: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

/**
 * @description CartItem component - Displays a single item in the cart with quantity controls
 * @param cartItem - The item to display
 * @param onUpdateQuantity - Function to call when the quantity is updated
 * @param onRemove - Function to call when the item is removed from the cart
 */
const CartItem = ({ cartItem, onUpdateQuantity, onRemove }: CartItemProps) => {
  const itemId = cartItem.item.id;
  const [editValue, setEditValue] = useState<string>(cartItem.quantity.toString());
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * Handles the submission of quantity changes from the text input
   */
  const handleQuantitySubmit = () => {
    const numValue = parseInt(editValue);
    // Validate input: must be a positive number
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateQuantity(itemId, numValue);
    } else {
      // Reset to current quantity if invalid input
      setEditValue(cartItem.quantity.toString());
    }
    setIsEditing(false);
  };

  return (
    <ListItem
      key={itemId}
      secondaryAction={
        <IconButton edge="end" onClick={() => onRemove(itemId)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={cartItem.item.name}
        secondary={`$${cartItem.item.price.toFixed(2)}`}
      />
      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(itemId, cartItem.quantity - 1)}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          size="small"
          value={isEditing ? editValue : cartItem.quantity.toString()}
          onChange={(e) => {
            setEditValue(e.target.value);
            setIsEditing(true);
          }}
          onBlur={handleQuantitySubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleQuantitySubmit();
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
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(itemId, cartItem.quantity + 1)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default CartItem;