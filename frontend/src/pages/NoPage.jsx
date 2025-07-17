import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react'; 

export default function NoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 text-center px-4">
      <div className="animate-bounce mb-6 text-blue-600">
        <AlertTriangle size={60} />
      </div>
      <h1 className="text-7xl font-extrabold text-blue-700 mb-4 tracking-tight">404</h1>
      <p className="text-2xl text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
