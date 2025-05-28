import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MahfuzUpdater from "mahfuz-updater";
import Footer from "../components/Footer";
import "../styles/Modal.css";

const AppDetails = () => {
  const navigate = useNavigate();
  const { appName } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        const appsFromDatabase = import.meta.env.VITE_APPS;
        const response = await axios.get(
          `${appsFromDatabase}/${appName}`
        );
        setApp(response.data);
      } catch (err) {
        setError("App not found", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppDetails();
  }, [appName]);

  useEffect(() => {
    let interval;
    if (isDownloading && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    if (timer === 0 && isDownloading) {
      setIsDownloading(false); // Stop downloading when timer reaches 0
    }
    return () => clearInterval(interval);
  }, [isDownloading, timer]);

  const downloadHandler = () => {
    const developerId = app.developerId;
    const appURl = `${developerId}/${appName}`;
    // const appToken = import.meta.env.VITE_APP_TOKEN;
    const appToken = app.gitToken;

    const downloader = new MahfuzUpdater(appURl, appToken);
    const checkForUpdates = async () => {
      const result = await downloader.downloadLatest();
      if (result.success) {
        setIsDownloading(true);
        setTimer(10); // Start the countdown from 10
        // Example: Start download
        window.location.href = result.downloadUrl;
      } else {
        openModal(result.message);
        // You can handle the error response here (e.g., show a message in the UI)
      }
    }
    checkForUpdates();
  };

  const goBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-700 text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <span className="text-red-600 text-lg font-semibold">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans flex flex-col min-h-screen w-screen mt-4">
      {/* Header */}
      <header className="bg-green-600 text-white flex flex-wrap items-center justify-between p-4 mt-4">
        <div className="text-2xl font-bold">Mahfuz&apos;s Apps Store</div>
        <button
          onClick={goBack}
          className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 shadow-md"
        >
          Back to Home
        </button>
      </header>

      {/* App Details Section */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* App Header */}
          <div className="flex items-center space-x-6">
            <img
              src={app.logo}
              alt={`${app.name} Logo`}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold">{app.name}</h1>
              <p className="text-gray-600 mt-2">{app.company}</p>
              <p className="text-gray-600 mt-2">{app.developerName}</p>

              <div className="mt-3 flex items-center space-x-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs shadow-md">
                  {app.ratings} ★
                </span>
                <span className="text-gray-500 text-sm">
                  ({app.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* App Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">About this app</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {app.description}
            </p>
          </div>

          {/* Download Button */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <button
              onClick={downloadHandler}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 shadow-lg"
            >
              Download
            </button>
            {isDownloading && (
              <p className="text-gray-600">
                Downloading starting in {timer} seconds
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {/* Modal Component */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDetails;
