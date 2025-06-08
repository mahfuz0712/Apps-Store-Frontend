import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-indigo-600 to-blue-900 text-white py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-semibold mb-4 flex items-center">
              <span>
                Mahfuz<span className="font-light text-sm">'s Apps Store</span>
              </span>
            </div>
            <p className="text-indigo-100 text-sm mb-4">
              Your one-stop destination for quality applications and games.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:contact@mahfuzapps.com" className="text-indigo-200 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white/90">Quick Links</h3>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="https://github.com/mahfuz0712" target="_blank" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Developer
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white/90">Resources</h3>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li>
                <Link to="/docs" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  API
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white/90">Contact</h3>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li className="flex items-start">
                <span className="text-white/70 mr-2">Email:</span>
                <a href="mailto:mahfuzrahman0712@gmail.com" className="hover:text-white transition-colors">
                  mahfuzrahman0712@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-white/70 mr-2">Contact:</span>
                <a href="tel:01876891680" className="hover:text-white transition-colors">
                  01876891680
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-white/70 mr-2">Location:</span>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-indigo-500/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-indigo-200 text-sm">
          <p>© {currentYear} Mahfuz's Apps Store. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
