import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)

      const userRes = await fetch('http://localhost:5000/me', {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!userRes.ok) {
        throw new Error('Failed to fetch user')
      }

      const user = await userRes.json()
      toast.success(`Welcome back, ${user.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-12">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl animate-fade-in">

        {/* Left Side: Form */}
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
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 bg-blue-500 flex items-center justify-center p-6">
          <img
            src="/project1.png"
            alt="Illustration"
            className="rounded-xl w-full max-w-md"
          />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 font-semibold underline hover:text-blue-800">
          Register
        </Link>
      </p>
    </div>
  )
}

export default Login
