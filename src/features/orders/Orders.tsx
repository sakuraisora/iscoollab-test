import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearHistory, selectOrders } from "../../features/orders/orderSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * @file Orders.tsx
 * @description Displays the user's order history with:
 * - List of past orders with timestamps
 * - Expandable order details showing items and quantities
 * - Order totals
 * - Option to clear order history
 */
const Orders = () => {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);

  return (
    <>
      {orders.length === 0 ? (
        <Typography>No order history</Typography>
      ) : (
        <>
          {/* History items */}
          <List>
            {orders.map(order => (
              <Accordion key={order.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    {order.id} - {new Date(order.date).toLocaleString()}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {order.items.map(item => (
                      <ListItem key={`${order.id}-${item.item.id}`}>
                        <ListItemText
                          primary={`${item.item.name} x${item.quantity}`}
                          secondary={`$${(item.item.price * item.quantity).toFixed(2)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6">
                    Total: ${order.total.toFixed(2)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
          {/* Clear history */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => dispatch(clearHistory())}
            sx={{ mt: 2 }}
          >
            Clear History
          </Button>
        </>
      )}
    </>
  );
};

export default Orders;
