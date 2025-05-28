const LoadingSpinner = ({ size = "large", message = "Loading..." }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        <span className="mt-3 text-gray-600 text-sm">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
