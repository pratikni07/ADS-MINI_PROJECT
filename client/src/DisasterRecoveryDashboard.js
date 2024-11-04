import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DisasterRecoveryDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    primary: 'checking',
    secondary: 'checking'
  });
  const [replicationMetrics, setReplicationMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Fetch system status
  const checkSystemHealth = async () => {
    try {
      const primaryRes = await fetch('http://localhost:5000/api/health/primary');
      const secondaryRes = await fetch('http://localhost:5000/api/health/secondary');
      
      setSystemStatus({
        primary: primaryRes.ok ? 'healthy' : 'unhealthy',
        secondary: secondaryRes.ok ? 'healthy' : 'unhealthy'
      });
    } catch (error) {
      setError('Failed to check system health');
      console.error('Health check failed:', error);
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Data fetch failed:', error);
    }
  };

  // Initialize recovery process
  const initiateRecovery = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recovery/initiate', {
        method: 'POST'
      });
      if (response.ok) {
        await checkSystemHealth();
        setError(null);
      } else {
        setError('Recovery initiation failed');
      }
    } catch (error) {
      setError('Failed to initiate recovery');
      console.error('Recovery initiation failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSystemHealth();
    fetchData();

    // Simulate replication metrics for visualization
    const demoMetrics = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      replicationRate: 95 + Math.random() * 5,
      latency: Math.random() * 100
    }));
    setReplicationMetrics(demoMetrics);

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      checkSystemHealth();
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Disaster Recovery Dashboard</h1>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Primary Database Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
              Primary Database
            </h2>
          </div>
          <div className="p-6">
            <div className={`rounded-lg p-4 ${
              systemStatus.primary === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <h3 className="font-semibold mb-1">
                {systemStatus.primary === 'healthy' ? 'Healthy' : 'Unhealthy'}
              </h3>
              <p>
                {systemStatus.primary === 'healthy' 
                  ? 'Primary system is operating normally' 
                  : 'Primary system needs attention'}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Database Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
              Secondary Database
            </h2>
          </div>
          <div className="p-6">
            <div className={`rounded-lg p-4 ${
              systemStatus.secondary === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <h3 className="font-semibold mb-1">
                {systemStatus.secondary === 'healthy' ? 'Healthy' : 'Unhealthy'}
              </h3>
              <p>
                {systemStatus.secondary === 'healthy' 
                  ? 'Secondary system is operating normally' 
                  : 'Secondary system needs attention'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Replication Metrics Chart */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Replication Metrics</h2>
        </div>
        <div className="p-6">
          <div className="h-64">
            <Line
              data={replicationMetrics}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="replicationRate" stroke="#3B82F6" name="Replication Rate" />
              <Line type="monotone" dataKey="latency" stroke="#10B981" name="Latency" />
            </Line>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Replicated Data</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partition Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Replication Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.partitionKey}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastUpdated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.replicationStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.replicationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recovery Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recovery Actions</h2>
        </div>
        <div className="p-6">
          <button
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={initiateRecovery}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Initiating Recovery...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Initiate Recovery
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisasterRecoveryDashboard;