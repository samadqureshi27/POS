# API Specifications

This directory contains Postman collection files for API testing and documentation.

## Collections

### Menu Management
- `Menu Module (Categories, Items, Variations).postman_collection.json` - Complete menu management API
- `Menu + Add-ons (with auto recipe-variants).postman_collection.json` - Menu with add-ons

### Add-ons & Modifiers
- `Add-ons (Category Groups).postman_collection.json` - Add-on groups and options

### Recipe Management
- `POS — Recipe.postman_collection.json` - Recipe CRUD operations
- `Recipe Variant Module.postman_collection.json` - Recipe variants

### Complete Backend
- `Pos-Backend.postman_collection(6).json` - Full backend API collection

## Usage

### Import to Postman
1. Open Postman
2. Click "Import" button
3. Select the collection file
4. Configure environment variables:
   - `base_url`: Your API base URL
   - `tenant_slug`: Your tenant identifier
   - `access_token`: Your authentication token

### Environment Variables Required

```json
{
  "base_url": "https://api.tritechtechnologyllc.com",
  "tenant_slug": "your-tenant-slug",
  "access_token": "your-jwt-token"
}
```

## Converting to OpenAPI

For better integration and documentation, consider converting these to OpenAPI 3.0 format:

```bash
# Using postman-to-openapi converter
npm install -g postman-to-openapi
p2o ./collections/menu-module.postman_collection.json -f ./openapi/menu-api.yaml
```

## Maintenance

- Keep collections in sync with backend API changes
- Update after adding new endpoints
- Remove deprecated endpoints
- Document request/response examples

## Future Improvements

- [ ] Convert to OpenAPI 3.0 format
- [ ] Add automated API testing
- [ ] Generate API documentation site
- [ ] Add response validation schemas
