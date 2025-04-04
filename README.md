# Food Order System

An ordering application built with React, Redux Toolkit, TypeScript, Material UI and Vitest.

## Features

- **Menu**: Browse food items organized by categories
- **Cart**: Add items, adjust quantities, and submit orders
- **Order History**: View past orders with detailed information

## Tech Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Strong typing for improved developer experience and code quality
- **Redux Toolkit**: Modern state management with simplified boilerplate
- **Material UI**: Component library with pre-built accessible UI elements
- **Vite**: Suggested build tool and development server
- **Vitest**: Testing framework for unit tests

## Prerequisites

- Node.js (>= v16)
- npm

## Getting Started

1. Clone the repository:

```bash
git clone [<repository-url>](https://github.com/sakuraisora/iscoollab-test.git)
cd iscoollab-test
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── app/                        # Redux store setup
│   ├── createAppSlice.ts       # Custom slice creator
│   ├── hooks.ts                # Type-safe Redux hooks
│   └── store.ts                # Redux store configuration
├── features/                   # Feature-based organization
│   ├── cart/                   # Cart feature
│   │   ├── Cart.tsx            # Cart component
│   │   ├── Cart.test.tsx       # Cart component tests
│   │   ├── cartSlice.ts        # Cart Redux slice
│   │   └── cartSlice.test.ts   # Cart slice tests
│   ├── menu/                   # Menu feature
│   │   ├── Menu.tsx            # Menu component
│   │   └── Menu.test.tsx       # Menu component tests
│   └── orders/                 # Orders feature
│       ├── Orders.tsx          # Order history component
│       ├── Orders.test.tsx     # Orders component tests
│       ├── orderSlice.ts       # Order Redux slice
│       └── orderSlice.test.ts  # Order slice tests
├── utils/
│   ├── mock-data.ts            # Mock data for the application
│   └── test-utils.tsx          # Helper utilities for testing
├── App.tsx                     # Main application component
├── App.test.tsx                # App component tests
└── main.tsx                    # Entry point
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run test` - Run all tests
- `npm run lint` - Run linting
- `npm run type-check` - Run TypeScript type checking

## Design Decisions

- **Redux**: Utilized for efficient state management with reduced boilerplate and improved TypeScript integration.
- **Material UI**: Provides a consistent design with accessible and responsive components.
- **Vitest**: Each component and slice has its own test file to ensure proper functionality and prevent regressions.
- **Type Safety**: TypeScript is used throughout the application to catch errors at compile time and improve documentation.

## Code Architecture

- **createAppSlice**: Custom wrapper around Redux Toolkit's `createSlice` with improved type inference
- **Selectors**: Each slice exports named selectors for type-safe state access
- **Redux Thunks**: Async operations are handled via thunks for predictable side effects
- **Testing**: Components are tested with Vitest
