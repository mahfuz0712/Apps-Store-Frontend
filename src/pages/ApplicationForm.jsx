import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    BkashTransactionId: "",
    PaidAmount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const createApplicantUrl = import.meta.env.VITE_CREATE_APPLICANTS;
      const response = await axios.post(createApplicantUrl, {
        ...formData,
        Role: "Developer",
        PaidDate: new Date(),
        Applied: new Date(),
      });

      if (response.data?.success) {
        swal({
          title: "✅ Application Submitted",
          text: "Your application has been submitted successfully.",
          icon: "success",
          button: "OK",
        });
        setFormData({
          Name: "",
          Email: "",
          Phone: "",
          BkashTransactionId: "",
          PaidAmount: "",
        });
      } else {
        swal({
          title: "⚠️ Application Failed",
          text: response.data?.message || "Please try again later.",
          icon: "warning",
          button: "OK",
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        swal({
          title: "⚠️ Application Failed",
          text: error.response.data.message,
          icon: "warning",
          button: "OK",
        });
      } else {
        swal({
          title: "❌ Error",
          text: "An unexpected error occurred. Please try again later.",
          icon: "error",
          button: "OK",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Apply for Developer Account</h2>
      <p className="mb-4 text-gray-600">
        Send <strong>500৳</strong> to <strong>01876891680</strong> via Bkash and fill the form.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Name"
          placeholder="Full Name"
          value={formData.Name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="tel"
          name="Phone"
          placeholder="Phone Number"
          value={formData.Phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="BkashTransactionId"
          placeholder="Bkash Transaction ID"
          value={formData.BkashTransactionId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="PaidAmount"
          placeholder="Paid Amount"
          value={formData.PaidAmount}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
