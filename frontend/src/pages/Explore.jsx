import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Tag, BookOpen, Loader2, ChevronLeft, ChevronRight, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Explore = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const location = useLocation(); 
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8; 
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const navbarSearch = queryParams.get("search") || "";
    
    if (navbarSearch) {
      setSearchTerm(navbarSearch);
    }
  }, [location.search]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const booksResponse = await fetch('http://localhost:5000/api/books');
        const booksResult = await booksResponse.json();
        if (booksResult.success) setBooks(booksResult.data || []);


        const catResponse = await fetch('http://localhost:5000/api/categories');
        const catResult = await catResponse.json();
        if (catResult.success && catResult.data) {
          setCategories(['All', ...catResult.data]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = (
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const bookCat = book.category?._id || book.category?.name || book.category;
    
    const matchesCategory = selectedCategory === 'All' || 
                            bookCat === selectedCategory || 
                            book.category?.name === selectedCategory; 

    return matchesSearch && matchesCategory;
  });


  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(oldPage => oldPage + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(oldPage => oldPage - 1);
    }
  };

  const scrollRef = React.useRef(null); 

  const scrollCategories = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 200;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (book) => {
    if (!user) {
      toast.warning("Please log in to continue.", {
        icon: ({ theme, type }) => <span className="text-xl"><Key className="text-xl" /></span>
      });
      navigate('/login');
      return;
    }
    
    addToCart(book); 
    toast.success(`"${book.title}" has been added to your cart!`, {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-12">
        
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 className="text-3xl font-bold text-[#2d5a5a] flex items-center gap-2">
              <BookOpen className="w-8 h-8" /> Explore Our Library
            </h2>
            
            {!loading && filteredBooks.length > 0 && (
              <div className="flex items-center gap-4 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                <span className="pl-4 text-sm font-medium text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => paginate('prev')}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 hover:bg-green-50 hover:text-green-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => paginate('next')}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-100 hover:bg-green-50 hover:text-green-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all shadow-sm bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100/60 p-1 rounded-2xl border border-gray-200/50 w-full md:w-auto">
              <button 
                onClick={() => scrollCategories('left')}
                type="button"
                className="p-2 rounded-xl bg-white hover:bg-green-50 text-gray-500 hover:text-green-600 shadow-sm border border-gray-100 transition-all active:scale-95 shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div 
                ref={scrollRef} 
                className="flex gap-2 overflow-x-auto py-1 max-w-[260px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[620px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {categories.map((cat) => {
                  const isAll = cat === 'All';
                  const catValue = isAll ? 'All' : (cat._id || cat.name || cat);
                  const catDisplayName = isAll ? 'All' : (cat.name || cat);

                  return (
                    <button
                      key={isAll ? 'all-tab' : cat._id || catValue}
                      onClick={() => setSelectedCategory(catValue)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                        selectedCategory === catValue 
                        ? 'bg-[#2d5a5a] text-white shadow-lg shadow-gray-200' 
                        : 'bg-white text-gray-600 border border-gray-100 hover:border-green-400'
                      }`}
                    >
                      {catDisplayName}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => scrollCategories('right')}
                type="button"
                className="p-2 rounded-xl bg-white hover:bg-green-50 text-gray-500 hover:text-green-600 shadow-sm border border-gray-100 transition-all active:scale-95 shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading books...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentBooks.map((book) => (
              <Link 
                key={book._id} 
                to={`/books/${book._id}`} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-4 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl h-64 mb-4 bg-gray-50">
                  <img
                    src={book.coverImage || 'https://placehold.co/300x400?text=No+Image'}
                    alt={book.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=Error+Loading'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-green-700 uppercase tracking-wider shadow-sm border border-green-100 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {book.category?.name || book.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-gray-800 line-clamp-1" title={book.title}>{book.title}</h4>
                  <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                  <span className="text-xl font-bold text-[#2d5a5a]">
                    ${book.price}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleAddToCart(book); 
                    }}
                    className='p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all active:scale-90 relative z-10'
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🔎</div>
            <h3 className="text-xl font-bold text-gray-800">No results found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;