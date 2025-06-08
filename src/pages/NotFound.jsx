// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 pt-20 pb-10">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-medium text-gray-600 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
