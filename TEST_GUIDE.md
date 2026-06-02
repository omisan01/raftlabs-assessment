# API Test Suite - Vitest Setup

## Overview
This project includes comprehensive test cases for the REST APIs using **Vitest**, a modern, fast unit test framework for JavaScript/TypeScript.

## Test Files Created

### 1. Menu API Tests (`app/api/menu/__tests__/route.test.ts`)
Tests for the **GET /api/menu** endpoint:
- ✅ Returns menu items successfully
- ✅ Returns 500 error when database query fails
- ✅ Returns empty array when no menu items exist

**Test Coverage:**
- Successful data retrieval
- Error handling for database failures
- Edge case: empty results

### 2. Orders API Tests (`app/api/orders/__tests__/route.test.ts`)
Tests for the **POST /api/orders** endpoint:
- ✅ Creates order successfully with valid payload
- ✅ Returns 400 for invalid payload (missing required fields)
- ✅ Returns 400 for invalid phone number format
- ✅ Returns 400 when empty items array
- ✅ Returns 400 when order insertion fails
- ✅ Returns 400 when order items insertion fails
- ✅ Returns 500 for unexpected errors

**Test Coverage:**
- Valid order creation with proper Supabase inserts
- Zod validation error handling
- Edge cases: empty cart, invalid phone numbers
- Database error handling (both orders and order_items tables)
- Unexpected server errors

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `vitest@^2.0.5` - Test framework
- `@vitest/ui@^2.0.5` - Visual test dashboard (optional)

### 2. Run Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (for development):**
```bash
npm test -- --watch
```

**Run tests with UI dashboard:**
```bash
npm run test:ui
```

**Run specific test file:**
```bash
npm test -- menu/__tests__/route.test.ts
```

**Run tests with coverage report:**
```bash
npm test -- --coverage
```

## Test Structure

### Mocking Strategy
- **Next.js APIs**: `cookies()` from `next/headers` is mocked
- **Supabase Client**: `createClient()` is mocked to simulate database operations
- **Database Responses**: Mocked using Vitest's `vi.fn()` to simulate both success and error cases

### Key Test Patterns

#### Menu API Testing
```typescript
// Mocking successful Supabase response
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockResolvedValueOnce({
    data: mockMenuItems,
    error: null,
  }),
};
```

#### Orders API Testing
```typescript
// Testing validation errors
const response = await POST(invalidRequest);
expect(response.status).toBe(400);
expect(data.error).toBe('Validation constraints rejected payload');

// Testing successful creation
expect(response.status).toBe(201);
expect(data.orderId).toBe(mockOrderId);
```

## API Documentation

### GET /api/menu
- **Description**: Fetch all menu items from the database
- **Response**: Array of menu items or error message
- **Status Codes**: 200 (success), 500 (server error)

### POST /api/orders
- **Description**: Create a new order with validation
- **Request Body**:
  ```json
  {
    "customerName": "string",
    "address": "string",
    "phone": "number (10 digits)",
    "totalAmount": "number (in rupees)",
    "items": [
      {
        "menuItemId": "string (UUID)",
        "quantity": "number (positive integer)",
        "price": "number (positive)"
      }
    ]
  }
  ```
- **Response**: `{ orderId: string }` or error message
- **Status Codes**: 201 (created), 400 (validation error), 500 (server error)

## Validation Schema
The orders use Zod validation (`lib/validations/order.ts`):
- `customerName`: Required, min 1 char
- `address`: Required, min 1 char
- `phone`: Required, must be 10 digits
- `totalAmount`: Required, positive integer
- `items`: Required, non-empty array with valid items (UUID, positive quantity, positive price)

## Running Tests in CI/CD

Add to your CI/CD pipeline:
```bash
npm install
npm test -- --run
```

The `--run` flag runs tests once without watch mode (suitable for CI).

## Test Output Example

```
✓ app/api/menu/__tests__/route.test.ts (3 tests)
✓ app/api/orders/__tests__/route.test.ts (7 tests)

Test Files  2 passed (2)
Tests       10 passed (10)
Duration    234ms
```

## Coverage Goals
Current test coverage includes:
- Happy path scenarios (successful API calls)
- Validation error scenarios (invalid inputs)
- Database error scenarios (Supabase failures)
- Edge cases (empty arrays, missing fields)
- Unexpected server errors

## Next Steps
To expand test coverage, consider adding:
- Integration tests with real database fixtures
- E2E tests with Playwright
- Performance benchmarks
- Load testing with k6 or Artillery
