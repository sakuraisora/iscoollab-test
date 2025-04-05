# Food Order System

An ordering application built with React, Redux Toolkit, TypeScript, Material UI and Vitest, packaged as a desktop application using Electron.

## Features

- **Menu**: Browse food items organized by categories
- **Cart**: Add items, adjust quantities, and submit orders
- **Order History**: View past orders with detailed information
- **Desktop Application**: Cross-platform desktop application for Windows, macOS, and Linux

## Tech Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Strong typing for improved developer experience and code quality
- **Redux Toolkit**: Modern state management with simplified boilerplate
- **Material UI**: Component library with pre-built accessible UI elements
- **Vite**: Build tool and development server
- **Vitest**: Testing framework for unit tests
- **Electron**: Framework for creating cross-platform desktop applications

## Prerequisites

- Node.js (>= v16)
- npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/sakuraisora/iscoollab-test.git
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

This will start both the React development server and Electron app.

## Building for Production

To build and package the application for different platforms:

- macOS (ARM64): `npm run dist:mac`
- Windows (x64): `npm run dist:win`
- Linux (x64): `npm run dist:linux`

## Project Structure

```
src/
├── app/                        # Redux store setup
│   ├── createAppSlice.ts       # Custom slice creator
│   ├── hooks.ts                # Type-safe Redux hooks
│   └── store.ts                # Redux store configuration
├── electron/                   # Electron main process code
│   ├── main.ts                 # Electron entry point
│   └── util.ts                 # Electron utilities
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
└── main.tsx                    # React entry point
```

## Available Scripts

- `npm run dev` - Start both React and Electron in development mode
- `npm run dev:react` - Start only the React development server
- `npm run dev:electron` - Start only the Electron app in development mode
- `npm run build:react` - Build the React application
- `npm run build:electron` - Build the Electron main process code
- `npm run dist:mac` - Package the app for macOS (ARM64)
- `npm run dist:win` - Package the app for Windows (x64)
- `npm run dist:linux` - Package the app for Linux (x64)
- `npm run preview` - Preview the production React build locally
- `npm run test` - Run all tests
- `npm run lint` - Run linting
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Run TypeScript type checking

## Design Decisions

- **Redux**: Utilized for efficient state management with reduced boilerplate and improved TypeScript integration.
- **Material UI**: Provides a consistent design with accessible and responsive components.
- **Vitest**: Each component and slice has its own test file to ensure proper functionality and prevent regressions.
- **Type Safety**: TypeScript is used throughout the application to catch errors at compile time and improve documentation.
- **Electron**: Enables distribution as a native desktop application while leveraging web technologies.

## Code Architecture

- **createAppSlice**: Custom wrapper around Redux Toolkit's `createSlice` with improved type inference
- **Selectors**: Each slice exports named selectors for type-safe state access
- **Redux Thunks**: Async operations are handled via thunks for predictable side effects
- **Testing**: Components are tested with Vitest
- **Electron Process Separation**: Main and renderer processes are properly separated
