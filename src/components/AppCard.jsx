import PropTypes from "prop-types";
import { ArrowDownToLine, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

const AppCard = ({ app, hideButtons = false }) => {
  // Helper function to handle invalid image URLs
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/512x512?text=No+Image";
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
      <div className="aspect-square overflow-hidden relative bg-indigo-50">
        <img
          src={app.Logo || app.logo || "https://via.placeholder.com/512x512?text=No+Image"}
          alt={app.Name || app.name || "App"}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        
        {(app.Featured || app.featured) && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {app.Name || app.name || "Unnamed App"}
        </h3>
        
        <div className="flex items-center justify-between mt-1 mb-2">
          <span className="text-sm text-gray-500">{app.Category || app.category || "General"}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-700 ml-1">
              {app.Rating || app.rating || "4.5"}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {app.Description || app.description || "No description available."}
        </p>
        
        {!hideButtons && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<ArrowDownToLine className="h-4 w-4" />}
              as={Link}
              to={`/app/${app._id || app.id}`}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  hideButtons: PropTypes.bool,
};

export default AppCard; 