import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Award, Users, BookOpen, Star, 
  Eye, Target, MapPin, Clock 
} from 'lucide-react';

const About = () => {
  const [counts, setCounts] = useState({
    genres: "20+",
    readers: "5,000+",
    booksSold: "10K+",
    rating: "4.9"
  });

  useEffect(() => {
    const fetchAboutStats = async () => {
      try {
        const [categoriesRes, booksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories').catch(() => null),
          axios.get('http://localhost:5000/api/books').catch(() => null)
        ]);
    
        const genresCount = categoriesRes?.data?.success 
          ? `${categoriesRes.data.data.length}+` 
          : "20+";

        let averageRating = "4.9";
        if (booksRes?.data?.success) {
          const books = booksRes.data.data || [];
          const ratedBooks = books.filter(b => b.rating > 0);
          if (ratedBooks.length > 0) {
            const totalRating = ratedBooks.reduce((sum, b) => sum + b.rating, 0);
            averageRating = (totalRating / ratedBooks.length).toFixed(1);
          }
        }

        
        setCounts({
          genres: genresCount,
          readers: "5,000+",      
          booksSold: "10K+",     
          rating: averageRating
        });

      } catch (error) {
        console.error("Error fetching stats for About page:", error);
      }
    };

    fetchAboutStats();
  }, []);


  const stats = [
    { icon: <BookOpen className="w-5 h-5 text-emerald-600" />, count: counts.genres, label: "Book Genres" },
    { icon: <Users className="w-5 h-5 text-emerald-600" />, count: counts.readers, label: "Happy Readers" },
    { icon: <Award className="w-5 h-5 text-emerald-600" />, count: counts.booksSold, label: "Books Sold" },
    { icon: <Star className="w-5 h-5 text-emerald-600" />, count: counts.rating, label: "Store Rating" },
  ];

  const team = [
    {
      name: "Daw Nadi Chan Mya",
      role: "Founder & Chief Curator",
      image: "https://i.ibb.co/4nTWhyZk/photo-1534528741775-53994a69daeb.avif"
    },
    {
      name: "U Aung Thu Phyo",
      role: "Operations & Logistics Director",
      image: "https://i.ibb.co/v5tt4VQ/photo-1507003211169-0a1dd7228f2d.avif"
    },
    {
      name: "Daw Nilar Lwin",
      role: "Customer Happiness Manager",
      image: "https://i.ibb.co/wZyRp40G/photo-1517841905240-472988babdf9.avif"
    }
  ];

  const sanctuaries = [
    {
      city: "Naypyitaw Head Office",
      time: "9AM - 6PM",
      image: "https://i.ibb.co/k22dhFQ2/IMG-9722-edit-1024x683.jpg",
      address: "Yaza Thingaha Road, Hotel Zone, Ottarathiri Township, Naypyitaw."
    },
    {
      city: "Yangon Hub",
      time: "9AM - 5PM",
      image: "https://i.ibb.co/0pdkDj64/Yangon.jpg",
      address: "Kaba Aye Pagoda Road, Bahan Township, Yangon."
    },
    {
      city: "Mandalay Branch",
      time: "9AM - 5PM",
      image: "https://i.ibb.co/GQBGtGvz/DSC-2088.webp",
      address: "Theikpan Road, Between 73rd & 78th Street, Maha Aungmye Township, Mandalay."
    },
    {
      city: "Taunggyi Branch",
      time: "9AM - 5PM",
      image: "https://i.ibb.co/MkVVYymz/202511016e19b0406d0743e988a4c6dc6e6111e3-2025110128084eb271234650820be0e1d7218b4c.png",
      address: "Bogyoke Aung San Road, Yay Aye Kwin Quarter, Taunggyi."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        
       
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#1e3d3d] to-[#2d5a5a] bg-clip-text text-transparent tracking-tight mb-6">
            Building Your Ultimate Library
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto mb-6 rounded-full" />
          <p className="text-gray-500 font-medium text-sm sm:text-base leading-relaxed">
            Welcome to ChapterGreen. Your premium destination for handpicked tech blueprints, 
            business strategies, and intellectual literature. Discover, shop, and own the books 
            that shape your growth with nationwide delivery.
          </p>
        </div>

     
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-2xl mb-4 border border-emerald-100/50 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight mb-1">{stat.count}</h3>
              <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-28">
          <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-[340px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
            <img 
              src="https://i.ibb.co/h1Y8XggS/photo-1507842217343-583bb7270b66.jpg" 
              alt="Our Curated Bookstore Collection" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="bg-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Premium Bookstore</span>
              <h4 className="text-lg font-bold mt-2">Connecting Readers with Quality Books</h4>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-3">Our Core Passion</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                We believe that owning a physical book is an investment in yourself. ChapterGreen brings together the most essential literary resources, curated meticulously to fuel your personal and professional journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 text-[#2d5a5a] font-bold text-sm mb-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Our Vision</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">To be Myanmar’s most trusted online bookstore for authentic knowledge and seamless shopping.</p>
              </div>

              
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 text-[#2d5a5a] font-bold text-sm mb-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Our Mission</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">To deliver genuine, life-changing books directly to readers across the country with premium care.</p>
              </div>
            </div>
          </div>
        </div>

     
        <div className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">Meet Our Team</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="h-72 sm:h-80 overflow-hidden bg-gray-50 relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                  />
                </div>
                <div className="p-5 flex justify-between items-center bg-white">
                  <div>
                    <h4 className="font-bold text-gray-800 text-base">{member.name}</h4>
                    <p className="text-xs font-semibold text-emerald-600/90 mt-0.5">{member.role}</p>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-[#2d5a5a] hover:text-white transition-all scale-90">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                   
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-[#2d5a5a] hover:text-white transition-all scale-90">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                 
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-[#2d5a5a] hover:text-white transition-all scale-90">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">Our Operating Hubs</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sanctuaries.map((branch, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="h-36 sm:h-44 overflow-hidden bg-gray-50">
                    <img 
                      src={branch.image} 
                      alt={branch.city} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{branch.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span>{branch.time}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal tracking-wide">
                    {branch.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;