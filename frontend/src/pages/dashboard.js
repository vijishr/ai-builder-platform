import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { dashboardService } from '@/services';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (userEmail && userName) setUser({ email: userEmail, name: userName });
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100"><h1 className="text-3xl font-bold">Loading...</h1></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-indigo-600">🚀 AI Builder</h1><p className="text-sm text-gray-600">Dashboard</p></div>
          <div className="flex items-center space-x-4">
            {user && (<><div className="text-right"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-gray-600">{user.email}</p></div><button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button></>)}
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-sm font-medium text-gray-600">Total Projects</h3><p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.totalProjects || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-sm font-medium text-gray-600">Published</h3><p className="text-3xl font-bold text-green-600 mt-2">{stats?.publishedProjects || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-sm font-medium text-gray-600">Total Visitors</h3><p className="text-3xl font-bold text-blue-600 mt-2">{stats?.totalVisitors?.toLocaleString() || 0}</p></div>
          <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-sm font-medium text-gray-600">Total Sales</h3><p className="text-3xl font-bold text-purple-600 mt-2">${stats?.totalSales || 0}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8"><h2 className="text-2xl font-bold mb-6">Quick Actions</h2><div className="grid md:grid-cols-3 gap-6"><a href="/projects" className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">📁 My Projects</h3><p className="text-sm">View and manage your projects</p></a><a href="/ai" className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">🤖 AI Generator</h3><p className="text-sm">Create new content with AI</p></a><a href="/agents" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">🔧 AI Agents</h3><p className="text-sm">Automate with AI agents</p></a><a href="/reasoning" className="p-6 bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg border-2 border-pink-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">🧠 Reasoning Agent</h3><p className="text-sm">Advanced multi-step reasoning</p></a><a href="/pricing" className="p-6 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg border-2 border-yellow-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">💎 Upgrade Plan</h3><p className="text-sm">View pricing and plans</p></a><a href="/dashboard-dev" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:shadow-lg transition-shadow"><h3 className="text-lg font-semibold mb-2">🛠️ Dev Tools</h3><p className="text-sm">Access OTP verification</p></a></div></div>
      </div>
    </div>
  );
}
