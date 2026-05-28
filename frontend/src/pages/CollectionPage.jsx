import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { useCart } from '../context/CartContext'; 
import { Link } from 'react-router-dom';

const CollectionPage = () => {
  const { collectionItems, toggleCollection } = useCollection();
  const { addToCart } = useCart(); 

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-black text-slate-900 mb-2">My Saved Collection</h2>
      <p className="text-slate-500 mb-10">Your favorite books curated in one place.</p>

      {collectionItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-lg font-medium mb-6">There are no saved books in the cart yet.</p>
          <Link to="/explore" className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all">
            Explore Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {collectionItems.map((book) => (
            <div key={book._id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all relative group">
              
              <button 
                onClick={() => toggleCollection(book)}
                className="absolute top-4 right-4 z-10 bg-red-50 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-full transition-all"
                title="Remove from Collection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 4.293z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="overflow-hidden rounded-2xl h-72 bg-slate-100">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>

              <h4 className="text-lg font-extrabold mt-4 text-slate-900 truncate">{book.title}</h4>
              <p className="text-slate-400 text-sm mb-4">{book.author}</p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">${book.price}</span>
                
                <button 
                  onClick={() => addToCart(book)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;