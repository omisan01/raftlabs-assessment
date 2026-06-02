# Order Management System

## Objective

Build an Order Management feature for a food delivery application that allows users to browse menu items, place orders, and track order status.

---

## Features

### Menu Display

* View menu items
* Display name, description, image, and price

### Cart Management

* Add items to cart
* Update item quantity
* Remove items from cart
* Calculate order total

### Checkout

* Enter customer details
  * Name
  * Address
  * Phone Number
* Validate user input
* Create order

### Order Tracking

* View current order status
* Display order progress

### Real-Time Updates (Optional)

* Simulate status updates
* Update order status without page refresh

---

## Tech Stack

### Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Zustand
* React Hook Form
* Zod

### Backend

* Next.js Route Handlers (REST API)
* Supabase PostgreSQL

### Testing

* Vitest
* React Testing Library

---

## Database Tables

### MenuItem

* id
* name
* description
* imageUrl
* price

### Order

* id
* customerName
* address
* phone
* status
* totalAmount
* createdAt

### OrderItem

* id
* orderId
* menuItemId
* quantity
* price

---

## API Endpoints

GET /api/menu

POST /api/orders

GET /api/orders/:id

PATCH /api/orders/:id/status

---

## Validation

* Customer name is required
* Address is required
* Phone number is required
* Cart cannot be empty
* Quantity must be greater than 0

---

## Testing Scope

### API Tests

* Menu retrieval
* Order creation
* Input validation
* Order retrieval
* Order status updates

### UI Tests

* Menu rendering
* Cart operations
* Checkout form validation
* Order tracking page

---

## Deployment

* Frontend and API: Vercel
* Database: Supabase
