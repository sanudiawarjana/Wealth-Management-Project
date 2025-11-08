# Express REST API Server - Setup Guide

## Quick Start

### Option 1: Using Batch Script (Windows)
```bash
# Double-click or run:
start-server.bat
```

### Option 2: Using PowerShell Script
```bash
# Run in PowerShell:
.\start-server.ps1
```

### Option 3: Manual Setup
```bash
# 1. Navigate to project directory
cd "D:\AI Boot Camp\Backend"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Test all API endpoints |
| `npm run test-api` | Test all API endpoints (alternative) |
| `npm run setup` | Install dependencies |

## Testing the API

### Automatic Testing
```bash
# Test all endpoints automatically
npm test
```

### Manual Testing
```bash
# Start server first
npm run dev

# Then in another terminal, run tests
.\test-api.bat
```

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

## Troubleshooting

### Common Issues

1. **"package.json not found" error**
   - Make sure you're in the correct directory: `D:\AI Boot Camp\Backend`
   - Use the provided startup scripts

2. **Port already in use**
   - Change PORT in `.env` file
   - Or kill existing Node processes

3. **Dependencies not installed**
   - Run `npm install` from project root
   - Or use `npm run setup`

## How to View Logs

### Development (console)
- Logs appear in the terminal with a per-request UUID, e.g. `123e4567-... GET /api/items 200 - 12.3 ms`
- Health checks at `/health` are not logged

### Production (console + files)
- Console logs use the `combined` format
- File logs are written to `logs/access.log` with daily rotation (keeps ~14 days)
- To tail logs on Windows PowerShell:
```powershell
Get-Content -Path .\logs\access.log -Wait
```

### Directory Structure
```
D:\AI Boot Camp\Backend\
├── start-server.bat          # Windows batch startup script
├── start-server.ps1          # PowerShell startup script
├── test-api.ps1              # API testing script
├── server.js                 # Main server file
├── package.json              # Project configuration
├── .env                      # Environment variables
└── README.md                 # Full documentation
```

## Environment Variables

Create `.env` file:
```env
PORT=3000
NODE_ENV=development
```

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify you're in the correct directory
3. Ensure all dependencies are installed
4. Check that port 3000 is available
