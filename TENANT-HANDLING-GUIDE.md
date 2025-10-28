# Tenant Handling in POS System

## Current Architecture: Tenant-First Pattern

Your backend uses a **tenant-first** authentication pattern where:
1. Tenant must be identified BEFORE login
2. Login endpoint requires `x-tenant-id` header
3. Each tenant has isolated data

## Current Issues with `.env` Approach ❌

### Problem:
```env
# .env.local
NEXT_PUBLIC_TENANT_SLUG=extraction-testt
```

**Why this is problematic:**
- ❌ Hardcoded for single tenant only
- ❌ Can't support multiple businesses on same deployment
- ❌ Requires code change to switch tenants
- ❌ Not scalable for SaaS model

## Recommended Solutions

### Option 1: Subdomain-Based (Best for SaaS) ✅

**How it works:**
```
business1.pos.com → tenant: business1
business2.pos.com → tenant: business2
```

**Implementation:**
1. Extract tenant from subdomain
2. Store in localStorage after tenant identified
3. Remove hardcoded slug from .env

```typescript
// src/lib/tenant-resolver.ts
export function getTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  // Example: business1.pos.com
  const parts = hostname.split('.');

  if (parts.length >= 3) {
    return parts[0]; // "business1"
  }

  return null;
}
```

### Option 2: Login Page Tenant Selection ✅

**How it works:**
1. User visits login page
2. Dropdown or input for tenant slug
3. Select tenant → Store in localStorage → Login

**UI Example:**
```typescript
// Login page
<Input
  label="Business ID"
  placeholder="your-business-id"
  value={tenantSlug}
  onChange={(e) => setTenantSlug(e.target.value)}
/>
```

### Option 3: URL Path Based ✅

**How it works:**
```
pos.com/extraction-testt/login
pos.com/business2/login
```

**Implementation:**
```typescript
// Extract from URL path
const tenant = window.location.pathname.split('/')[1];
```

## Recommended Implementation (Option 2 - Simplest)

### Step 1: Remove Hardcoded Tenant from .env

```env
# .env.local - REMOVE THIS LINE
# NEXT_PUBLIC_TENANT_SLUG=extraction-testt

# Keep only:
NEXT_PUBLIC_API_BASE_URL=https://api.tritechtechnologyllc.com
```

### Step 2: Add Tenant Input to Login Page

```typescript
// Before login
localStorage.setItem('tenant_slug', userEnteredSlug);
localStorage.setItem('tenant_id', userEnteredSlug);
```

### Step 3: Auth Service Already Handles It!

Your `getTenantSlug()` already has the right logic:
```typescript
function getTenantSlug(): string {
  // 1. Check env (for dev/testing only)
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || '';
  if (envSlug) return envSlug;

  // 2. Check localStorage (set after tenant selection)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('tenant_slug');
    if (stored) return stored;
  }

  // 3. Fallback (for dev only)
  return DEFAULT_TENANT_SLUG;
}
```

## What To Do Now

### For Development (Keep as is):
✅ `.env.local` with hardcoded tenant is FINE for development
✅ Makes testing easier
✅ No changes needed yet

### For Production (Must change):
1. **Remove** `NEXT_PUBLIC_TENANT_SLUG` from production `.env`
2. **Add** tenant selection to login flow
3. **Store** tenant after selection
4. **Use** stored tenant for all API calls

## Quick Fix for Testing Multiple Tenants

You can manually change tenant in browser DevTools:
```javascript
// In browser console
localStorage.setItem('tenant_slug', 'other-business');
localStorage.setItem('tenant_id', 'other-business');
// Reload page
location.reload();
```

## No Refactor Needed! ✅

**Good news:** Your services already handle this correctly!

All services use:
```typescript
function getTenantSlug(): string | null {
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || '';
  if (envSlug) return envSlug;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tenant_slug') || null;
  }
  return null;
}
```

**This means:**
- ✅ Services check localStorage first
- ✅ Fall back to .env only if localStorage empty
- ✅ Works for multi-tenant out of the box
- ✅ Just need to add tenant selection UI

## Summary

**Current State:**
- ✅ Backend architecture is correct (tenant-first)
- ✅ Services already support dynamic tenant loading
- ⚠️ Just missing tenant selection UI

**Action Required:**
1. **Now:** Keep `.env` for development (convenient)
2. **Later:** Add tenant input to login page
3. **Production:** Remove `.env` tenant, force user selection

**No API refactor needed** - your code is already well-architected!
