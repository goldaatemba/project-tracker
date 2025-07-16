import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agree) {
      alert("You must agree to terms and conditions.")
      return
    }
    console.log({ name, email, password })
    // Perform login/signup logic
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200 px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 bg-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Get Started Now</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-5 w-5 text-blue-600 accent-black"
              />
              <label htmlFor="agree" className="ml-2 text-sm text-black">
                I agree to terms and conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-[#FFE602] py-2 rounded hover:bg-blue-600 font-semibold"
            >
              Signup
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2 bg-[#4F9CF9] flex items-center justify-center rounded-l-lg-40 p-4">
          <img
            src="/project1.png"
            alt="Illustration"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-sm text-black">
        Already have an account? <p className="mt-6 text-sm text-black">
  Already have an account? <Link to="/login" className="font-semibold underline">Login</Link>
</p>
      </p>
    </div>
  )
}

export default Register
