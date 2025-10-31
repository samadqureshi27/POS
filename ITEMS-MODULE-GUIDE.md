# Items Module - Futuristic Inventory Management System

## Overview

The **Items Module** is the backbone of your POS system - a cutting-edge, 2077-inspired inventory management hub that provides a modern, interactive experience for managing inventory items, units, and conversions.

## 🚀 Key Features

### 1. **Futuristic UI Design**
- **Gradient backgrounds** with animated pulse effects
- **Glass-morphism** design with backdrop blur
- **Color-coded status indicators** (green, yellow, red, purple)
- **Hover effects** with smooth transitions
- **Dark theme** optimized for long sessions
- **Responsive design** for desktop, tablet, and mobile

### 2. **Smart Stats Dashboard**
- Real-time inventory statistics
- Total items count
- Stock-tracked items
- Low stock alerts
- Out of stock warnings

### 3. **Advanced Filtering & Search**
- Real-time search by name, SKU, or barcode
- Filter by type (Stock, Service, All)
- Grid and List view modes
- Category filtering support

### 4. **Units Management System**
- Define custom measurement units
- Support for mass, volume, count, length, and custom types
- Visual unit type badges with color coding
- Easy unit creation and deletion

### 5. **Conversion System**
- Create conversion factors between units
- Visual conversion display (kg → g × 1000)
- Automatic conversion calculations
- Support for purchase-to-base conversions

### 6. **Inventory Item Management**
- Add/Edit inventory items with rich forms
- Track stock levels with reorder points
- Visual stock level indicators
- Support for stockable and service items
- SKU and barcode tracking
- Category organization
- Tax category support

## 📂 File Structure

```
src/
├── app/
│   ├── (items-management)/
│   │   └── items/
│   │       ├── page.tsx                           # Main Items page
│   │       └── _components/
│   │           ├── inventory-grid.tsx              # Grid/List view component
│   │           ├── inventory-item-modal.tsx        # Add/Edit item modal
│   │           └── units-management-modal.tsx      # Units & Conversions modal
│   └── api/
│       └── t/
│           └── inventory/
│               ├── items/
│               │   ├── route.ts                    # List & Create items
│               │   └── [id]/route.ts               # Get, Update, Delete item
│               ├── units/
│               │   └── route.ts                    # List & Create units
│               ├── conversions/
│               │   └── route.ts                    # List & Create conversions
│               └── txns/
│                   └── route.ts                    # Stock adjustments
├── lib/
│   └── services/
│       └── inventory-service.ts                    # Service layer for all APIs
└── components/
    └── Sidebar.tsx                                 # Updated with Items link
```

## 🎯 User Flow

### First-Time Setup (Recommended Order)

1. **Navigate to Items**
   - Click the **Items** icon in the sidebar (second icon after Dashboard)

2. **Set Up Units First** ⚙️
   - Click the **"Units"** button (purple gradient)
   - Switch to **Units** tab
   - Add your measurement units:
     - **Mass:** gram (g), kilogram (kg), pound (lb)
     - **Volume:** milliliter (ml), liter (l), cup
     - **Count:** piece (pc), dozen, slice

3. **Create Conversions** 🔄
   - Switch to **Conversions** tab
   - Define conversion factors:
     - kg → g (factor: 1000)
     - l → ml (factor: 1000)
     - dozen → pc (factor: 12)

4. **Add Inventory Items** 📦
   - Click the **"Add Item"** button (blue gradient)
   - Fill in **Basic Info**:
     - Item name (required)
     - SKU (optional but recommended)
     - Type (Stock or Service)
     - Category
   - Configure **Stock & Units**:
     - Enable/disable stock tracking
     - Select base unit
     - Optional: Set purchase unit with conversion
     - Set reorder point for alerts
   - Add **Advanced** details:
     - Barcode
     - Tax category

## 🎨 Design Features

### Color System

| Status | Color | Usage |
|--------|-------|-------|
| **In Stock** | Green | Items above reorder point |
| **Low Stock** | Yellow | Items at or below reorder point |
| **Out of Stock** | Red | Items with zero quantity |
| **Service** | Purple | Non-stock items |

### Visual Hierarchy

1. **Header** - Gradient title with stats bar
2. **Action Bar** - Search, filters, view toggle, primary actions
3. **Content Grid** - Cards with hover effects and overlays
4. **Modals** - Full-screen dialogs with tabs

### Interactive Elements

- **Hover states** - Cards scale up and show action buttons
- **Glass-morphism** - Translucent backgrounds with blur
- **Gradient buttons** - Eye-catching CTAs
- **Smooth transitions** - 200-300ms animations
- **Stock indicators** - Visual progress bars for reorder points

## 🔌 API Integration

### Endpoints

All endpoints use tenant-based authentication with `x-tenant-id` header.

#### Inventory Items
- **GET** `/t/inventory/items` - List all items
- **POST** `/t/inventory/items` - Create new item
- **GET** `/t/inventory/items/:id` - Get single item
- **PUT** `/t/inventory/items/:id` - Update item
- **DELETE** `/t/inventory/items/:id` - Delete item

#### Units
- **GET** `/t/inventory/units` - List all units
- **POST** `/t/inventory/units` - Create new unit
- **DELETE** `/t/inventory/units/:id` - Delete unit

#### Conversions
- **GET** `/t/inventory/conversions` - List all conversions
- **POST** `/t/inventory/conversions` - Create conversion
- **DELETE** `/t/inventory/conversions/:id` - Delete conversion

#### Stock Transactions
- **POST** `/t/inventory/txns` - Record stock adjustment

### Request Examples

#### Create Inventory Item (Stockable)
```json
POST /t/inventory/items
{
  "name": "Chicken Breast",
  "sku": "CHICK-BRST",
  "type": "stock",
  "baseUnit": "g",
  "purchaseUnit": "kg",
  "conversion": {
    "purchaseToBase": 1000
  },
  "trackStock": true,
  "category": "raw-protein",
  "reorderPoint": 5000,
  "barcode": "1234567890",
  "taxCategory": "food"
}
```

#### Create Unit
```json
POST /t/inventory/units
{
  "name": "kilogram",
  "symbol": "kg",
  "type": "mass"
}
```

#### Create Conversion
```json
POST /t/inventory/conversions
{
  "fromUnit": "kg",
  "toUnit": "g",
  "factor": 1000.0
}
```

## 🎓 Best Practices

### 1. **Start with Units**
Always define your units before adding inventory items. This ensures consistency across your system.

### 2. **Use Meaningful SKUs**
Create a SKU naming convention (e.g., CATEGORY-ITEM: `MEAT-CHKN-BRST`)

### 3. **Set Reorder Points**
For stock items, always set realistic reorder points to avoid stockouts.

### 4. **Organize by Category**
Use consistent category names (e.g., `raw-protein`, `dairy`, `vegetables`)

### 5. **Leverage Conversions**
Set up conversions for units you frequently use together (kg/g, l/ml)

## 🔮 Future Enhancements

Items planned for future releases:

- ✨ **Image upload** for inventory items
- 📊 **Stock level charts** and analytics
- 🔔 **Low stock notifications**
- 📦 **Batch operations** (bulk edit, import/export)
- 🏷️ **QR code generation** for items
- 📱 **Mobile scanning** with camera
- 🤖 **AI-powered** reorder suggestions
- 🌐 **Multi-branch** stock visibility

## 🛠️ Technical Details

### Service Layer Pattern
All API calls go through service layer (`inventory-service.ts`) which provides:
- Centralized authentication
- Consistent error handling
- Type safety with TypeScript
- Reusable API methods

### State Management
- React hooks (`useState`, `useEffect`) for local state
- Real-time data refresh after mutations
- Optimistic UI updates

### Styling Approach
- **Tailwind CSS** for utility classes
- **Custom gradients** for futuristic look
- **Backdrop blur** for glass-morphism
- **CSS animations** for smooth transitions

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                 Items Page (UI)                  │
│  ┌─────────────┐  ┌──────────────┐             │
│  │ Stats Cards │  │ Action Bar    │             │
│  └─────────────┘  └──────────────┘             │
│  ┌─────────────────────────────────────────┐   │
│  │         Inventory Grid/List              │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │   │
│  │  │Item│ │Item│ │Item│ │Item│  ...      │   │
│  │  └────┘ └────┘ └────┘ └────┘           │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          Inventory Service Layer                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Items API    │  │ Units API     │            │
│  │ Conversions  │  │ Transactions  │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Next.js API Routes (Proxy)            │
│  /api/t/inventory/items                         │
│  /api/t/inventory/units                         │
│  /api/t/inventory/conversions                   │
│  /api/t/inventory/txns                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Backend API (Express)                  │
│  https://api.tritechtechnologyllc.com           │
└─────────────────────────────────────────────────┘
```

## 🎉 Summary

The Items Module provides a **modern, futuristic interface** for inventory management with:
- ✅ Beautiful 2077-inspired design
- ✅ Complete CRUD operations
- ✅ Units and conversions management
- ✅ Real-time search and filtering
- ✅ Stock level monitoring
- ✅ Full API integration
- ✅ Responsive and accessible

This is the **foundation** of your POS system - recipes and menu items will reference these inventory items for cost calculations and stock deductions.

---

**Navigation:** Sidebar → Items (Package icon, second position)

**First Action:** Click "Units" button to set up measurement units
