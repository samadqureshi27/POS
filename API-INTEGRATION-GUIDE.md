# API Integration Guide - Lessons Learned

**Date:** 2025-01-27
**Project:** POS System - Tenant API Integration

## Critical Rules - READ BEFORE INTEGRATING ANY API

### 1. **Response Structure Patterns**

The backend uses **MULTIPLE response formats** depending on the endpoint:

#### Login/Auth Endpoints Response:
```json
{
  "status": 200,
  "message": "Login successful",
  "result": {
    "token": "jwt_token_here",
    "user": { /* user object */ }
  }
}
```
**Parse as:** `data.result.token` and `data.result.user`

#### List Endpoints Response:
```json
{
  "status": 200,
  "message": "Success",
  "items": [ /* array of items */ ],
  "count": 10,
  "page": 1,
  "limit": 20
}
```
**Parse as:** `data.items` (NOT `data.result` or `data.data`)

#### Single Item Endpoints Response (GET/POST/PUT):
```json
{
  "status": 200,
  "message": "Success",
  "result": { /* single item object */ }
}
```
**Parse as:** `data.result`

#### Error Response:
```json
{
  "status": 400,
  "message": "Validation failed",
  "details": [ /* error details */ ]
}
```

---

### 2. **Required Headers for ALL Tenant APIs**

```typescript
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer <token>",  // For authenticated endpoints
  "x-tenant-id": "<tenant_slug>"      // ALWAYS required for /t/* routes
}
```

**Critical Notes:**
- Header is `x-tenant-id` NOT `x-tenant-slug`
- Value can be either tenant slug OR tenant ID
- Missing this header = 401/403 errors

---

### 3. **Authentication Token Management**

**Problem:** Tokens not persisting after page reload

**Root Cause:** `AuthService` class stores token in memory (`this.token`), but on reload, the constructor runs before localStorage is available.

**Solution:**
```typescript
// ALWAYS read from localStorage, not in-memory variable
getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.token = token; // Sync in-memory
      return token;
    }
  }
  return this.token;
}
```

**Apply this pattern to:**
- `getToken()`
- `isAuthenticated()`
- All methods that use `this.token` → call `this.getToken()` instead

---

### 4. **Proxy Route Pattern**

All frontend requests MUST go through Next.js API routes (proxy) to avoid CORS.

**File Structure:**
```
src/app/api/t/
├── auth/
│   ├── login/route.ts
│   ├── me/route.ts
│   └── logout/route.ts
├── branches/
│   ├── route.ts              # GET list, POST create
│   ├── [id]/route.ts         # GET one, PUT update, DELETE
│   ├── [id]/default/route.ts
│   └── [id]/settings/route.ts
```

**Route Template:**
```typescript
import { NextResponse } from "next/server";
import { buildTenantHeaders, getRemoteBase } from "@/app/api/_utils/proxy-helpers";

export async function GET(req: Request) {
  try {
    const url = `${getRemoteBase()}/t/endpoint`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildTenantHeaders(req, true) // true = include auth
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: { "content-type": contentType },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy failed" },
      { status: 500 }
    );
  }
}
```

---

### 5. **Service Layer Pattern**

**File:** `src/lib/services/<entity>-service.ts`

```typescript
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";
const BASE_PATH = "/t/entity";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

function getToken(): string | null {
  const t = AuthService.getToken();
  if (t) return t;
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("accessToken") || null;
  }
  return null;
}

function buildHeaders(): Record<string, string> {
  const token = getToken();
  const slug = getTenantSlug();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (slug) headers["x-tenant-id"] = slug;
  return headers;
}

export const EntityService = {
  async list(): Promise<ApiListResponse<Entity[]>> {
    const url = buildUrl(`${BASE_PATH}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || "List failed" };
    }

    // CRITICAL: Check response format - usually data.items for lists
    const items: Entity[] = data?.items ?? data?.result ?? [];
    return { success: true, data: items };
  },

  async get(id: string): Promise<ApiListResponse<Entity>> {
    const url = buildUrl(`${BASE_PATH}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || "Get failed" };
    }

    // CRITICAL: Check response format - usually data.result for single items
    const item: Entity = data?.result ?? data;
    return { success: true, data: item };
  },

  async create(payload: Partial<Entity>): Promise<ApiListResponse<Entity>> {
    const url = buildUrl(`${BASE_PATH}`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || "Create failed" };
    }

    const item: Entity = data?.result ?? data;
    return { success: true, data: item };
  },

  async update(id: string, payload: Partial<Entity>): Promise<ApiListResponse<Entity>> {
    const url = buildUrl(`${BASE_PATH}/${id}`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: data?.message || "Update failed" };
    }

    const item: Entity = data?.result ?? data;
    return { success: true, data: item };
  },

  async delete(id: string): Promise<ApiListResponse<null>> {
    const url = buildUrl(`${BASE_PATH}/${id}`);
    const res = await fetch(url, { method: "DELETE", headers: buildHeaders() });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data?.message || "Delete failed" };
    }

    return { success: true, data: null };
  },
};
```

---

### 6. **Common Validation Errors**

#### 400 Bad Request - "field is required"
**Cause:** Missing required fields in payload

**Solution:** Check Postman collection for EXACT required fields. Example for branches:
```typescript
{
  name: "Branch Name",        // REQUIRED
  code: "branch-code",        // REQUIRED
  timezone: "Asia/Karachi",   // REQUIRED
  currency: "PKR",            // REQUIRED
  address: {
    city: "City"              // REQUIRED
  }
}
```

**DO NOT assume optional fields** - check Postman first!

---

### 7. **Debugging Checklist**

When an API call fails, check in this order:

1. **Network Tab:**
   - Is request going to `/api/t/*` (proxy) or direct to backend?
   - Are headers present? (`Authorization`, `x-tenant-id`)
   - What's the response status code?
   - What's the response body?

2. **Console Logs:**
   - Is token being retrieved? (Check `getToken()` logs)
   - What's the actual response structure?
   - What keys does the response object have?

3. **localStorage:**
   ```js
   console.log('accessToken:', localStorage.getItem('accessToken'));
   console.log('user:', localStorage.getItem('user'));
   console.log('tenant_slug:', localStorage.getItem('tenant_slug'));
   ```

4. **Common Fixes:**
   - 401 Unauthorized → Check token is being sent in headers
   - 400 Bad Request → Check required fields in payload
   - Empty data → Check response parsing (`.items` vs `.result` vs `.data`)
   - CORS error → Ensure using proxy, not direct API calls

---

### 8. **Auth Flow on Page Load**

**Issue:** Page requires login after every reload

**Root Cause:** `/t/auth/me` endpoint fails during auth initialization

**Solution:**
1. `useAuth` hook waits for token from localStorage
2. Calls `/t/auth/me` to verify token is valid
3. Sets `isAuthenticated = true` only after verification
4. Page components wait for `isAuthenticated` before loading data

**Critical Pattern:**
```typescript
// In page component
React.useEffect(() => {
  if (!authLoading && isAuthenticated) {
    loadData(); // Only load after auth is confirmed
  }
}, [authLoading, isAuthenticated]);
```

**DO NOT load data on mount** - wait for auth!

---

### 9. **Environment Variables**

```env
NEXT_PUBLIC_API_BASE_URL=https://api.tritechtechnologyllc.com
NEXT_PUBLIC_USE_API_PROXY=true  # ALWAYS true for production
NEXT_PUBLIC_TENANT_SLUG=extraction-testt
```

---

### 10. **Testing New API Integration Checklist**

Before marking integration as "done":

- [ ] Proxy route created in `/app/api/t/*`
- [ ] Service file created with proper response parsing
- [ ] Token is included in authenticated requests
- [ ] `x-tenant-id` header is included
- [ ] Response structure matches backend (test with console.log)
- [ ] Error handling implemented
- [ ] Required fields validated (check Postman)
- [ ] Test: Login → Use API → Reload → API still works
- [ ] Test: Create/Update/Delete operations
- [ ] Test: List operation shows data correctly

---

## Quick Reference: Response Parsing

| Endpoint Type | Response Format | Parse As |
|--------------|-----------------|----------|
| Login/Auth | `{ result: { token, user } }` | `data.result` |
| List (branches, users, etc.) | `{ items: [...], count, page }` | `data.items` |
| Get/Create/Update single | `{ result: {...} }` | `data.result` |
| Delete | `{ message }` | `data.message` |

---

## Known Issues & Solutions

### Issue: Token not persisting
**Solution:** Use `getToken()` method that reads from localStorage, not `this.token`

### Issue: CORS errors
**Solution:** Ensure `USE_PROXY = true` and requests go to `/api/t/*`

### Issue: 401 Unauthorized
**Solution:** Check `Authorization: Bearer <token>` and `x-tenant-id` headers are present

### Issue: Empty data array after successful 200 response
**Solution:** Check response parsing - likely using wrong key (`data.result` vs `data.items`)

### Issue: "field is required" validation error
**Solution:** Check Postman collection for required fields, add ALL of them

---

---

## 11. **Successful Integration Examples**

### Categories Integration ✅
**Endpoint:** `/t/catalog/categories`

**Backend Fields (Core):**
- `name` (required) - Category name
- `slug` (required) - URL-friendly identifier, auto-generated from name
- `sortIndex` (optional) - Display order, defaults to 0
- `isActive` (optional) - Active status, defaults to true

**Frontend Fields (Stubbed):**
- `Description` - Not in API, stubbed as empty string
- `Parent` - Not in API, stubbed for future hierarchy support
- `Image` - Not in API, stubbed for future image support

**Key Learnings:**
- Backend returns `{ items: [...] }` for list endpoint
- Auto-generate slug from name: `name.toLowerCase().replace(/\s+/g, '-')`
- Store `backendId` in frontend types for update/delete operations
- Map `isActive` boolean to frontend "Active"/"Inactive" status strings

**Files Created:**
- `/src/app/api/t/catalog/categories/route.ts`
- `/src/app/api/t/catalog/categories/[id]/route.ts`
- `/src/lib/services/category-service.ts`
- Updated `/src/lib/hooks/useCategory.ts`

---

### Modifiers Integration ✅
**Endpoint:** `/t/catalog/modifiers`

**Backend Fields:**
- `name` (required) - Modifier group name
- `key` (required) - Slug/key identifier, auto-generated from name
- `selection` (required) - "single" or "multiple"
- `min` (required) - Minimum selections allowed
- `max` (required) - Maximum selections allowed
- `options` (required) - Array of `{ name: string, price?: number }`

**Frontend to Backend Mapping:**

The frontend uses `DisplayType` ("Radio" | "Select" | "Checkbox") which maps to backend fields:

| DisplayType | selection | min | max | Use Case |
|------------|-----------|-----|-----|----------|
| Radio | "single" | 0 | 1 | Choose one option |
| Select | "single" | 0 | length | Choose multiple but one at a time |
| Checkbox | "multiple" | 0 | length | Choose multiple simultaneously |

**Data Structure Conversion:**

Frontend uses parallel arrays:
```typescript
{
  OptionValue: ["Small", "Medium", "Large"],
  OptionPrice: [0, 50, 100]
}
```

Backend uses object array:
```typescript
{
  options: [
    { name: "Small", price: 0 },
    { name: "Medium", price: 50 },
    { name: "Large", price: 100 }
  ]
}
```

**Conversion Logic:**
```typescript
// Frontend → Backend (Create/Update)
const options = itemData.OptionValue.map((name, idx) => ({
  name,
  price: itemData.OptionPrice[idx] || 0,
}));

// Backend → Frontend (List/Get)
const optionValues = apiMod.options?.map(opt => opt.name) || [];
const optionPrices = apiMod.options?.map(opt => opt.price || 0) || [];
```

**Key Learnings:**
- DisplayType is purely frontend presentation logic
- Backend `selection` + `min`/`max` controls validation rules
- Always reload list after create/update to sync IDs
- Store `backendId` separately from frontend `ID` (index-based)
- Use `key` field auto-generated from name for API consistency

**Files Created:**
- `/src/app/api/t/catalog/modifiers/route.ts`
- `/src/app/api/t/catalog/modifiers/[id]/route.ts`
- `/src/lib/services/modifier-service.ts`
- Updated `/src/lib/hooks/useMenuOptions.ts`
- Updated `/src/lib/types/menuItemOptions.ts`

---

## 12. **Data Transformation Patterns**

### Pattern 1: Parallel Arrays ↔ Object Array
**Use Case:** Options, variants, configurations

```typescript
// Frontend (parallel arrays) - easier for form inputs
interface FrontendData {
  names: string[];
  prices: number[];
}

// Backend (object array) - better data integrity
interface BackendData {
  items: Array<{ name: string; price: number }>;
}

// Convert Frontend → Backend
const backendItems = frontendData.names.map((name, idx) => ({
  name,
  price: frontendData.prices[idx] || 0,
}));

// Convert Backend → Frontend
const frontendNames = backendData.items.map(item => item.name);
const frontendPrices = backendData.items.map(item => item.price || 0);
```

### Pattern 2: Display Type ↔ Validation Rules
**Use Case:** UI controls that map to backend validation

```typescript
// Frontend display type
type DisplayType = "Radio" | "Select" | "Checkbox";

// Backend validation rules
interface ValidationRules {
  selection: "single" | "multiple";
  min: number;
  max: number;
}

// Mapping function
function mapDisplayToValidation(
  displayType: DisplayType,
  optionsCount: number
): ValidationRules {
  if (displayType === "Checkbox") {
    return { selection: "multiple", min: 0, max: optionsCount };
  } else if (displayType === "Select") {
    return { selection: "single", min: 0, max: optionsCount };
  } else { // Radio
    return { selection: "single", min: 0, max: 1 };
  }
}
```

### Pattern 3: Boolean ↔ Status String
**Use Case:** Active/inactive states

```typescript
// Backend uses boolean
interface BackendEntity {
  isActive: boolean;
}

// Frontend uses string for display
interface FrontendEntity {
  Status: "Active" | "Inactive";
}

// Convert Backend → Frontend
const status = backendEntity.isActive ? "Active" : "Inactive";

// Convert Frontend → Backend
const isActive = frontendEntity.Status === "Active";
```

### Menu Items Integration ✅
**Endpoint:** `/t/catalog/items`

**Backend Fields:**
- `name` (required) - Item name
- `slug` (optional) - URL identifier, auto-generated from name
- `categoryIds` (optional) - Array of category IDs
- `imageUrl` (optional) - Image URL
- `description` (optional) - Item description
- `variants` (required) - Array of `{ name: string, price: number }`
- `modifiers` (optional) - Array of `{ groupId: string, required?: boolean, min?: number, max?: number }`
- `isActive` (optional) - Active status, defaults to true
- `featured` (optional) - Featured status, defaults to false
- `priority` (optional) - Display order, defaults to 0
- `trackStock` (optional) - Enable stock tracking
- `stockQty` (optional) - Current stock quantity
- `minStockThreshold` (optional) - Minimum stock threshold

**Frontend to Backend Mapping:**

Frontend has complex display types ("Single" vs "Var") which map to backend variants:

| Frontend Displaycat | Backend Variants |
|-------------------|------------------|
| Single | `[{ name: "Regular", price: formData.Price }]` |
| Var (Multi-price) | `PName` and `PPrice` arrays → `variants` array |

**Data Structure Conversion:**

Frontend uses parallel arrays for variants:
```typescript
{
  PName: ["Small", "Medium", "Large"],
  PPrice: [460, 540, 620]
}
```

Backend uses object array:
```typescript
{
  variants: [
    { name: "Small", price: 460 },
    { name: "Medium", price: 540 },
    { name: "Large", price: 620 }
  ]
}
```

**Conversion Logic:**
```typescript
// Frontend → Backend (Create/Update)
const variants = [];
if (formData.Displaycat === "Var") {
  for (let i = 0; i < formData.PName.length; i++) {
    variants.push({
      name: formData.PName[i],
      price: formData.PPrice[i],
    });
  }
} else {
  variants.push({
    name: "Regular",
    price: formData.Price,
  });
}

// Backend → Frontend (List/Get)
const price = apiItem.variants?.[0]?.price || 0;
const pName = apiItem.variants?.map(v => v.name) || [];
const pPrice = apiItem.variants?.map(v => v.price) || [];
```

**Category Mapping:**
Frontend stores category as string name, backend uses array of IDs:
```typescript
// Frontend → Backend
const category = categories.find(cat => cat.Name === formData.Category);
const categoryIds = category?.backendId ? [category.backendId] : [];

// Backend → Frontend
const categoryId = apiItem.categoryIds?.[0] || "";
const category = categories.find(cat => cat.backendId === categoryId);
const categoryName = category?.Name || "";
```

**Frontend Fields (Stubbed):**
- `MealType` - Not in API, stubbed as "All Day"
- `ShowOnMenu`, `StaffPick`, `ShowOnMain`, `Deal`, `Special`, `SubTBE` - Not in API
- `SpecialStartDate`, `SpecialEndDate`, `SpecialPrice` - Not in API (use pricing rules in future)
- `OverRide`, `OptionValue`, `OptionPrice`, `MealValue`, `MealPrice` - Not in API

**Key Learnings:**
- Items MUST have at least one variant (use "Regular" for single-price items)
- Frontend `Price` field maps to first variant's price
- Frontend `Category` string must be resolved to backend category ID
- Frontend `Displaycat` determines single vs multi-variant structure
- Store `backendId` separately from frontend `ID` (index-based)
- Modifiers connect via `groupId` (modifier group's backend ID)
- Use `priority` field to control POS display order

**Files Created:**
- `/src/app/api/t/catalog/items/route.ts`
- `/src/app/api/t/catalog/items/[id]/route.ts`
- `/src/lib/services/menu-item-service.ts`
- Updated `/src/lib/hooks/useMenuManagement.ts`

### Combos/Meals Integration ⚠️ (Service Ready, UI Deferred)
**Endpoint:** `/t/catalog/combos`

**Backend Fields:**
- `name` (required) - Combo name
- `slug` (required) - URL identifier, auto-generated from name
- `priceMode` (required) - "fixed" or "additive"
- `basePrice` (required) - Base price for the combo
- `currency` (optional) - Currency code, defaults to "PKR"
- `courses` (required) - Array of combo courses:
  - `name` - Course name (e.g., "Main", "Side", "Drink")
  - `min` - Minimum selections
  - `max` - Maximum selections
  - `source` - "category" or "items"
  - `categoryId` - If source is "category"
  - `itemIds` - If source is "items"
- `branchIds` (optional) - Array of branch IDs
- `active` (optional) - Active status, defaults to true

**Frontend Meal Tab Structure (Current):**
```typescript
{
  MealValue: ["Burger", "Fries", "Coke"],
  MealPrice: [500, 150, 100],
  OverRide: ["Active", "Inactive", "Inactive"],
  status: ["Active", "Active", "Active"]
}
```

**Backend Combo Structure:**
```typescript
{
  name: "Burger Meal",
  priceMode: "fixed",
  basePrice: 999,
  courses: [
    {name: "Main", min: 1, max: 1, source: "category", categoryId: "abc123"},
    {name: "Side", min: 1, max: 1, source: "items", itemIds: ["fries_id"]},
    {name: "Drink", min: 1, max: 1, source: "items", itemIds: ["coke_id"]}
  ]
}
```

**Status: ⚠️ Service Ready, UI Integration Deferred**

**Why Deferred:**
- Frontend Meal tab: Simple item list with individual prices
- Backend Combo API: Course-based with min/max selections and category/item sources
- Structural mismatch requires UI redesign to fully support combo features

**What's Ready:**
- ✅ Combo proxy routes created
- ✅ ComboService with full CRUD operations
- ⚠️ Meal tab keeps existing local-only functionality

**Recommendation:**
- Use ComboService directly in POS/order flow when implementing combo selection
- Meal tab remains available for simple meal tracking (local only)
- Future: Build new Combo UI component matching backend course structure

**Files Created:**
- `/src/app/api/t/catalog/combos/route.ts`
- `/src/app/api/t/catalog/combos/[id]/route.ts`
- `/src/lib/services/combo-service.ts`


## Next APIs to Integrate (Priority Order)

Based on POS system requirements:

1. ~~**Categories**~~ ✅ - `/t/catalog/categories` (Product organization)
2. ~~**Modifiers**~~ ✅ - `/t/catalog/modifiers` (Menu item options)
3. ~~**Menu Items**~~ ✅ - `/t/catalog/items` (Products/Items)
4. ~~**Combos**~~ ⚠️ - `/t/catalog/combos` (Service ready, UI deferred)
5. **Orders** - `/t/orders` (Sales transactions)
6. **Users/Staff** - `/t/auth/users` (User management)
7. **POS Sessions** - `/t/pos-sessions` (Shift management)
8. **Payments** - `/t/payments` (Payment processing)
9. **Reports** - `/t/reports` (Analytics)

---

**Last Updated:** 2025-01-27
**Status:** Login ✅ | Branches ✅ | Categories ✅ | Modifiers ✅ | Menu Items ✅ | Combos ⚠️ | Next: Orders
