import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../apis/v1/v1";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Download,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Info,
  Shield,
  Globe,
  User,
  Clock,
} from "lucide-react";
import Button from "../components/Button";

const AppDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        setLoading(true);
        const appEndpoint = `${"/apps"}/${id}`;
        const response = await api.get(appEndpoint);
        
        if (response.data?.success) {
          // Extract app data from the response
          const appData = response.data.data.data || {};
          console.log("App data received:", appData);
          setApp(appData);
          
          // Check if user has already reviewed this app
          if (isAuthenticated && appData.Reviews) {
            const userReviewData = appData.Reviews.find(
              review => review.UserId === user?.UserID
            );
            if (userReviewData) {
              setUserRating(userReviewData.Rating);
              setUserReview(userReviewData.Comment);
            }
          }
        } else {
          // If the API call fails, show an error
          console.warn("API call failed:", response.data);
          toast.error("Failed to load app details");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching app details:", error);
        toast.error("Something went wrong. Please try again later.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [id, isAuthenticated, user, navigate]);

  const handleDownload = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login to download apps");
        navigate("/login");
        return;
      }

      const downloadEndpoint = `${import.meta.env.VITE_GET_APPS || "/apps"}/download/${id}`;
      const response = await api.post(downloadEndpoint);
      
      if (response.data?.success) {
        // If there's a direct download URL
        if (response.data.data?.downloadUrl) {
          window.open(response.data.data.downloadUrl, "_blank");
        } else {
          // Otherwise, show success message
          toast.success("Download started successfully!");
        }
      } else {
        toast.error(response.data?.message || "Failed to download app");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmittingReview(true);
      const reviewEndpoint = import.meta.env.VITE_ADD_REVIEW || "/apps/review";
      const response = await api.post(reviewEndpoint, {
        AppId: id,
        Rating: userRating,
        Comment: userReview,
      });

      if (response.data?.success) {
        toast.success("Review submitted successfully!");
        // Update the app data to include the new review
        setApp(prevApp => {
          const newReviews = [...(prevApp.Reviews || [])];
          const existingReviewIndex = newReviews.findIndex(
            review => review.UserId === user?.UserID
          );

          const newReview = {
            UserId: user?.UserID,
            UserName: user?.Name || "User",
            Rating: userRating,
            Comment: userReview,
            Date: new Date().toISOString(),
          };

          if (existingReviewIndex >= 0) {
            newReviews[existingReviewIndex] = newReview;
          } else {
            newReviews.push(newReview);
          }

          return {
            ...prevApp,
            Reviews: newReviews,
          };
        });
      } else {
        toast.error(response.data?.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (!app?.Screenshots || app.Screenshots.length <= 1) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === app.Screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!app?.Screenshots || app.Screenshots.length <= 1) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? app.Screenshots.length - 1 : prevIndex - 1
    );
  };

  const getAverageRating = () => {
    if (!app?.Reviews || app.Reviews.length === 0) return "N/A";
    const total = app.Reviews.reduce((sum, review) => sum + review.Rating, 0);
    return (total / app.Reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    if (!app?.Reviews || app.Reviews.length === 0) return [0, 0, 0, 0, 0];
    
    const distribution = [0, 0, 0, 0, 0];
    app.Reviews.forEach(review => {
      if (review.Rating >= 1 && review.Rating <= 5) {
        distribution[review.Rating - 1]++;
      }
    });
    
    return distribution;
  };

  // Placeholder image if app logo is invalid
  const getImageUrl = (logo) => {
    if (!logo || logo === "jj") {
      return "https://via.placeholder.com/400?text=App";
    }
    return logo;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-xl bg-gray-200 h-32 w-32 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">App Not Found</h2>
        <p className="text-gray-600 mb-6">The app you're looking for doesn't exist or has been removed</p>
        <Button 
          variant="primary" 
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
        </div>

        {/* App Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
            {/* App Logo */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(app.Logo)}
                alt={app.Name}
                className="w-32 h-32 rounded-xl object-cover shadow-md"
              />
            </div>

            {/* App Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{app.Name}</h1>
                  <p className="text-indigo-600 font-medium mb-2">
                    {app.Publisher?.CompanyName}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Released: {formatDate(app.Released)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg mr-4">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-lg font-bold text-gray-900">{getAverageRating()}</span>
                      <span className="text-sm text-gray-600 ml-1">/ 5</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">{app.Reviews?.length || 0}</span> reviews
                    </div>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <Download className="h-4 w-4 inline mr-1" />
                    <span>{app.Downloads || 0} downloads</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  onClick={handleDownload}
                  rightIcon={<Download className="h-4 w-4" />}
                  size="lg"
                >
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  rightIcon={<Share2 className="h-4 w-4" />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: app.Name,
                        text: `Check out ${app.Name} on Mahfuz's Apps Store!`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Screenshots */}
            {app.Screenshots && app.Screenshots.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Screenshots</h2>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={app.Screenshots[activeImageIndex]}
                        alt={`${app.Name} screenshot ${activeImageIndex + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    
                    {app.Screenshots.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                          aria-label="Previous screenshot"
                        >
                          <ChevronLeft className="h-6 w-6 text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                          aria-label="Next screenshot"
                        >
                          <ChevronRight className="h-6 w-6 text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  {app.Screenshots.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {app.Screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                            activeImageIndex === index ? "border-indigo-600" : "border-transparent"
                          }`}
                        >
                          <img
                            src={screenshot}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  {app.Description ? (
                    <p className="text-gray-700 whitespace-pre-line">{app.Description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Reviews & Ratings</h2>
              </div>
              <div className="p-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Average Rating */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{getAverageRating()}</div>
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(getAverageRating()) 
                              ? "text-yellow-500 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{app.Reviews?.length || 0} reviews</div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex-grow">
                    {getRatingDistribution().map((count, index) => {
                      const percentage = app.Reviews?.length 
                        ? Math.round((count / app.Reviews.length) * 100) 
                        : 0;
                      
                      return (
                        <div key={index} className="flex items-center mb-1">
                          <div className="w-12 text-sm text-gray-600 font-medium">{5 - index} star</div>
                          <div className="flex-grow mx-3 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-sm text-gray-600 text-right">{count}</div>
                        </div>
                      );
                    }).reverse()}
                  </div>
                </div>

                {/* Write a review */}
                {isAuthenticated && (
                  <div className="mb-8 border-t border-b border-gray-100 py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= userRating 
                                    ? "text-yellow-500 fill-current" 
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          rows="4"
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Share your experience with this app..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          variant="primary"
                          isLoading={submittingReview}
                        >
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Reviews</h3>
                  
                  {!app.Reviews || app.Reviews.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">No reviews yet</p>
                      <p className="text-sm text-gray-500">Be the first to review this app</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {app.Reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{review.UserName || "User"}</div>
                                <div className="text-sm text-gray-500">{formatDate(review.Date)}</div>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.Rating 
                                      ? "text-yellow-500 fill-current" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-gray-700 ml-13">
                            {review.Comment || <span className="text-gray-500 italic">No comment</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - App Info */}
          <div>
            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-medium text-gray-900">{app.Version}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium text-gray-900">{app.Size}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-900">{formatDate(app.Updated || app.UpdatedAt)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Developer</span>
                    <span className="font-medium text-gray-900">
                      {app.Publisher?.DevelopedBy}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">{app.Category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-medium text-gray-900">{app.Downloads || 0}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Debug Information - Only visible in development */}
            {import.meta.env.MODE === 'development' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Debug Information</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-auto max-h-64">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(app, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Info className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      {app.Requirements || "No specific requirements listed"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Safety & Privacy */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Safety & Privacy</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Security Verified</span>
                      <span className="text-sm text-gray-600">
                        This app has been scanned for viruses and malware
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Globe className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Developer Website</span>
                      {app.Website ? (
                        <a 
                          href={app.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-sm text-gray-600">Not provided</span>
                      )}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Release Date</span>
                      <span className="text-sm text-gray-600">
                        {formatDate(app.Released || app.ReleaseDate)}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Similar Apps */}
            {app.SimilarApps && app.SimilarApps.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Similar Apps</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {app.SimilarApps.map((similarApp) => (
                      <Link
                        key={similarApp._id}
                        to={`/app/${similarApp._id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={getImageUrl(similarApp.Logo)}
                          alt={similarApp.Name}
                          className="w-12 h-12 rounded-xl object-cover mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900">{similarApp.Name}</h3>
                          <p className="text-sm text-gray-600">{similarApp.Developer || "Unknown Developer"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails; 