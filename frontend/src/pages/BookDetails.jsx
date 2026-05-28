import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Tag, ShieldCheck, Loader2, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCollection } from '../context/CollectionContext';
import { toast } from 'react-toastify'; 

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const [submitting, setSubmitting] = useState(false); 
  const { addToCart } = useCart();
  const { toggleCollection, isInCollection } = useCollection();
  const isFavorite = book ? isInCollection(book._id) : false;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/books/${id}`); 
        const result = await response.json();
        
        if (result.success && result.data) {
          setBook(result.data);
          const currentRating = result.data.rating !== undefined ? Math.round(result.data.rating) : 0;
          setUserRating(currentRating);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleToggleFavorite = () => {

  if (!localStorage.getItem('token')) {
    toast.error("Please login first to add books to your collection.");
    navigate('/login');
    return;
  }

  if (book) {
    toggleCollection(book);
  }
};

const handleAddToCart = () => {

  if (!localStorage.getItem('token')) {
    toast.error("Please login first to add books to cart.");
    navigate('/login');
    return;
  }

  addToCart(book);
  toast.success(`Added "${book.title}" to cart!`);
};

  const handleRatingSubmit = async () => {

  const token = localStorage.getItem('token');

  if (!token) {
    toast.error("Please login first to rate this book.");
    navigate('/login'); 
    return;
  }

  if (userRating === 0) {
    toast.warning("Please select a star rating before submitting.", {
      icon: ({ theme, type }) => <span className="text-xl">⭐</span>
    });
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(`http://localhost:5000/api/books/${id}/rate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating: userRating }),
    });

    const result = await response.json();

    if (result.success) {
      toast.success("Thank you! Your rating has been submitted successfully.");
      setBook(result.data);
    } else {
      toast.error(result.message || "Failed to submit rating.");
    }

  } catch (error) {
    console.error("Error submitting rating:", error);
    toast.error("Server error: Unable to connect to the server.");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <Loader2 className="w-12 h-12 text-[#2d5a5a] animate-spin" />
        <p className="text-gray-500 font-medium">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 py-24">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-2xl font-bold text-gray-800">Book Not Found</h3>
        <p className="text-gray-500 mt-2 mb-6">The book you are looking for might have been removed.</p>
        <button onClick={() => navigate('/explore')} className="flex items-center gap-2 px-5 py-2.5 bg-[#2d5a5a] text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        
       
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#2d5a5a] font-medium text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

       
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-10">
          
         
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-50 border border-gray-100 relative group/cover">
              
              <img 
                src={book.coverImage || 'https://placehold.co/300x400?text=No+Image'} 
                alt={book.title} 
                onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=Error+Loading'; }}
                className="w-full h-full object-cover"
              />

              
              <button
  type="button"
  onClick={handleToggleFavorite}
  disabled={!localStorage.getItem('token')}
  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all active:scale-90 focus:outline-none z-10 group disabled:opacity-50"
>
                <Heart
                  className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 ${
                    isFavorite 
                      ? 'fill-red-500 stroke-red-500' 
                      : 'text-gray-400 hover:text-red-500' 
                  }`}
                />
              </button>

            </div>
          </div>

         
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              
              <div className="mb-4">
                <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {book.category?.name || book.category || 'Uncategorized'}
                </span>
              </div>

              
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">{book.title}</h2>
              <p className="text-gray-500 font-medium text-base mb-6">By <span className="text-gray-700">{book.author}</span></p>

              
              <div className="flex flex-wrap items-center gap-6 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                  <span className="text-3xl font-black text-[#2d5a5a]">${book.price}</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4" /> Available In Stock
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Rating</span>
                  <span className="text-sm font-bold text-yellow-600 flex items-center gap-1 mt-1">
                    ⭐ {book.rating ? `${book.rating.toFixed(1)} / 5.0` : "0.0 (No rates)"}
                  </span>
                </div>
              </div>

             
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Synopsis / Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {book.description || "No description provided for this book yet."}
                </p>
              </div>
            </div>

            
            <div className="border-t border-gray-100 pt-5 mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rate this book</h4>
              <div className="flex flex-wrap items-center gap-4 bg-slate-50/60 p-3 rounded-2xl border border-dashed border-gray-200 w-fit">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform active:scale-90 focus:outline-none"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors duration-150 ${
                          star <= (hoverRating || userRating)
                            ? 'fill-yellow-400 stroke-yellow-500'
                            : 'text-gray-300 fill-gray-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRatingSubmit}
                  disabled={submitting || !localStorage.getItem('token')}
                  className="px-4 py-2 bg-[#2d5a5a] text-white font-bold rounded-xl text-xs hover:bg-green-700 transition-all disabled:opacity-50 shadow-sm"
                >
                  {
                    !localStorage.getItem('token')
                    ? "Login to Rate"
                    : submitting 
                    ? 'Sending...' 
                    : 'Submit Rating'}
                </button>
              </div>
            </div>

            
            <div className="border-t border-gray-50 pt-4 flex flex-col sm:flex-row gap-4">
              <button
  onClick={handleAddToCart}
  className='flex-1 px-6 py-4 bg-[#2d5a5a] hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-3 shadow-lg shadow-gray-100'
>
  <ShoppingCart className="w-5 h-5" /> Add to Cart
</button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetails;