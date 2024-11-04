import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/data';

export default function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentDB, setCurrentDB] = useState('primary');

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setMessage('');
    } else {
      setMessage(msg);
      setError('');
    }
    setTimeout(() => {
      if (isError) {
        setError('');
      } else {
        setMessage('');
      }
    }, 5000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/all`);
      if (response.data.success) {
        setData(response.data.data);
        setCurrentDB(response.data.currentDatabase);
      } else {
        showMessage(response.data.error, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error fetching data', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/create`, { title, content });
      if (response.data.success) {
        showMessage('Data created successfully');
        setTitle('');
        setContent('');
        fetchData();
      } else {
        showMessage(response.data.error, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error creating data', true);
    } finally {
      setLoading(false);
    }
  };

  const toggleDatabase = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/toggle-db`);
      if (response.data.success) {
        showMessage(response.data.message);
        setCurrentDB(response.data.currentDatabase);
        fetchData();
      } else {
        showMessage(response.data.error, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error toggling database', true);
    } finally {
      setLoading(false);
    }
  };

  const manualBackup = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/manual-backup`);
      if (response.data.success) {
        showMessage(response.data.message);
      } else {
        showMessage(response.data.error, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error performing backup', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Disaster Recovery System
        </h1>

        {message && (
          <div className="mb-4 p-4 rounded bg-green-100 text-green-700 relative">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded bg-red-100 text-red-700 relative">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Data'}
            </button>
          </form>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={toggleDatabase}
            disabled={loading}
            className={`flex-1 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
              currentDB === 'primary' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            Current: {currentDB.charAt(0).toUpperCase() + currentDB.slice(1)} DB
          </button>
          <button
            onClick={manualBackup}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Manual Backup
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Stored Data ({currentDB})</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Created: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// dioejfjeojfo