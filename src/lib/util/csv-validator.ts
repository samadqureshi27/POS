/**
 * CSV Import Validation Utility
 *
 * Validates CSV files before uploading to prevent server-side errors
 * and provide immediate feedback to users.
 */

interface CSVValidationError {
  row: number;
  column?: string;
  errors: string[];
}

interface CSVValidationResult {
  isValid: boolean;
  errors: CSVValidationError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

/**
 * Valid item types according to backend API
 */
const VALID_ITEM_TYPES = ['stock', 'nonstock', 'service'] as const;

/**
 * Parse CSV content into rows
 */
function parseCSV(content: string): string[][] {
  const lines = content.split('\n').filter(line => line.trim());
  return lines.map(line => {
    // Simple CSV parsing (handles quoted values)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  });
}

/**
 * Get column index by header name (case-insensitive)
 */
function getColumnIndex(headers: string[], columnName: string): number {
  return headers.findIndex(h =>
    h.toLowerCase().trim() === columnName.toLowerCase()
  );
}

/**
 * Validate a single inventory item row
 */
function validateItemRow(
  row: string[],
  headers: string[],
  rowNumber: number
): CSVValidationError | null {
  const errors: string[] = [];

  // Get column indices
  const nameIdx = getColumnIndex(headers, 'name');
  const typeIdx = getColumnIndex(headers, 'type');
  const baseUnitIdx = getColumnIndex(headers, 'baseUnit');

  // Validate required fields
  if (nameIdx === -1) {
    errors.push('Missing required column: name');
  } else if (!row[nameIdx] || row[nameIdx].trim() === '') {
    errors.push('Name is required');
  }

  if (typeIdx === -1) {
    errors.push('Missing required column: type');
  } else {
    const type = row[typeIdx]?.toLowerCase().trim();
    if (!type) {
      errors.push('Type is required');
    } else if (!VALID_ITEM_TYPES.includes(type as any)) {
      errors.push(`Type must be ${VALID_ITEM_TYPES.join('|')} (got: "${row[typeIdx]}")`);
    }
  }

  if (baseUnitIdx === -1) {
    errors.push('Missing required column: baseUnit');
  } else if (!row[baseUnitIdx] || row[baseUnitIdx].trim() === '') {
    errors.push('Base unit is required');
  }

  // Validate numeric fields if present
  const quantityIdx = getColumnIndex(headers, 'quantity');
  if (quantityIdx !== -1 && row[quantityIdx]) {
    const quantity = parseFloat(row[quantityIdx]);
    if (isNaN(quantity)) {
      errors.push(`Invalid quantity: "${row[quantityIdx]}" (must be a number)`);
    }
  }

  const reorderPointIdx = getColumnIndex(headers, 'reorderPoint');
  if (reorderPointIdx !== -1 && row[reorderPointIdx]) {
    const reorderPoint = parseFloat(row[reorderPointIdx]);
    if (isNaN(reorderPoint)) {
      errors.push(`Invalid reorder point: "${row[reorderPointIdx]}" (must be a number)`);
    }
  }

  const sellingPriceIdx = getColumnIndex(headers, 'sellingPrice');
  if (sellingPriceIdx !== -1 && row[sellingPriceIdx]) {
    const sellingPrice = parseFloat(row[sellingPriceIdx]);
    if (isNaN(sellingPrice)) {
      errors.push(`Invalid selling price: "${row[sellingPriceIdx]}" (must be a number)`);
    }
  }

  if (errors.length > 0) {
    return {
      row: rowNumber,
      errors
    };
  }

  return null;
}

/**
 * Validate entire CSV file for inventory items
 */
export async function validateInventoryCSV(file: File): Promise<CSVValidationResult> {
  try {
    // Read file content
    const content = await file.text();
    const rows = parseCSV(content);

    if (rows.length === 0) {
      return {
        isValid: false,
        errors: [{
          row: 0,
          errors: ['File is empty']
        }],
        totalRows: 0,
        validRows: 0,
        invalidRows: 0
      };
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
      return {
        isValid: false,
        errors: [{
          row: 0,
          errors: ['No data rows found (only headers present)']
        }],
        totalRows: 0,
        validRows: 0,
        invalidRows: 0
      };
    }

    // Validate each row
    const errors: CSVValidationError[] = [];
    dataRows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because: +1 for 0-index, +1 for header row
      const error = validateItemRow(row, headers, rowNumber);
      if (error) {
        errors.push(error);
      }
    });

    const validRows = dataRows.length - errors.length;

    return {
      isValid: errors.length === 0,
      errors,
      totalRows: dataRows.length,
      validRows,
      invalidRows: errors.length
    };
  } catch (error) {
    console.error('Error validating CSV:', error);
    return {
      isValid: false,
      errors: [{
        row: 0,
        errors: [`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0
    };
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: CSVValidationError[]): string {
  if (errors.length === 0) return '';

  const errorLines = errors.map(error => {
    const errorsText = error.errors.join(', ');
    return `Row ${error.row}: ${errorsText}`;
  });

  return errorLines.join('\n');
}

/**
 * Get summary of validation results
 */
export function getValidationSummary(result: CSVValidationResult): string {
  if (result.isValid) {
    return `✅ All ${result.totalRows} rows are valid and ready to import.`;
  }

  return `❌ Found ${result.invalidRows} invalid row(s) out of ${result.totalRows} total rows.`;
}
