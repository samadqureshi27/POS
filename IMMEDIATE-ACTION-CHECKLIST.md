# Immediate Action Checklist
## Critical Fixes for POS Management System

**Created:** 2025-11-18
**Priority:** 🔴 CRITICAL - Start Immediately

---

## This Week: Security & Critical Fixes

### Day 1: Security Vulnerabilities (4 hours)

#### Task 1: Fix API Authentication Bypass (2 hours) 🔴

**File:** `src/middleware.ts`

**Current Code (Line 15-16):**
```typescript
if (
  pathname.startsWith('/login') ||
  pathname.startsWith('/api') ||  // ❌ REMOVE THIS LINE
  pathname.startsWith('/_next')
) {
  return NextResponse.next();
}
```

**Fix:**
```typescript
// Define public API routes
const publicApiRoutes = [
  '/api/t/auth/login',
  '/api/t/auth/forgot-password',
  '/api/t/auth/pin-login',
  '/api/t/auth/reset-password'
];

if (
  pathname.startsWith('/login') ||
  publicApiRoutes.some(route => pathname.startsWith(route)) ||
  pathname.startsWith('/_next')
) {
  return NextResponse.next();
}

// Validate token for all other /api routes
if (pathname.startsWith('/api')) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // TODO: Add token validation logic
}
```

**Checklist:**
- [ ] Edit `src/middleware.ts`
- [ ] Remove `/api` bypass
- [ ] Add public route whitelist
- [ ] Add token validation for protected routes
- [ ] Test login flow
- [ ] Test protected API routes
- [ ] Test public API routes

---

#### Task 2: Remove Hardcoded Test Tenant (30 min) 🔴

**File:** `src/lib/util/proxy-helpers.ts` (line 8)

**Current Code:**
```typescript
const DEFAULT_TENANT_SLUG = 'extraction-testt'; // ❌ REMOVE
```

**Fix:**
```typescript
export function getTenantSlug(): string {
  const slug =
    process.env.NEXT_PUBLIC_TENANT_SLUG ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('tenantSlug')
      : null);

  if (!slug) {
    throw new Error('Tenant slug not configured. Set NEXT_PUBLIC_TENANT_SLUG environment variable.');
  }

  return slug;
}
```

**Checklist:**
- [ ] Edit `src/lib/util/proxy-helpers.ts`
- [ ] Remove `DEFAULT_TENANT_SLUG` constant
- [ ] Update `getTenantSlug()` to throw error if missing
- [ ] Verify `.env.local` has `NEXT_PUBLIC_TENANT_SLUG`
- [ ] Test application startup
- [ ] Test with missing tenant slug (should fail gracefully)

---

#### Task 3: Fix Dependency Vulnerability (5 min) 🔴

**Command:**
```bash
npm audit fix
```

**Checklist:**
- [ ] Run `npm audit` to see current vulnerabilities
- [ ] Run `npm audit fix` to fix js-yaml CVE
- [ ] Run `npm audit` again to verify fix
- [ ] Test application builds successfully
- [ ] Commit `package-lock.json` changes

---

#### Task 4: Add Input Validation to Critical Routes (1.5 hours) 🔴

**File:** `src/app/api/t/branches/route.ts`

**Current Code:**
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');  // ❌ No validation
  const limit = searchParams.get('limit'); // ❌ No validation

  const url = `${API_BASE_URL}/api/v1/branch/?page=${page}&limit=${limit}`;
}
```

**Fix:**
```typescript
import { z } from 'zod';

const branchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(100).optional()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validated = branchQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search')
    });

    // Build URL with validated params
    const queryParams = new URLSearchParams({
      page: validated.page.toString(),
      limit: validated.limit.toString(),
      ...(validated.search && { search: validated.search })
    });

    const url = `${API_BASE_URL}/api/v1/branch/?${queryParams}`;

    // ... rest of the code
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

**Apply to these files (in order of priority):**
1. [ ] `src/app/api/t/branches/route.ts`
2. [ ] `src/app/api/t/menu/items/route.ts`
3. [ ] `src/app/api/t/inventory/items/route.ts`
4. [ ] `src/app/api/t/recipes/route.ts`
5. [ ] `src/app/api/t/auth/users/route.ts`
6. [ ] `src/app/api/t/catalog/categories/route.ts`
7. [ ] `src/app/api/t/catalog/items/route.ts`
8. [ ] `src/app/api/t/addons/items/route.ts`
9. [ ] `src/app/api/t/menu/categories/route.ts`
10. [ ] `src/app/api/t/inventory/units/route.ts`

---

### Day 2: Performance Quick Wins (4 hours)

#### Task 5: Fix N+1 Deletion Loops (45 min) 🔴

**Files to fix:**

**1. `src/lib/hooks/useBranchManagment.ts` (lines 154-178)**

**Current:**
```typescript
const handleBulkDeleteBranches = async () => {
  for (const id of selectedRowIds) {
    await deleteBranch(id); // ❌ Sequential - very slow
  }
  await fetchBranches();
};
```

**Fix:**
```typescript
const handleBulkDeleteBranches = async () => {
  try {
    // Delete in parallel
    await Promise.all(
      selectedRowIds.map(id => deleteBranch(id))
    );

    toast.success(`${selectedRowIds.length} branches deleted successfully`);
    await fetchBranches();
  } catch (error) {
    console.error('Bulk delete failed:', error);
    toast.error('Some deletions failed. Please try again.');
  }
};
```

**2. `src/lib/hooks/useIngredientsData.ts` (lines 224-249)**

**3. `src/lib/hooks/useVendors.ts` (lines 60-67)**

**Checklist:**
- [ ] Fix `useBranchManagment.ts`
- [ ] Fix `useIngredientsData.ts`
- [ ] Fix `useVendors.ts`
- [ ] Test bulk deletion (should be 10-50x faster)
- [ ] Verify error handling

---

#### Task 6: Add useMemo to Filter Hooks (1.5 hours) ⚠️

**Files to fix (6 files):**

**Template:**
```typescript
// Before
const filteredItems = items.filter(item => {
  // Heavy filtering logic
});

// After
const filteredItems = useMemo(() => {
  return items.filter(item => {
    // Heavy filtering logic
  });
}, [items, searchTerm, selectedCategory, selectedStatus]);
```

**Apply to:**
1. [ ] `src/lib/hooks/useMenuItemData.ts` - filter logic
2. [ ] `src/lib/hooks/useIngredientsData.ts` - filter + statistics
3. [ ] `src/lib/hooks/useBranchManagment.ts` - filter logic
4. [ ] `src/lib/hooks/useRecipeData.ts` - filter logic
5. [ ] `src/lib/hooks/useCategoryData.ts` - filter logic
6. [ ] `src/lib/hooks/useOrderFilter.ts` - filter logic

**Checklist:**
- [ ] Add `useMemo` imports
- [ ] Wrap filter operations
- [ ] Add proper dependencies array
- [ ] Test that filtering still works
- [ ] Verify performance improvement (should feel faster)

---

#### Task 7: Memoize DataTable Component (15 min) ⚠️

**File:** `src/components/ui/data-table.tsx`

**Current (line 56):**
```typescript
export default function DataTable<TData>({ columns, data }: Props) {
  // ...
}
```

**Fix:**
```typescript
import React from 'react';

export default React.memo(function DataTable<TData>({
  columns,
  data
}: Props) {
  // ...
});
```

**Checklist:**
- [ ] Add React.memo wrapper
- [ ] Test table rendering
- [ ] Verify table updates when data changes
- [ ] Check pagination, sorting still work

---

### Day 3: Code Quality Critical Fixes (4 hours)

#### Task 8: Fix Silent Error Catches (3 hours) ⚠️

**Pattern to find:**
```typescript
catch { }
catch () { }
```

**Fix template:**
```typescript
catch (error) {
  console.error('[Context] Operation failed:', error);
  toast.error('User-friendly error message');
  // Re-throw if needed for upstream handling
  // throw error;
}
```

**Priority files (20+ instances):**
1. [ ] `src/lib/hooks/useMenuItemData.ts` (8 instances)
2. [ ] `src/lib/hooks/useIngredientsData.ts` (10 instances)
3. [ ] `src/lib/hooks/useBranchManagment.ts` (6 instances)
4. [ ] `src/lib/hooks/useRecipeData.ts` (7 instances)
5. [ ] `src/lib/hooks/useCategoryData.ts` (5 instances)

**Checklist:**
- [ ] Search for `catch {` in hooks directory
- [ ] Fix top 5 priority files
- [ ] Add console.error with context
- [ ] Add toast.error with user message
- [ ] Test error scenarios

---

#### Task 9: Fix File Name Typos (30 min) ⚠️

**Commands:**
```bash
# 1. Dashboard typo
git mv src/lib/hooks/useDashborad.ts src/lib/hooks/useDashboard.ts

# 2. Staff typo
git mv src/components/SatffManagement.tsx src/components/StaffManagement.tsx

# 3. Dashboard component typo (if exists)
find src -name "*Dsahborad*" -exec git mv {} \;
```

**Checklist:**
- [ ] Find all typo files: `find src -name "*Dashborad*"`
- [ ] Find: `find src -name "*Satff*"`
- [ ] Rename using `git mv`
- [ ] Update imports in files that use these
- [ ] Test application builds
- [ ] Search for old names in code: `grep -r "useDashborad"`

---

### Day 4-5: Verification & Testing (4 hours)

#### Task 10: Manual Testing Checklist

**Security Testing:**
- [ ] Login with valid credentials - should work
- [ ] Access `/api/t/menu/items` without auth - should redirect
- [ ] Access public routes without auth - should work
- [ ] Try accessing other tenant's data - should fail
- [ ] Test with invalid tenant slug - should fail gracefully

**Performance Testing:**
- [ ] Delete 10 items at once - should be fast (<2 seconds)
- [ ] Filter large list - should not lag
- [ ] Navigate between pages - should feel smooth
- [ ] Check browser console for errors

**Functionality Testing:**
- [ ] Create menu item - should work
- [ ] Update menu item - should work
- [ ] Delete menu item - should work
- [ ] Test each fixed hook
- [ ] Verify error messages appear for failures

---

#### Task 11: Build & Deployment

**Checklist:**
- [ ] Run linter: `npm run lint` - should pass
- [ ] Run build: `npm run build` - should succeed
- [ ] Check build warnings - address critical ones
- [ ] Run in production mode: `npm run start`
- [ ] Smoke test production build
- [ ] Review all changes before commit

---

## Commit & Push

### Create Commit

```bash
# Stage all changes
git add .

# Create descriptive commit
git commit -m "$(cat <<'EOF'
fix: Critical security and performance fixes

SECURITY FIXES:
- Remove API authentication bypass in middleware
- Remove hardcoded test tenant slug
- Add input validation to critical API routes
- Fix js-yaml vulnerability (CVE)

PERFORMANCE FIXES:
- Fix N+1 deletion loops (10-50x faster)
- Add useMemo to filter hooks (80-95% faster)
- Memoize DataTable component (50-70% fewer renders)

CODE QUALITY FIXES:
- Fix 20+ silent error catches
- Rename typo files (Dashborad -> Dashboard, Satff -> Staff)
- Add proper error logging and user feedback

BREAKING CHANGES:
- Applications without NEXT_PUBLIC_TENANT_SLUG will now fail at startup
- Protected API routes now require authentication

Refs: CODEBASE-AUDIT-REPORT.md
EOF
)"
```

### Push Changes

```bash
# Push to branch
git push -u origin claude/audit-codebase-01XXKqZ2NS675BNzCec8C8T4
```

---

## Success Criteria

### Before Marking Complete

- [ ] All 11 tasks completed
- [ ] Application builds without errors
- [ ] Manual testing passed
- [ ] No console errors in browser
- [ ] Changes committed and pushed
- [ ] Created audit report documents

### Metrics

**Before:**
- 7 critical security vulnerabilities
- 60+ silent error catches
- 4 critical performance issues
- N+1 queries taking 20+ seconds

**After (Target):**
- 4 critical vulnerabilities fixed (3 remain for Phase 2)
- 20+ error catches fixed
- All performance issues resolved
- Bulk operations 10-50x faster

---

## Next Phase Preview

### Week 2-4: Remaining Improvements

**Phase 2 Tasks:**
1. Eliminate 500+ lines of code duplication
2. Migrate all services to centralized API client
3. Fix remaining silent error catches (40+)
4. Add authorization checks to user management
5. Implement proper token validation
6. Add rate limiting to auth endpoints
7. Set up testing infrastructure

**See:** `CODEBASE-AUDIT-REPORT.md` Section 8 for full roadmap

---

## Support & Questions

**Documentation:**
- Full audit report: `CODEBASE-AUDIT-REPORT.md`
- Executive summary: `AUDIT-EXECUTIVE-SUMMARY.md`
- This checklist: `IMMEDIATE-ACTION-CHECKLIST.md`

**Need Help?**
- Refer to full audit report for code examples
- Each task has before/after code samples
- Test thoroughly after each change

**Stuck?**
- Revert changes: `git checkout -- <file>`
- Create backup: `git stash`
- Review original code in git history

---

**Ready to start?** Begin with Task 1 (Authentication Bypass) - it's the most critical!

**Time Budget:** 16 hours total (2 full work days)
**Priority:** 🔴 Drop everything else, fix security first!
