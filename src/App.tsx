import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import "./App.css";
import Cart from "./features/cart/Cart";
import Menu from "./features/menu/Menu";
import Orders from "./features/orders/Orders";
import { useState } from "react";

/**
 * Theme configuration
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

/**
 * @file App.tsx
 * @description Root component that:
 * - Sets up the Material UI theme
 * - Contains the main ordering functionality components
 * - Manages the order history dialog
 * @returns The rendered application
 */
const App = () => {
  // State for controlling the order history dialog visibility
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={8}>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
              Order System
            </Typography>
          </Grid>
          <Grid size={4}>
            {/* Dialog popup for order history */}
            <Button variant="outlined" onClick={() => setOpen(true)}>
              Order history
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
              <DialogTitle>Order History</DialogTitle>
              <DialogContent dividers={true}>
                <Orders />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {/* Menu */}
          <Grid size={6}>
            <Menu />
          </Grid>
          {/* Cart */}
          <Grid size={6}>
            <Cart />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
