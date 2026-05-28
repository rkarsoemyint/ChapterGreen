import { toast } from 'react-toastify';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext';
import { useCollection } from '../context/CollectionContext';
import { Star, StarHalf, Heart } from 'lucide-react';
import { FaCartShopping, FaHeart, FaBookOpen } from "react-icons/fa6";

const DynamicStarRating = ({ rating = 5 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating); 
  const hasHalfStar = rating % 1 !== 0; 

  return (
    <div className="flex text-yellow-500 mb-4 items-center gap-0.5">
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) {
          return <Star key={index} className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500" />;
        } else if (index === fullStars && hasHalfStar) {
          return <StarHalf key={index} className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500" />;
        } else {
          return <Star key={index} className="w-3.5 h-3.5 text-slate-300 fill-slate-100" />;
        }
      })}
    </div>
  );
};

const BookImageInline = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center text-slate-400 border border-slate-100 gap-2 select-none`}>
        <FaBookOpen className="w-12 h-12 text-green-600/60" />
        <span className="text-xs font-semibold text-slate-400">No Cover</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)} 
    />
  );
};

const Home = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const { toggleCollection, isInCollection } = useCollection();
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const result = await response.json();

        if (result.success) {
          setAllBooks(result.data);
          setFeaturedBooks(result.data.slice(0, 4));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load books. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    if (!user) {
      toast.warning("Please log in to continue.");
      navigate("/login");
      return;
    }

    addToCart(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const stats = [
    {
      value: allBooks.length > 0 ? `${allBooks.length}+` : "50k+",
      label: "Titles",
    },
    { value: "1.2M", label: "Readers" },
    { value: "240+", label: "Topics" },
  ];

  return (
    <div className="bg-white overflow-hidden">

      <section className="py-14 md:py-24 bg-gradient-to-br from-teal-500 via-emerald-600 to-blue-700 relative">

        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-tight">
            Discover Your Next <br />
            <span className="text-yellow-400">Great Adventure.</span>
          </h1>

          <p className="text-teal-50 mt-6 text-sm sm:text-lg md:text-2xl max-w-3xl mx-auto">
            Explore books, knowledge, and inspiration all in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <Link
              to="/explore"
              className="px-10 py-4 bg-yellow-400 text-teal-900 rounded-2xl font-black hover:scale-105 transition"
            >
              Browse Books
            </Link>

            <button
              onClick={() =>
                document.getElementById("about-story")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="px-10 py-4 border-2 border-white/40 text-white rounded-2xl font-black hover:bg-white hover:text-black transition"
            >
              Learn More
            </button>
          </div>

          <div className="mt-16 md:mt-24 w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-teal-100 px-6 sm:px-10 md:px-16 py-8">

            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">

              {stats.map((stat, i) => (
                <div key={i} className="py-6 text-center">
                  <h3 className="text-3xl sm:text-5xl font-black text-teal-800">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 uppercase mt-2 tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="pt-32 md:pt-40 pb-20 px-5 sm:px-8 lg:px-10">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10 border-b pb-6">

            <div>
              <h2 className="text-3xl sm:text-4xl font-black">
                New Arrivals
              </h2>
              <p className="text-green-600 text-xs sm:text-sm font-bold mt-2">
                Recently added books
              </p>
            </div>

            <Link
              to="/explore"
              className="bg-green-50 text-green-700 px-6 py-6 rounded-full font-bold hover:bg-green-700 hover:text-white transition text-center"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-20 text-green-600 font-bold animate-pulse">
              Loading...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {featuredBooks.map((book) => {
                const isSaved = isInCollection(book._id);

                return (
                  <div
                    key={book._id}
                    className="bg-slate-50 rounded-3xl p-5 hover:shadow-2xl transition"
                  >

                    <Link to={`/books/${book._id}`}>
                      <div className="h-72 sm:h-80 overflow-hidden rounded-2xl">
                        <BookImageInline
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover hover:scale-110 transition"
                        />
                      </div>

                      <h3 className="mt-5 font-bold truncate">
                        {book.title}
                      </h3>

                      <p className="text-green-600 text-sm">
                        {book.author}
                      </p>
                    </Link>

                    <div className="flex justify-between items-center mt-5">

                      <span className="font-black text-xl">
                        ${book.price}
                      </span>

                      <div className="flex gap-2">

                        <button
                          onClick={() => toggleCollection(book)}
                          className={`p-2 rounded-xl ${
                            isSaved
                              ? "bg-red-100 text-red-500"
                              : "bg-white"
                          }`}
                        >
                          <FaHeart />
                        </button>

                        <button
                          onClick={() => handleAddToCart(book)}
                          className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-800"
                        >
                          <FaCartShopping />
                        </button>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <PremierSelection books={allBooks} />
      <StaffRecommendations books={allBooks} onAddToCart={handleAddToCart} />

      <div id="about-story">
        <LiteraryJourney />
      </div>

      <LegendaryVolumes books={allBooks} />

    </div>
  );
};


const PremierSelection = ({ books }) => {
  const { toggleCollection, isInCollection } = useCollection();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const curated = [...books]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <section className="bg-gradient-to-br from-slate-100 via-blue-100 to-teal-100 py-24"> 
      <div className="container mx-auto px-10">
        <div className="mb-12 border-l-8 border-[#008080] pl-6">
          <h3 className="text-4xl font-black text-slate-800">Premier Selection</h3>
          <p className="text-slate-600 mt-2 font-medium">Highest rated titles by our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {curated.map((item) => {
            const isSaved = isInCollection(item?._id);

            return (
              <div 
                key={item._id} 
                className="bg-white p-8 rounded-[32px] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-blue-200/50"
              >
                <Link to={`/books/${item._id}`} className="flex-grow group cursor-pointer block">
                  
                  <DynamicStarRating rating={item.rating || 0} />
                  
                  <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight min-h-[3.5rem] line-clamp-2 group-hover:text-[#008080] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-sm mb-4 italic font-medium">{item.author}</p>
                </Link>

                <div className="mt-auto pt-5 border-t border-slate-100">
                  <div className="text-2xl font-black text-[#008080] mb-6">${item.price}</div>
                  
                  <button 
                    onClick={() => {
                      if (!user) {
                        toast.warning("Please log in to save books.");
                        navigate("/login");
                        return;
                      }

                      toggleCollection(item);
                    }}

                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                      isSaved
                        ? 'bg-gradient-to-r from-green-700 to-green-800 shadow-green-200 text-white' 
                        : 'bg-gradient-to-r from-[#008080] to-teal-600 hover:from-teal-700 hover:to-[#008080] text-white shadow-teal-200'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-white" : "fill-none"}`} />
                    <span>{isSaved ? 'Saved in Collection' : 'Add to Collection'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const StaffRecommendations = ({ books, onAddToCart }) => {
  const favorites = books.slice(2, 6); 

  return (
    <section className="py-24 bg-gradient-to-t from-teal-50 to-white">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[60px] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="text-center mb-16 relative">
            <h3 className="text-4xl font-extrabold text-white">Staff Recommendations</h3>
            <div className="w-32 h-2 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            {favorites.map((book) => (
              <div key={book._id} className="group bg-white/10 backdrop-blur-md p-4 rounded-[32px] border border-white/20 hover:bg-white/20 transition-all">
                <div className="relative mb-6 overflow-hidden rounded-2xl shadow-xl">
                  
                  <BookImageInline 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  <div className="absolute top-4 right-4 bg-yellow-400 px-2 py-1 rounded-lg text-xs font-black text-teal-900 shadow-md">TOP PICK</div>
                </div>
                <h4 className="font-bold text-xl text-white mb-1 truncate">{book.title}</h4>
                <p className="text-sm text-teal-100 mb-4 opacity-80">{book.author}</p>
                <div className="flex flex-col gap-4">
                   <span className="font-black text-2xl text-yellow-400">${book.price}</span>
                   <button 
                    onClick={() => onAddToCart(book)}
                    className="bg-white text-teal-800 hover:bg-yellow-400 hover:text-teal-900 py-3 rounded-xl font-black transition-all shadow-lg transform active:scale-95"
                   >
                     Add to Cart
                   </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 relative">
            <Link to="/explore" className="inline-block px-12 py-4 bg-teal-900/40 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-teal-800 transition-all">
              Explore More Favorites →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


const LiteraryJourney = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl blur-xl opacity-20"></div>
            <img 
              src="https://i.ibb.co/P2G03h7/photo-1524995997946-a1c2e315a42f.avif" 
              alt="The Story Behind ChapterGreen" 
              className="relative rounded-3xl shadow-xl w-full h-[450px] object-cover"
            />
          </div>

          <div className="lg:w-1/2">
            <h3 className="text-4xl font-black text-slate-900 mb-6">The Story Behind ChapterGreen</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              ChapterGreen began with a simple vision: to create a sustainable home for literature that grows with its readers. 
              Every "Chapter" we share is a seed planted for a greener, more knowledgeable future, connecting you to stories that truly matter.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
                <span className="block text-2xl font-black text-green-700">10K+</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Books Collection</span>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
                <span className="block text-2xl font-black text-green-700">50K+</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Happy Readers</span>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
                <span className="block text-2xl font-black text-green-700">15+</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Industry Awards</span>
              </div>
            </div>

            <Link to="/about" className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all shadow-lg shadow-green-100">
              Discover Our Roots →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const LegendaryVolumes = ({ books }) => {
  const volumes = books.slice(1, 4);
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black text-slate-900 mb-4">Masterpiece Collection</h3>
          <div className="w-20 h-1.5 bg-green-500 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-500 max-w-xl mx-auto">Explore our finest selection of timeless works and world-class storytelling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {volumes.map((v) => (
            <div key={v._id} className="group cursor-pointer" onClick={() => navigate(`/books/${v._id}`)}>
              <div className="overflow-hidden rounded-3xl mb-6 shadow-md border-4 border-white h-72 bg-slate-200 relative">
                
                <BookImageInline 
                  src={v.coverImage} 
                  alt={v.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
              </div>
              <h4 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors truncate">{v.title}</h4>
              <p className="text-green-600 text-sm font-semibold mb-3">{v.author}</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                {v.description || "A high-caliber literary work that has earned its place among the greatest masterpieces."}
              </p>
              <button className="text-green-600 font-bold border-b-2 border-green-200 hover:border-green-600 pb-1 transition-all text-xs uppercase tracking-widest">
                Explore Work →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;