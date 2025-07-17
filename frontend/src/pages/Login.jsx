import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      })
  
      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      console.log('Logged in:', data)

      navigate('/') 

    } catch (err) {
      console.error(err)
      alert('Login failed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200 px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 bg-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-5 w-5 text-blue-600 accent-black"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-black">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-[#FFE602] py-2 rounded hover:bg-blue-600 font-semibold"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 bg-[#4F9CF9] flex items-center justify-center p-4">
          <img
            src="/project1.png"
            alt="Illustration"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-sm text-black">
        Don’t have an account?{' '}
        <Link to="/register" className="font-semibold underline">
          Register
        </Link>
      </p>
    </div>
  )
}

export default Login
