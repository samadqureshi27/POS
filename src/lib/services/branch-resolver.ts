// src/lib/services/branch-resolver.ts
// Production-ready branch resolution service with caching

import { BranchService } from "./branch-service";
import { logError } from "@/lib/util/logger";

interface BranchCacheEntry {
  objectId: string;
  timestamp: number;
}

// In-memory cache with 5-minute TTL
const branchCache = new Map<string, BranchCacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Resolves a branch identifier (code, name, or ObjectId) to its MongoDB ObjectId
 * Uses caching to minimize API calls in production
 */
export async function resolveBranchObjectId(
  branchIdentifier: string | number
): Promise<string | null> {
  const identifier = String(branchIdentifier);

  // Check cache first
  const cached = branchCache.get(identifier);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.objectId;
  }

  try {
    // Check if identifier is already a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    if (isObjectId) {
      // Validate by fetching the branch
      const response = await BranchService.getBranch(identifier);
      if (response.success && response.data) {
        const objectId = response.data._id || response.data.id;
        if (objectId) {
          // Cache the result
          branchCache.set(identifier, {
            objectId,
            timestamp: Date.now(),
          });
          return objectId;
        }
      }
    }

    // Otherwise, fetch all branches and find match (with retry for auth)
    let listResponse = await BranchService.listBranches({ limit: 1000 });

    // Retry once if authentication failed (token might not be loaded yet)
    if (!listResponse.success && listResponse.message?.includes("login")) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      listResponse = await BranchService.listBranches({ limit: 1000 });
    }

    if (!listResponse.success || !listResponse.data) {
      return null;
    }

    // Try to match by various fields
    const branch = listResponse.data.find((b) => {
      return (
        String(b._id) === identifier ||
        String(b.id) === identifier ||
        String(b.code) === identifier ||
        String(b.name) === identifier
      );
    });

    if (branch) {
      const objectId = branch._id || branch.id;
      if (objectId) {
        // Cache the result
        branchCache.set(identifier, {
          objectId,
          timestamp: Date.now(),
        });
        return objectId;
      }
    }

    return null;
  } catch (error: any) {
    logError("Error resolving branch ObjectId", error, {
      component: "BranchResolver",
      identifier,
    });
    return null;
  }
}

/**
 * Clears the branch resolution cache
 * Useful for testing or when branch data changes
 */
export function clearBranchCache(): void {
  branchCache.clear();
}

/**
 * Pre-warms the branch cache by fetching all branches
 * Call this on app initialization for better performance
 */
export async function warmBranchCache(): Promise<void> {
  try {
    const listResponse = await BranchService.listBranches({ limit: 1000 });

    if (listResponse.success && listResponse.data) {
      const timestamp = Date.now();
      listResponse.data.forEach((branch) => {
        const objectId = branch._id || branch.id;
        if (objectId) {
          // Cache by ObjectId
          branchCache.set(objectId, { objectId, timestamp });

          // Cache by code if available
          if (branch.code) {
            branchCache.set(String(branch.code), { objectId, timestamp });
          }

          // Cache by name if available
          if (branch.name) {
            branchCache.set(branch.name, { objectId, timestamp });
          }
        }
      });
    }
  } catch (error) {
    logError("Error warming branch cache", error, {
      component: "BranchResolver",
    });
  }
}
