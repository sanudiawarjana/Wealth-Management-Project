# Step 6: API Routes Implementation

## Overview
This document describes the implementation of RESTful API routes that connect HTTP endpoints to the controller functions.

## Date: October 15, 2025
## Duration: API routes implementation phase

## What Was Done

### 1. Routes File Creation
Created `routes/items.js` to define all HTTP routes for the items resource.

### 2. Route Structure Implementation
```javascript
const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
```

### 3. RESTful Route Mapping

#### A. GET Routes (Read Operations)

**GET /api/items - Get All Items**
```javascript
router.get('/', getAllItems);
```
- **Purpose**: Retrieve all items in the system
- **Controller**: `getAllItems`
- **HTTP Method**: GET
- **Endpoint**: `/api/items`
- **Response**: Array of all items with count

**GET /api/items/:id - Get Single Item**
```javascript
router.get('/:id', getItemById);
```
- **Purpose**: Retrieve a specific item by ID
- **Controller**: `getItemById`
- **HTTP Method**: GET
- **Endpoint**: `/api/items/:id`
- **Parameters**: `id` (route parameter)
- **Response**: Single item object or 404 error

#### B. POST Route (Create Operation)

**POST /api/items - Create New Item**
```javascript
router.post('/', createItem);
```
- **Purpose**: Create a new item in the system
- **Controller**: `createItem`
- **HTTP Method**: POST
- **Endpoint**: `/api/items`
- **Body**: JSON object with item data
- **Response**: Created item with auto-generated ID

#### C. PUT Route (Update Operation)

**PUT /api/items/:id - Update Item**
```javascript
router.put('/:id', updateItem);
```
- **Purpose**: Update an existing item
- **Controller**: `updateItem`
- **HTTP Method**: PUT
- **Endpoint**: `/api/items/:id`
- **Parameters**: `id` (route parameter)
- **Body**: JSON object with fields to update
- **Response**: Updated item object

#### D. DELETE Route (Delete Operation)

**DELETE /api/items/:id - Delete Item**
```javascript
router.delete('/:id', deleteItem);
```
- **Purpose**: Remove an item from the system
- **Controller**: `deleteItem`
- **HTTP Method**: DELETE
- **Endpoint**: `/api/items/:id`
- **Parameters**: `id` (route parameter)
- **Response**: Deleted item object or 404 error

### 4. Module Export
```javascript
module.exports = router;
```

## Complete Route Configuration

The final routes file contains all five CRUD operations:

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// Routes for items resource
// GET /api/items - Get all items
router.get('/', getAllItems);

// GET /api/items/:id - Get single item by ID
router.get('/:id', getItemById);

// POST /api/items - Create new item
router.post('/', createItem);

// PUT /api/items/:id - Update item by ID
router.put('/:id', updateItem);

// DELETE /api/items/:id - Delete item by ID
router.delete('/:id', deleteItem);

module.exports = router;
```

## Route Integration with Main Server

The routes are integrated into the main server file (`server.js`):

```javascript
// Import routes
const itemRoutes = require('./routes/items');

// Routes
app.use('/api/items', itemRoutes);
```

This creates the following complete API endpoints:

| Method | Endpoint | Description | Controller Function |
|--------|----------|-------------|-------------------|
| GET | `/api/items` | Get all items | `getAllItems` |
| GET | `/api/items/:id` | Get single item | `getItemById` |
| POST | `/api/items` | Create new item | `createItem` |
| PUT | `/api/items/:id` | Update item | `updateItem` |
| DELETE | `/api/items/:id` | Delete item | `deleteItem` |

## Technical Decisions Made

### 1. RESTful Design Principles
- **Resource-based URLs**: `/api/items` represents the items resource
- **HTTP methods**: GET, POST, PUT, DELETE for different operations
- **Consistent naming**: All routes follow REST conventions
- **Parameter handling**: ID parameters in URL path

### 2. Route Organization
- **Modular structure**: Routes separated by resource type
- **Controller integration**: Clean separation between routing and business logic
- **Express Router**: Using Express Router for route organization

### 3. Parameter Handling
- **Route parameters**: `:id` for resource identification
- **Body parsing**: Automatic JSON parsing for POST/PUT requests
- **Query parameters**: Available for future filtering/searching

### 4. Error Handling Integration
- **Controller-level**: Each controller handles its own errors
- **Route-level**: Routes pass errors to global error handler
- **HTTP status codes**: Appropriate status codes for different scenarios

## Files Created
- `routes/items.js` - Complete API routes file (28 lines)

## API Endpoint Testing

The implemented routes support the following operations:

### 1. Get All Items
```bash
GET http://localhost:3000/api/items
```

### 2. Get Single Item
```bash
GET http://localhost:3000/api/items/1
```

### 3. Create New Item
```bash
POST http://localhost:3000/api/items
Content-Type: application/json

{
  "name": "New Item",
  "description": "Item description",
  "price": 29.99,
  "category": "Electronics"
}
```

### 4. Update Item
```bash
PUT http://localhost:3000/api/items/1
Content-Type: application/json

{
  "name": "Updated Item Name",
  "price": 39.99
}
```

### 5. Delete Item
```bash
DELETE http://localhost:3000/api/items/1
```

## Context for Future Development
The route implementation provides a complete RESTful API for the items resource. The modular design allows for easy addition of new resources by creating similar route files and controllers.

The established patterns can be extended to support:
- Additional resources (users, orders, etc.)
- Nested routes (items/:id/reviews)
- Query parameters for filtering and pagination
- Authentication and authorization middleware
- API versioning

## Next Steps
After route implementation, the next phase involved creating configuration files and documentation to complete the project setup.
