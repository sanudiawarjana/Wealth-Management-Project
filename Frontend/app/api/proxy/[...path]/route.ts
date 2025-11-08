import { NextRequest, NextResponse } from 'next/server'

// Backend API URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api'

// Helper to forward requests to backend
async function proxyRequest(request: NextRequest, path: string) {
  const method = request.method
  const url = `${BACKEND_URL}/${path}`
  
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Prepare request options
  const options: RequestInit = {
    method,
    headers,
  }
  
  // Add body for POST/PUT/PATCH requests
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await request.json()
      options.body = JSON.stringify(body)
    } catch (error) {
      // No body or invalid JSON
    }
  }
  
  try {
    // Make request to backend
    const response = await fetch(url, options)
    const data = await response.json()
    
    // Return response with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle all HTTP methods
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params
  const path = params.path.join('/')
  return proxyRequest(request, path)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params
  const path = params.path.join('/')
  return proxyRequest(request, path)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params
  const path = params.path.join('/')
  return proxyRequest(request, path)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params
  const path = params.path.join('/')
  return proxyRequest(request, path)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params
  const path = params.path.join('/')
  return proxyRequest(request, path)
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
