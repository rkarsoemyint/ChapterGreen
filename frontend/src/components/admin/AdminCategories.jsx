import React from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const AdminCategories = ({

  categories,
  showCategoryModal,
  setShowCategoryModal,
  editingCategory,
  setEditingCategory,
  newCategoryName,
  setNewCategoryName,

  handleAddCategory,
  confirmCategoryDelete
}) => {
  return (
    <>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h3 className="font-black text-gray-800 text-base tracking-tight">
              System Categories List
            </h3>
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">
              Total {categories.length}
            </span>
          </div>
          
      
          <button 
            onClick={() => { 
              setEditingCategory(null); 
              setNewCategoryName(''); 
              setShowCategoryModal(true); 
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#2d5a5a] hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </button>
        </div>
        
      
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5">Category Name</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-600">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 text-sm">{cat.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase">
                      Active Live
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                
                    <button 
                      onClick={() => { 
                        setEditingCategory(cat); 
                        setNewCategoryName(cat.name); 
                        setShowCategoryModal(true); 
                      }} 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => confirmCategoryDelete(cat)} 
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400 font-medium">
                    No system categories found. Create one to begin!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleAddCategory} 
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-gray-800 text-base">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowCategoryModal(false)} 
                className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-xs">
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Category Name *</label>
              <input 
                type="text" 
                placeholder="e.g., Fiction, Tech" 
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#2d5a5a] focus:outline-none" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-5 py-2.5 bg-[#2d5a5a] hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Category
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminCategories;