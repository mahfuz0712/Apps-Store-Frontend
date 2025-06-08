function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 px-4" role="alert">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto text-left">
            <pre className="text-sm text-red-600 whitespace-pre-wrap break-words">{error.message}</pre>
          </div>
          <button 
            onClick={resetErrorBoundary}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
export default ErrorFallback;