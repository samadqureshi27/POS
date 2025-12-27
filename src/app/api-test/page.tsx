"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApiTestPage() {
  const [email, setEmail] = useState('qabdulsamad18@gmail.com');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const url = 'https://api.tritechtechnologyllc.com/t/auth/login';
      const headers = {
        'Content-Type': 'application/json',
        'x-tenant-id': 'extraction-testt'
      };
      const body = {
        email,
        password,
        posId: null,
        defaultBranchId: null
      };


      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await res.json();


      setResponse({
        status: res.status,
        ok: res.ok,
        data
      });
    } catch (error: any) {
      console.error('❌ Error:', error);
      setResponse({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-sm shadow p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 API Test Page</h1>
          <p className="text-gray-600 mb-6">
            Direct API test without going through the login UI
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <Button
              onClick={testLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Login API'}
            </Button>
          </div>
        </div>

        {response && (
          <div className="bg-white rounded-sm shadow p-6">
            <h2 className="text-xl font-bold mb-4">Response</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-lg font-mono ${response.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {response.status} {response.ok ? '✅' : '❌'}
                </p>
              </div>

              {response.data && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Data</p>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              )}

              {response.error && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Error</p>
                  <p className="text-red-600">{response.error}</p>
                </div>
              )}

              {response.data?.result?.token && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-green-600 mb-2">✅ Token Received</p>
                  <p className="text-xs font-mono bg-green-50 p-2 rounded break-all">
                    {response.data.result.token.substring(0, 50)}...
                  </p>
                </div>
              )}

              {response.data?.result?.user && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-green-600 mb-2">✅ User Data</p>
                  <pre className="text-xs font-mono bg-green-50 p-2 rounded">
                    {JSON.stringify(response.data.result.user, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Quick Info</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Endpoint: <code className="bg-blue-100 px-1 rounded">POST /t/auth/login</code></li>
            <li>• Base URL: <code className="bg-blue-100 px-1 rounded">https://api.tritechtechnologyllc.com</code></li>
            <li>• Tenant ID: <code className="bg-blue-100 px-1 rounded">extraction-testt</code></li>
            <li>• Check browser console for detailed logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
