import React from 'react';
import { Search, Plus, Edit, Trash2, X, Save } from 'lucide-react';

const AdminBooks = ({

  searchTerm,
  setSearchTerm,
  filteredBooks,
  categories,
  showModal,
  setShowModal,
  editingBook,
  formData,
  
  resetForm,
  openEditModal,
  confirmDelete,
  handleSubmit,
  handleInputChange
}) => {
  return (
    <>
  
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search books or authors..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2d5a5a] bg-gray-50/20"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
     
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#2d5a5a] hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3">Book Info</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-800">{book.title}</td>
                  <td className="px-4 py-3 text-gray-500">{book.author}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-medium">
                      {book.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-gray-900">${Number(book.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {/* Edit Button */}
                    <button 
                      onClick={() => openEditModal(book)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Book"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* Delete Button */}
                    <button 
                      onClick={() => confirmDelete(book)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                    No books found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

  
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-gray-800 text-base">
                {editingBook ? 'Edit System Book' : 'Add New Book Entry'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 text-xs">
         
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Book Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="Enter title" 
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                />
              </div>

             
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Author Name *</label>
                <input 
                  type="text" 
                  name="author" 
                  required 
                  placeholder="Enter author" 
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none" 
                  value={formData.author} 
                  onChange={handleInputChange} 
                />
              </div>

    
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Price ($) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    step="0.01" 
                    placeholder="0.00" 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Category *</label>
                  <select 
                    name="category" 
                    required 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none font-medium bg-white" 
                    value={formData.category} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

          
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Cover Image Link *</label>
                <input 
                  type="text" 
                  name="image" 
                  required 
                  placeholder="https://example.com/image.jpg" 
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                />
              </div>

          
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Book Description</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  placeholder="Write plot overview..." 
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none resize-none" 
                  value={formData.description} 
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

         
            <button 
              type="submit" 
              className="w-full mt-6 py-3 bg-[#2d5a5a] hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Book Entry
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminBooks;