import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/UserContext';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthToken, setCurrentUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const { access_token } = await response.json();

      setAuthToken(access_token);
      localStorage.setItem('access_token', access_token);

      const userRes = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user');

      const user = await userRes.json();
      setCurrentUser(user);

      toast.success(`Welcome back, ${user.username || user.email || 'User'}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);

      const res = await fetch(`${API_URL}/login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      if (!res.ok) throw new Error('Google login failed');

      const { access_token } = await res.json();

      setAuthToken(access_token);
      localStorage.setItem('access_token', access_token);

      const userRes = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user');

      const user = await userRes.json();
      setCurrentUser(user);

      toast.success(`Welcome, ${user.username || user.email || 'User'}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in was unsuccessful. Try again.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl animate-fade-in">
        <div className="w-full md:w-1/2 p-10 bg-blue-100">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-yellow-300 py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Or sign in with Google</p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-6">
          <img
            src="/project1.png"
            alt="Illustration"
            className="rounded-xl w-full max-w-md"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 font-semibold underline hover:text-blue-800">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
