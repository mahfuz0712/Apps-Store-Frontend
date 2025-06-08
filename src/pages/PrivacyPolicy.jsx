import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-indigo-100 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="prose prose-indigo max-w-none">
              <p>
                This Privacy Policy describes how Mahfuz's Apps Store ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Personal Information</h3>
              <p>
                When you create an account, apply for a developer account, or use our services, we may collect the following types of personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Payment information (for developer accounts)</li>
                <li>Device information</li>
                <li>IP address</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Usage Information</h3>
              <p>
                We also collect information about how you use our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Apps you download or purchase</li>
                <li>Reviews and ratings you provide</li>
                <li>Browsing history within our platform</li>
                <li>Interaction with app listings and categories</li>
                <li>Search queries</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
              <p>We use your personal information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>To provide and maintain our services</li>
                <li>To process your transactions</li>
                <li>To communicate with you about your account, purchases, or inquiries</li>
                <li>To improve our services and develop new features</li>
                <li>To personalize your experience and provide recommendations</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information Sharing</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>App Developers:</strong> When you download or purchase an app, we share necessary information with the app developer to facilitate the transaction and provide support.
                </li>
                <li>
                  <strong>Service Providers:</strong> We use third-party service providers to help us operate our business and provide services to you.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required by law, regulation, or legal process.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at contact@mahfuzapps.com.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can adjust your browser settings to refuse cookies, but this may limit some functionality of our services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-3">
                <p>Email: contact@mahfuzapps.com</p>
                <p>Phone: 01876891680</p>
                <p>Address: Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 