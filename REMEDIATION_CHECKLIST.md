# CODE QUALITY REMEDIATION CHECKLIST
**Priority Level:** HIGH | **Estimated Effort:** 17-26 hours

---

## PHASE 1: QUICK WINS (Est. 2 hours)

### 1.1 Rename Typo Files
- [ ] Rename `/home/user/POS/src/lib/util/Dashboradutils.ts` → `DashboardUtils.ts`
- [ ] Rename `/home/user/POS/src/lib/util/DsahboradApi.ts` → `DashboardApi.ts`
- [ ] Rename `/home/user/POS/src/lib/hooks/useSatffManagement.ts` → `useStaffManagement.ts`
- [ ] Rename `/home/user/POS/src/lib/hooks/useSatffFiltering.ts` → `useStaffFiltering.ts`
- [ ] Update all imports in components
- [ ] Verify all imports resolve

**Verification:**
```bash
grep -r "Dashborad\|Dsahborad\|Satff" src/
# Should return 0 results
```

---

### 1.2 Fix Import Paths After Renaming
- [ ] Update all imports in `/src` that reference renamed files
- [ ] Run TypeScript compiler to verify: `npx tsc --noEmit`
- [ ] Test application in browser

---

## PHASE 2: API CLIENT MIGRATION (Est. 4-6 hours)

### 2.1 Create API Client Migration Template
- [ ] Create `migration-template.ts` showing the before/after pattern
- [ ] Document the conversion process
- [ ] Identify which services to start with (recommend: menu-service.ts first)

### 2.2 Migrate Services to Centralized API Client
Follow this pattern for each service:

#### For each service file:
- [ ] Remove `function getToken()` 
- [ ] Remove `function getTenantSlug()`
- [ ] Remove `function getTenantId()`
- [ ] Remove `function buildHeaders()`
- [ ] Remove `function buildUrl()`
- [ ] Remove `const REMOTE_BASE = ...`
- [ ] Remove `const USE_PROXY = ...`
- [ ] Remove `const XXX_BASE = ...`

Replace with:
```typescript
import { buildApiUrl, buildApiHeaders, apiClient, normalizeApiResponse } from '@/lib/util/api-client';
import { ApiResponse } from '@/lib/types';
```

Update all fetch calls from:
```typescript
const response = await fetch(buildUrl(path), {
  method: "GET",
  headers: buildHeaders(),
});
```

To:
```typescript
const response = await apiClient(path, { method: "GET" });
```

#### Services to migrate (in order):
1. [ ] `/home/user/POS/src/lib/services/menu-service.ts`
2. [ ] `/home/user/POS/src/lib/services/category-service.ts`
3. [ ] `/home/user/POS/src/lib/services/combo-service.ts`
4. [ ] `/home/user/POS/src/lib/services/ingredient-service.ts`
5. [ ] `/home/user/POS/src/lib/services/modifier-service.ts`
6. [ ] `/home/user/POS/src/lib/services/addons-groups-service.ts`
7. [ ] `/home/user/POS/src/lib/services/addons-items-service.ts`
8. [ ] `/home/user/POS/src/lib/services/branch-service.ts`
9. [ ] `/home/user/POS/src/lib/services/categories-service.ts`
10. [ ] `/home/user/POS/src/lib/services/inventory-service.ts`
11. [ ] `/home/user/POS/src/lib/services/menu-category-service.ts`
12. [ ] `/home/user/POS/src/lib/services/menu-item-service.ts`
13. [ ] `/home/user/POS/src/lib/services/recipe-service.ts`
14. [ ] `/home/user/POS/src/lib/services/recipe-variant-service.ts`
15. [ ] `/home/user/POS/src/lib/services/recipe-variants-service.ts`

**Verification after each service:**
```bash
npx tsc --noEmit
npm run build:incremental
# Test the component using this service
```

---

## PHASE 3: CENTRALIZE RESPONSE TYPES (Est. 1-2 hours)

### 3.1 Update types/index.ts
- [ ] Export unified `ApiResponse<T>` interface
- [ ] Export `ApiListResponse<T>` interface
- [ ] Add JSDoc comments
- [ ] Remove duplicate definitions

### 3.2 Update All Services
For each of the 15 services:
- [ ] Remove local `interface ApiResponse<T>` definition
- [ ] Remove local `interface ApiListResponse<T>` definition
- [ ] Add import: `import { ApiResponse, ApiListResponse } from '@/lib/types';`
- [ ] Verify types still work

**Verification:**
```bash
grep -r "interface ApiResponse\|interface ApiListResponse" src/lib/services/
# Should return 0 results (all moved to types/index.ts)
```

---

## PHASE 4: REFACTOR MEGA HOOKS (Est. 8-12 hours)

### 4.1 Create Composite Hooks
For each mega hook, extract common patterns:

#### Extraction Pattern 1: Data Fetching
```typescript
// New: useDataFetching.ts
export function useDataFetching<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchFn();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, dependencies);

  return { data, loading, error };
}
```

#### Extraction Pattern 2: Filter State
```typescript
// New: useFilterState.ts
export function useFilterState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  return {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    filtered
  };
}
```

#### Extraction Pattern 3: Modal State
```typescript
// New: useModalState.ts
export function useModalState<T = null>() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  return {
    isOpen, setIsOpen,
    editingItem, setEditingItem,
    open: (item?: T) => {
      setEditingItem(item || null);
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
      setEditingItem(null);
    }
  };
}
```

### 4.2 Refactor Mega Hooks
- [ ] `/home/user/POS/src/lib/hooks/useCategoryData.ts` (318 lines)
  - Extract filter state
  - Extract data fetching
  - Extract modal logic
  - Target: 100 lines
  
- [ ] `/home/user/POS/src/lib/hooks/useRecipeVariations.ts` (321 lines)
  - Extract filter state
  - Extract variant operations
  - Target: 120 lines

- [ ] `/home/user/POS/src/lib/hooks/inventoryManagement.ts` (347 lines)
  - Extract filter state
  - Extract inventory operations
  - Target: 150 lines

- [ ] `/home/user/POS/src/lib/hooks/useMenuOptions.ts` (369 lines)
  - Extract filter state
  - Extract menu operations
  - Target: 150 lines

- [ ] `/home/user/POS/src/lib/hooks/useIngredientsData.ts` (384 lines)
  - Extract filter state
  - Extract ingredient operations
  - Target: 150 lines

- [ ] `/home/user/POS/src/lib/hooks/useMenuItemData.ts` (398 lines)
  - Extract filter state
  - Extract menu item operations
  - Target: 150 lines

- [ ] `/home/user/POS/src/lib/hooks/useRecipeData.ts` (477 lines) - LARGEST
  - Extract filter state
  - Extract recipe operations
  - Extract category/recipe loading
  - Target: 150 lines

**Verification:**
```bash
wc -l src/lib/hooks/use*.ts src/lib/hooks/*Hook.ts | sort -n
# Verify all hooks are now <200 lines
```

---

## PHASE 5: REDUCE 'ANY' TYPES (Est. 2-3 hours)

### 5.1 Create Proper Type Definitions
For each service with high 'any' count, create proper types:

```typescript
// For inventory-service.ts (10 'any' types)
interface InventoryPayload {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  // ... other fields
}

interface InventoryItem extends InventoryPayload {
  id: string;
  created_at: string;
}
```

### 5.2 Replace 'any' in Error Handling
Change from:
```typescript
catch (error: any) {
  console.error(error);
  return { success: false, message: error.message };
}
```

To:
```typescript
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  return { success: false, message };
}
```

### 5.3 Key Services to Fix
- [ ] `/home/user/POS/src/lib/services/inventory-service.ts` (10 'any' types)
- [ ] `/home/user/POS/src/lib/services/recipe-variants-service.ts` (8 'any' types)
- [ ] `/home/user/POS/src/lib/services/recipe-variant-service.ts` (7 'any' types)
- [ ] `/home/user/POS/src/lib/services/menu-service.ts` (5 'any' types)
- [ ] `/home/user/POS/src/lib/services/recipe-service.ts` (5 'any' types)
- [ ] `/home/user/POS/src/lib/services/menu-category-service.ts` (5 'any' types)

**Verification:**
```bash
grep -r ": any\b" src/lib/services/ | wc -l
# Target: < 10 remaining 'any' types
```

---

## PHASE 6: CLEANUP CONSOLE STATEMENTS (Est. 1-2 hours)

### 6.1 Remove Non-Essential Console Logs
Keep only:
- `console.error()` for error handling (production acceptable)
- Remove: `console.log()`, `console.warn()`, `console.debug()`

### 6.2 Standardize Error Logging
All errors should follow:
```typescript
console.error("Context:", errorMessage, "Details:", errorData);
```

**Verification:**
```bash
grep -r "console\.log\|console\.debug" src/ | wc -l
# Target: 0 (only console.error should remain)
```

---

## TESTING & VERIFICATION

### End-to-End Testing
After each phase:
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Builds successfully: `npm run build`
- [ ] No ESLint errors: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Manual browser testing of affected features

### Final Verification Checklist
- [ ] All 4 typo files renamed
- [ ] All 15 services use centralized api-client
- [ ] All response types imported from types/index.ts
- [ ] All mega hooks reduced to <200 lines
- [ ] 'any' type count reduced from 86+ to <10
- [ ] console.log statements removed (0)
- [ ] Silent error catches: 0 (already fixed)
- [ ] Code duplication: 1,500 lines → <500 lines

---

## COMMIT STRATEGY

### Recommended Commits:
1. `refactor: rename typo files (Dashboard, Staff)`
2. `refactor: migrate services to centralized api-client`
3. `refactor: centralize ApiResponse types in types/index.ts`
4. `refactor: extract composite hooks from mega hooks`
5. `refactor: improve TypeScript - replace any types with proper generics`
6. `refactor: remove non-essential console statements`
7. `refactor: complete code quality improvements`

---

## SUCCESS CRITERIA

Upon completion:
- [ ] 0 silent error catches
- [ ] 0 file name typos
- [ ] 1,500 lines of duplication → <300 lines
- [ ] 15/15 services using api-client (100%)
- [ ] Response types centralized (0 duplicates)
- [ ] 0 mega hooks (all <200 lines)
- [ ] <10 'any' types remaining
- [ ] <50 console statements in codebase

**Expected Time: 17-26 hours of focused work**

---

## PROGRESS TRACKING

Use this section to track completion:

```
Phase 1 (Quick Wins):     [ ] 0% → [ ] 100%
Phase 2 (API Migration):  [ ] 0% → [ ] 100%
Phase 3 (Types):          [ ] 0% → [ ] 100%
Phase 4 (Hooks):          [ ] 0% → [ ] 100%
Phase 5 ('any' types):    [ ] 0% → [ ] 100%
Phase 6 (Console):        [ ] 0% → [ ] 100%

Total Completion: 0% → 100%
```

