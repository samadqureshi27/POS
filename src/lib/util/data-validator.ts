/**
 * Data Validation and Sanitization Utilities
 *
 * This module provides runtime validation for data from the backend
 * to prevent crashes when types don't match expectations.
 *
 * CRITICAL: Always validate external data before using it in the UI
 */

import { logError } from './logger';

/**
 * Validation result with detailed error information
 */
interface ValidationResult<T> {
  isValid: boolean;
  data: T;
  errors: string[];
  warnings: string[];
}

/**
 * Safe getter for nested object properties
 * Prevents "Cannot read property 'x' of null/undefined" errors
 */
export function safeGet<T>(
  obj: any,
  path: string,
  defaultValue: T
): T {
  try {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }

    return result !== undefined && result !== null ? result : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Validate and sanitize inventory item from backend
 */
export function validateInventoryItem(item: any): ValidationResult<any> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!item) {
    errors.push('Item is null or undefined');
    return {
      isValid: false,
      data: null,
      errors,
      warnings
    };
  }

  // Validate item has an ID
  if (!item._id && !item.id) {
    errors.push('Item missing required field: _id or id');
  }

  // Validate item has a name
  if (!item.name || typeof item.name !== 'string') {
    errors.push('Item missing required field: name');
  }

  // Validate item type (backend expects: stock, nonstock, service)
  const validTypes = ['stock', 'nonstock', 'service'];
  if (!item.type || !validTypes.includes(item.type)) {
    warnings.push(`Invalid item type: "${item.type}". Expected one of: ${validTypes.join(', ')}`);
  }

  // Sanitize the item data
  const sanitizedItem = {
    _id: item._id || item.id || null,
    id: item.id || item._id || null,
    name: item.name || 'Unknown Item',
    sku: item.sku || '',
    type: validTypes.includes(item.type) ? item.type : 'stock',

    // Handle categoryId (can be string, object, or null)
    categoryId: sanitizeCategoryId(item.categoryId),

    baseUnit: item.baseUnit || 'pc',
    purchaseUnit: item.purchaseUnit || '',
    conversion: typeof item.conversion === 'number' ? item.conversion : undefined,
    trackStock: typeof item.trackStock === 'boolean' ? item.trackStock : undefined,
    reorderPoint: typeof item.reorderPoint === 'number' ? item.reorderPoint : 0,
    barcode: item.barcode || '',
    taxCategory: item.taxCategory || '',
    quantity: typeof item.quantity === 'number' ? item.quantity : 0,
    sellingPrice: typeof item.sellingPrice === 'number' ? item.sellingPrice : 0,
    costPerUnit: typeof item.costPerUnit === 'number' ? item.costPerUnit : 0,
    image: item.image || '',
    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || '',
  };

  if (errors.length > 0) {
    logError('Data validation errors', new Error('Invalid item data'), {
      component: 'DataValidator',
      itemName: item.name,
      errors
    });
  }

  return {
    isValid: errors.length === 0,
    data: sanitizedItem,
    errors,
    warnings
  };
}

/**
 * Sanitize category ID (can be string, object with _id/name, or null)
 */
function sanitizeCategoryId(categoryId: any): string | { _id: string; name: string } | undefined {
  if (!categoryId) {
    return undefined;
  }

  // If it's a string, return as is
  if (typeof categoryId === 'string') {
    return categoryId;
  }

  // If it's an object, validate it has required fields
  if (typeof categoryId === 'object') {
    const hasId = categoryId._id || categoryId.id;
    const hasName = categoryId.name;

    if (!hasId || !hasName) {
      return undefined;
    }

    return {
      _id: categoryId._id || categoryId.id,
      name: categoryId.name || 'Unknown Category'
    };
  }

  return undefined;
}

/**
 * Validate and sanitize an array of inventory items
 */
export function validateInventoryItems(items: any[]): {
  validItems: any[];
  invalidCount: number;
  warnings: string[];
} {
  if (!Array.isArray(items)) {
    logError('Expected array of items, got:', new Error('Invalid data type'), {
      component: 'DataValidator',
      receivedType: typeof items
    });
    return {
      validItems: [],
      invalidCount: 0,
      warnings: ['Expected array of items but received: ' + typeof items]
    };
  }

  const validItems: any[] = [];
  let invalidCount = 0;
  const allWarnings: string[] = [];

  items.forEach((item, index) => {
    const result = validateInventoryItem(item);

    if (result.isValid) {
      validItems.push(result.data);
    } else {
      invalidCount++;
    }

    if (result.warnings.length > 0) {
      allWarnings.push(`Item ${index}: ${result.warnings.join(', ')}`);
    }
  });

  if (invalidCount > 0) {
  }

  return {
    validItems,
    invalidCount,
    warnings: allWarnings
  };
}

/**
 * Safe category display name extraction
 */
export function getCategoryName(categoryId: any): string {
  if (!categoryId) {
    return 'General';
  }

  if (typeof categoryId === 'string') {
    return categoryId;
  }

  if (typeof categoryId === 'object' && categoryId !== null) {
    return categoryId.name || categoryId._id || 'General';
  }

  return 'General';
}

/**
 * Validate API response structure
 */
export function validateApiResponse<T>(
  response: any,
  expectedDataType: 'array' | 'object'
): ValidationResult<T> {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!response) {
    errors.push('Response is null or undefined');
    return { isValid: false, data: null as any, errors, warnings };
  }

  // Check success field
  if (typeof response.success !== 'boolean') {
    warnings.push('Response missing "success" field');
  }

  // Validate data field exists
  if (!response.data && response.success !== false) {
    warnings.push('Response missing "data" field');
  }

  // Validate data type matches expected
  if (response.data) {
    const isArray = Array.isArray(response.data);
    const isObject = typeof response.data === 'object' && !isArray;

    if (expectedDataType === 'array' && !isArray) {
      errors.push(`Expected array but got ${isArray ? 'array' : typeof response.data}`);
    }

    if (expectedDataType === 'object' && !isObject) {
      errors.push(`Expected object but got ${typeof response.data}`);
    }
  }

  return {
    isValid: errors.length === 0,
    data: response.data,
    errors,
    warnings
  };
}
