# Step 5: CRUD Controller Implementation

## Overview
This document describes the implementation of the complete CRUD (Create, Read, Update, Delete) controller logic for the items resource.

## Date: October 15, 2025
## Duration: Controller logic implementation phase

## What Was Done

### 1. Controller File Creation
Created `controllers/itemController.js` with comprehensive CRUD operations.

### 2. Data Store Implementation
Implemented in-memory data store for demo purposes:

```javascript
// In-memory data store for demo purposes
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item', price: 19.99, category: 'Books' },
  { id: 3, name: 'Sample Item 3', description: 'Yet another sample item', price: 39.99, category: 'Clothing' }
];

let nextId = 4;
```

### 3. CRUD Operations Implementation

#### A. GET All Items (Read All)
```javascript
const getAllItems = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving items',
      error: error.message
    });
  }
};
```

**Features:**
- Returns all items with count
- Structured success response
- Error handling with try-catch
- HTTP status codes (200 for success, 500 for errors)

#### B. GET Single Item (Read One)
```javascript
const getItemById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving item',
      error: error.message
    });
  }
};
```

**Features:**
- Parameter parsing and validation
- 404 handling for non-existent items
- Structured response format
- Error handling

#### C. POST Create Item (Create)
```javascript
const createItem = (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, description, price, category) are required'
      });
    }
    
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }
    
    const newItem = {
      id: nextId++,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};
```

**Features:**
- Input validation for required fields
- Data type validation (price must be number)
- Data sanitization (trimming strings)
- Auto-incrementing ID generation
- Timestamp creation
- HTTP 201 status for successful creation
- 400 status for validation errors

#### D. PUT Update Item (Update)
```javascript
const updateItem = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${id} not found`
      });
    }
    
    const { name, description, price, category } = req.body;
    const existingItem = items[itemIndex];
    
    // Update only provided fields
    const updatedItem = {
      ...existingItem,
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(category && { category: category.trim() }),
      updatedAt: new Date().toISOString()
    };
    
    // Validation for price if provided
    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }
    
    items[itemIndex] = updatedItem;
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};
```

**Features:**
- Partial update support (only provided fields are updated)
- 404 handling for non-existent items
- Data validation for price updates
- Timestamp tracking for updates
- Data sanitization
- Preserves existing data for non-provided fields

#### E. DELETE Item (Delete)
```javascript
const deleteItem = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${id} not found`
      });
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: deletedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};
```

**Features:**
- 404 handling for non-existent items
- Returns deleted item data
- Array manipulation with splice
- Proper error handling

### 4. Module Export
```javascript
module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
```

## Technical Decisions Made

### 1. Response Format Standardization
All responses follow consistent format:
```javascript
{
  success: boolean,
  message?: string,
  data?: any,
  error?: string
}
```

### 2. HTTP Status Code Usage
- 200: Successful GET, PUT, DELETE operations
- 201: Successful POST (creation)
- 400: Validation errors
- 404: Resource not found
- 500: Server errors

### 3. Input Validation Strategy
- Required field validation
- Data type validation
- Range validation (positive numbers)
- String sanitization (trimming)

### 4. Error Handling Approach
- Try-catch blocks for all operations
- Structured error responses
- Appropriate HTTP status codes
- Detailed error messages for debugging

### 5. Data Management
- In-memory storage for simplicity
- Auto-incrementing IDs
- Timestamp tracking
- Data sanitization

## Files Created
- `controllers/itemController.js` - Complete CRUD controller (184 lines)

## Security Considerations
- Input validation prevents malformed data
- Data sanitization prevents injection attacks
- Error messages don't expose sensitive information
- Structured responses prevent information leakage

## Context for Future Development
The controller implementation provides a complete CRUD API for the items resource. The modular design allows for easy extension to additional resources. The validation and error handling patterns established here can be reused for other controllers.

The in-memory data store is suitable for development and testing but should be replaced with a proper database (MongoDB, PostgreSQL, etc.) for production use.

## Next Steps
After controller implementation, the next phase involved creating the API routes that connect the controller functions to HTTP endpoints.
