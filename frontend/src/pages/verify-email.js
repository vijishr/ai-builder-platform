import { useState, useEffect } from 'react';
import { authService } from '@/services';
import { useRouter } from 'next/router';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const tempEmail = localStorage.getItem('tempEmail');
    if (tempEmail) {
      setEmail(tempEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!otp || otp.length !== 6) {
        setError('OTP must be 6 digits');
        setLoading(false);
        return;
      }

      const response = await authService.verifyEmail(email, otp);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.removeItem('tempEmail');
      
      setSuccess('Email verified! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Verification failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.resendOtp(email);
      setSuccess('OTP resent to your email');
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Verify Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              placeholder="000000"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-2xl tracking-widest font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the OTP from your email</p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive OTP?{' '}
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-indigo-600 hover:underline font-semibold disabled:opacity-50"
            >
              Resend OTP
            </button>
          </p>
        </div>

        <p className="text-center text-gray-600 mt-6">
          <a href="/login" className="text-indigo-600 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

