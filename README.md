# POS Management System 🚀

**A Professional, Enterprise-Grade Point of Sale Management Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [API Integration](#api-integration)
- [Security](#security)
- [Performance](#performance)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

This is a comprehensive, production-ready **Point of Sale (POS) Management System** designed for restaurants, cafes, and retail businesses. Built with modern web technologies and industry best practices, it provides a robust, scalable, and user-friendly interface for managing all aspects of your business operations.

### Why This POS System?

✅ **Enterprise-Grade Architecture** - Scalable, maintainable, and production-ready
✅ **Type-Safe** - Full TypeScript coverage for reliability
✅ **Security First** - Industry-standard security practices implemented
✅ **Performance Optimized** - Fast, responsive, and efficient
✅ **Multi-Tenant** - Support for multiple branches and organizations
✅ **Comprehensive** - Complete solution from inventory to analytics

---

## ⭐ Key Features

### Core Functionality
- 🔐 **Multi-Role Authentication** - Admin, Manager, Cashier, and Waiter roles with PIN/password login
- 📊 **Real-Time Dashboard** - Comprehensive analytics and business insights
- 🛒 **Order Management** - Complete order lifecycle management
- 👥 **Customer Management** - Customer profiles, history, and loyalty tracking
- 📦 **Inventory Management** - Stock tracking, low-stock alerts, and supplier management
- 🍽️ **Menu Management** - Dynamic menu creation with categories, items, and modifiers
- 🧾 **Recipe Management** - Recipe tracking, costing, and ingredient management
- 💰 **Financial Reports** - Sales, revenue, and profitability analytics
- 🏢 **Multi-Branch Support** - Manage multiple locations from a single dashboard
- ⚙️ **System Settings** - Customizable settings for business operations

### Technical Excellence
- **Centralized Token Management** - Secure, single-source authentication
- **API Request Validation** - Zod schemas for all API endpoints
- **Error Boundaries** - Graceful error handling and recovery
- **Performance Utilities** - Debouncing, throttling, and memoization
- **CSP Headers** - Content Security Policy for XSS protection
- **ESLint Configuration** - Comprehensive code quality rules

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     POS Management System                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Next.js App │───▶│   API Proxy  │───▶│Backend API   │  │
│  │  (Frontend)  │    │   (/api/*)   │    │  (Django)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │    React     │    │  Validation  │    │   Database   │  │
│  │  Components  │    │   (Zod)      │    │ (PostgreSQL) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **API Proxy Pattern** - All backend requests go through Next.js API routes for:
   - Security (hiding backend URLs)
   - Request/response transformation
   - Centralized error handling
   - CORS management

2. **Centralized State Management** - Using React hooks and context for:
   - Authentication state
   - User session
   - Global application state

3. **Type-Safe Development** - TypeScript + Zod for:
   - Compile-time type checking
   - Runtime validation
   - Auto-completion and IntelliSense

4. **Security Layers**:
   - Content Security Policy (CSP) headers
   - HttpOnly cookies for tokens
   - Input validation on all endpoints
   - XSS and CSRF protection

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.4 (App Router)
- **Language:** TypeScript 5.0
- **UI Library:** React 19.1
- **Styling:** Tailwind CSS 3.0
- **UI Components:** Radix UI, shadcn/ui
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Development Tools
- **Linting:** ESLint (with custom rules)
- **Formatting:** Prettier
- **Type Checking:** TypeScript compiler

### Backend Integration
- **API Client:** Native Fetch API with custom utilities
- **Validation:** Zod schemas
- **Authentication:** JWT tokens (Bearer)
- **Multi-Tenancy:** Header-based tenant identification

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git**
- Access to backend API (URL and credentials)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd POS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and fill in your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
   NEXT_PUBLIC_TENANT_SLUG=your-tenant-slug
   # See .env.local.example for all available options
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### First-Time Setup

1. **Login** with your credentials
2. **Configure Branch Settings** in System Settings
3. **Set up Menu Categories** and Items
4. **Configure Inventory** items and units
5. **Create Staff Accounts** with appropriate roles
6. **Start Processing Orders**!

---

## 📁 Project Structure

```
POS/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Authentication pages
│   │   ├── (main)/                   # Main application pages
│   │   ├── (menu-management)/        # Menu management module
│   │   ├── (items-management)/       # Inventory module
│   │   ├── (recipes-management)/     # Recipe module
│   │   ├── (customer-management)/    # Customer module
│   │   ├── (analytics)/              # Reports and analytics
│   │   ├── branches-management/      # Multi-branch management
│   │   ├── api/                      # API routes (proxy layer)
│   │   ├── error.tsx                 # 🔥 Root error boundary
│   │   └── layout.tsx                # Root layout
│   │
│   ├── components/                   # Reusable React components
│   │   ├── ui/                       # UI primitives (shadcn/ui)
│   │   ├── error-boundary.tsx        # 🔥 Error boundary component
│   │   └── main-navbar.tsx           # Main navigation bar
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── hooks/                    # Custom React hooks (43 hooks)
│   │   ├── services/                 # API service layer (16 services)
│   │   ├── util/                     # Utility functions
│   │   │   ├── token-manager.ts      # 🔥 Centralized token management
│   │   │   ├── api-client.ts         # 🔥 Standardized API client
│   │   │   └── performance.ts        # 🔥 Performance utilities
│   │   ├── validations/              # Validation logic
│   │   │   └── api-schemas.ts        # 🔥 Zod validation schemas
│   │   ├── types/                    # TypeScript type definitions
│   │   └── auth-service.ts           # Authentication service
│   │
│   └── middleware.ts                 # 🔥 Next.js middleware (auth + security)
│
├── .env.local.example                # 🔥 Environment variables template
├── eslint.config.mjs                 # 🔥 ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Project dependencies
└── README.md                         # This file

🔥 = Newly improved/created files
```

---

## 💻 Development Guide

### Code Style

- **TypeScript** is required for all new files
- **ESLint** rules are enforced (run `npm run lint`)
- **No console.log** in production code (use `console.error` or `console.warn` only)

### Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Best Practices

✅ **Always use TypeScript** - No `.js` or `.jsx` files
✅ **Use custom hooks** - Abstract business logic from components
✅ **Validate API requests** - Use Zod schemas
✅ **Handle errors gracefully** - Use Error Boundaries
✅ **Optimize performance** - Use memo, useMemo, useCallback

---

## 🔌 API Integration

### API Client Usage

Use the centralized API client for all backend requests:

```typescript
import { api } from '@/lib/util/api-client';

// GET request
const items = await api.get('/t/menu/items');

// POST request
const newItem = await api.post('/t/menu/items', {
  name: 'Pizza',
  price: 12.99
});
```

### Authentication

All authenticated requests automatically include:
- `Authorization: Bearer <token>` header
- `x-tenant-id: <tenant-slug>` header
- `Content-Type: application/json` header

---

## 🔒 Security

### Security Features

1. **Content Security Policy (CSP)** - Prevents XSS attacks
2. **Authentication** - HttpOnly cookies for token storage
3. **Input Validation** - Zod schemas on all API routes
4. **Security Headers** - HSTS, X-Frame-Options, CSP, etc.
5. **Code Security** - No `innerHTML`, no `eval()`

### Security Best Practices

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Keep dependencies up to date
- Run `npm audit` regularly

---

## ⚡ Performance

### Performance Optimizations

1. **Component Optimization** - React.memo, useMemo, useCallback
2. **API Optimization** - Debouncing, caching, batch requests
3. **Bundle Optimization** - Code splitting, tree shaking
4. **Performance Utilities**:
   ```typescript
   import { debounce, throttle } from '@/lib/util/performance';
   ```

---

## 🚢 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deployment Platforms

**Recommended:** Vercel, AWS Amplify, Netlify, or Docker

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and type checking
4. Create a pull request

---

**Built with ❤️ to be the best POS system in the world!**
