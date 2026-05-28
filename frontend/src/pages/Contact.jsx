import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning("Please enter a valid email address structure (e.g., name@example.com).", {
        icon: ({ theme, type }) => <span className="text-xl">✉️</span>
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Thank you ${formData.name}! Your message has been sent successfully.`, {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error("Server error: Unable to send message at the moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-[#2d5a5a] mt-4 mb-4">
            Contact ChapterGreen
          </h2>
          <p className="text-gray-500">
            Have any questions, feedback, or custom book requests? Reach out to us anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 flex flex-col gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-green-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Email Us</h4>
                <p className="text-xs text-gray-500 mt-1">support@chaptergreen.com</p>
                <p className="text-xs text-gray-500">info@chaptergreen.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-green-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Call Us</h4>
                <p className="text-xs text-gray-500 mt-1">+95 9 123 456 789</p>
                <p className="text-xs text-gray-500">+95 1 987 654</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-green-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Business Hours</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium">Monday - Saturday</p>
                <p className="text-xs text-emerald-600 font-semibold">9:00 AM - 5:00 PM</p>
                <p className="text-[11px] text-gray-400 mt-0.5">*Closed on Sundays</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-green-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Location</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Kaba Aye Pagoda Road,<br /> Bahan Township, Yangon,<br />Myanmar.
                </p>
              </div>
            </div>

          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
                <input 
                  type="text"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Thant Zin Oo" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="example@domain.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject / Topic</label>
                <input 
                  type="text"
                  required
                  disabled={loading}
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Inquiry about custom book delivery" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  rows="4"
                  required
                  disabled={loading}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message here..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none disabled:bg-gray-50"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-[#2d5a5a] text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-gray-100 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        <div className="mt-16 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="rounded-2xl overflow-hidden h-80 sm:h-96 w-full relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.6107389163273!2d96.15383327579453!3d16.845642818160032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1936bb483df6b%3A0xe6bf44b9fa3ae4db!2sKaba%20Aye%20Pagoda%20Rd%2C%20Yangon!5e0!3m2!1sen!2smm!4v1716300000000!5m2!1sen!2smm"
              className="w-full h-full border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ChapterGreen Yangon Hub Location"
            ></iframe>
            
            <div className="absolute top-4 left-4 bg-[#2d5a5a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md pointer-events-none">
              Yangon Fulfillment Hub
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;