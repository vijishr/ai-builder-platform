import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EnhancedDashboard from '@/components/EnhancedDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return <EnhancedDashboard />;
}
