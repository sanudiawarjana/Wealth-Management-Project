"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApiConnection = async () => {
    setLoading(true)
    setError(null)
    setTestResults(null)
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('/api/proxy/health')
      const healthData = await healthResponse.json()
      
      // Test income endpoint
      const incomeResponse = await fetch('/api/proxy/api/income')
      const incomeStatus = incomeResponse.status
      
      setTestResults({
        health: healthData,
        incomeStatus,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('API Test Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Connectivity Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Backend Connectivity</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testApiConnection} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Health Check:</h3>
                <pre className="bg-muted p-4 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.health, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Income API Status:</h3>
                <p className="text-lg">
                  {testResults.incomeStatus === 200 ? (
                    <span className="text-green-500">✅ Connected Successfully</span>
                  ) : (
                    <span className="text-yellow-500">⚠️ Status: {testResults.incomeStatus}</span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Test Timestamp:</h3>
                <p>{testResults.timestamp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            This page tests connectivity between the frontend and backend through the Next.js API proxy.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Health check verifies the backend server is running</li>
            <li>Income API test verifies database connectivity</li>
            <li>All requests go through the Next.js API proxy at /api/proxy/*</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}