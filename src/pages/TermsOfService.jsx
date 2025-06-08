import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-indigo-100 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="prose prose-indigo max-w-none">
              <p>
                Please read these Terms of Service ("Terms") carefully before using Mahfuz's Apps Store website and services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account password and for any activities or actions under your account.
              </p>
              <p className="mt-3">
                You agree not to create more than one account per person or create an account on behalf of someone else without permission.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Developer Accounts</h2>
              <p>
                If you apply for a developer account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Pay the required application fee (500 BDT)</li>
                <li>Provide accurate information about yourself and your applications</li>
                <li>Comply with our developer guidelines and content policies</li>
                <li>Not distribute malicious software or content that violates intellectual property rights</li>
                <li>Maintain and support your applications as necessary</li>
              </ul>
              <p className="mt-3">
                We reserve the right to reject developer applications or remove applications from our platform at our discretion.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Content and Applications</h2>
              <p>
                Our platform allows users to download and access various applications. We do not claim ownership of these applications, and each application is the responsibility of its respective developer.
              </p>
              <p className="mt-3">
                You understand that by using our services, you may encounter content that may be offensive, inaccurate, or otherwise objectionable. We do not endorse, support, represent, or guarantee the completeness, truthfulness, accuracy, or reliability of any content or applications on our platform.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Prohibited Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in any activity that interferes with or disrupts our services</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Use our services to distribute malware or other harmful code</li>
                <li>Collect or harvest user data without permission</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                Our services and content (excluding content provided by users or developers) are protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Payments and Refunds</h2>
              <p>
                Developer application fees are non-refundable except in cases where applications are not reviewed within 72 hours. In such cases, the full amount will be automatically refunded to the payment method used.
              </p>
              <p className="mt-3">
                For app purchases, refund policies are determined by individual developers. Please contact the respective developer for refund requests.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Mahfuz's Apps Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, resulting from your access to or use of our services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Mahfuz's Apps Store and its officers, directors, employees, and agents from and against any claims, disputes, demands, liabilities, damages, losses, and expenses, including reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of our services or your violation of these Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at our sole discretion, without prior notice, for any reason, including if you breach these Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p>
                We may revise these Terms from time to time. The most current version will always be posted on our website. By continuing to use our services after revisions become effective, you agree to be bound by the revised Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of Bangladesh, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
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

export default TermsOfService; 