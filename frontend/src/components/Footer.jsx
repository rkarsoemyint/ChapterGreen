import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, 
  FaPhoneFlip, FaEnvelope, FaLocationDot, FaArrowRightLong, FaHeart,
  FaHouse, FaAddressCard, FaBookOpen 
} from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const quickLinks = [
    { name: "Home", path: "/", icon: <FaHouse /> },
    { name: "About", path: "/about", icon: <FaAddressCard /> },
    { name: "Books", path: "/explore", icon: <FaBookOpen /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter a valid email address.", { position: "bottom-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (result.success || response.ok) {
        toast.success("Thank you for subscribing to our newsletter!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setEmail('');
      } else {
        toast.error(result.message || "Something went wrong. Please try again.", {
          position: "bottom-right"
        });
      }
    } catch (error) {
      console.error("Newsletter Subscription Error:", error);
      toast.error("Server error: Unable to process your subscription.", {
        position: "bottom-right"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#f8fcfc] pt-14 pb-8 border-t border-gray-100 mt-20">
  <div className="container mx-auto px-5 sm:px-8 lg:px-10">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
      
     
      <div className="text-center sm:text-left">
        <Link
          to="/"
          className="text-2xl font-bold text-[#2d5a5a] tracking-tight uppercase inline-block mb-4"
        >
          Chapter<span className="text-green-600">Green</span>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto sm:mx-0">
          Your gateway to literary adventures. Discover, explore,
          and immerse yourself in the world of books.
        </p>

        <div className="flex justify-center sm:justify-start space-x-3">
          {[
            { icon: <FaFacebookF />, link: "https://facebook.com" },
            { icon: <FaTwitter />, link: "https://twitter.com" },
            { icon: <FaInstagram />, link: "https://instagram.com" },
            { icon: <FaYoutube />, link: "https://youtube.com" }
          ].map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-sm"
            >
              <span className="text-sm">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="font-bold text-gray-800 mb-5">Quick Links</h3>

        <ul className="space-y-3 text-sm text-gray-500">
          {quickLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="hover:text-green-600 transition-colors flex items-center justify-center sm:justify-start gap-2.5 group"
              >
                <span className="text-gray-400 group-hover:text-green-600 text-xs">
                  {link.icon}
                </span>

                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="font-bold text-gray-800 mb-5">
          Stay Updated
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Subscribe to our newsletter for the latest releases
          and exclusive offers.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="relative max-w-md mx-auto sm:mx-0"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full p-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 bg-white shadow-sm text-sm disabled:bg-gray-100"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center disabled:bg-gray-400 min-w-[36px] min-h-[36px]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaArrowRightLong />
            )}
          </button>
        </form>
      </div>

      <div className="text-center sm:text-left">
        <h3 className="font-bold text-gray-800 mb-5">
          Contact Us
        </h3>

        <ul className="space-y-4 text-sm text-gray-500">
          <li className="flex items-start justify-center sm:justify-start gap-3">
            <FaLocationDot className="text-green-600 mt-1 flex-shrink-0" />
            <span>
              Kaba Aye Pagoda Road, Bahan Township, Yangon,
              Myanmar.
            </span>
          </li>

          <li className="flex items-center justify-center sm:justify-start gap-3">
            <FaPhoneFlip className="text-green-600 flex-shrink-0" />
            <span>+95 9 123456789</span>
          </li>

          <li className="flex items-center justify-center sm:justify-start gap-3">
            <FaEnvelope className="text-green-600 flex-shrink-0" />
            <span>contact@chaptergreen.com</span>
          </li>
        </ul>
      </div>
    </div>


    <div className="mt-14 pt-6 border-t border-gray-100 text-center flex flex-col md:flex-row items-center justify-between gap-3">
      
      <p className="text-xs text-gray-400">
        &copy; {currentYear} ChapterGreen. All rights reserved.
      </p>

      <p className="text-xs text-gray-400 flex items-center gap-1 italic">
        Developed with
        <FaHeart className="text-rose-500 fill-rose-500 animate-pulse text-[10px]" />
        by
        <span className="font-bold text-green-700 not-italic hover:text-[#2d5a5a] transition-colors ml-0.5">
          Thant Zin Oo
        </span>
      </p>
    </div>
  </div>
</footer>
  );
};

export default Footer;