import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.warn("You must agree to the terms and conditions.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.access_token);

        const userRes = await fetch('http://localhost:5000/me', {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const userData = await userRes.json();

        if (userRes.ok) {
          toast.success('Registration successful!');
          navigate('/');
        } else {
          toast.error('Could not fetch user info.');
        }

      } else {
        toast.error(data.error || 'Registration failed.');
      }

    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-600">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the <span className="underline">terms and conditions</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-[#4F9CF9] flex items-center justify-center p-6">
          <img
            src="/project1.png"
            alt="Illustration"
            className="max-w-xs md:max-w-sm rounded-lg drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;