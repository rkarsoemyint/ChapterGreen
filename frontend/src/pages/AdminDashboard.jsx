import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminBooks from '../components/admin/AdminBooks';
import AdminCategories from '../components/admin/AdminCategories';
import AdminOrderFinance from '../components/admin/AdminOrderFinance';
import AdminUserManagement from '../components/admin/AdminUserManagement'; 
import AdminMessages from '../components/admin/AdminMessages'; 

const AdminDashboard = () => {

  const [activeTab, setActiveTab] = useState('orders'); 
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]); 
  const [messages, setMessages] = useState([]); 
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false); 
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', price: '', category: '', image: '', description: ''
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');


  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchOrders();
    fetchUsers();
    fetchMessages(); 
  }, []);


  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      const res = await axios.get('http://localhost:5000/api/books'); 
      if (res.data && res.data.success) {
        setBooks(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories'); 
      if (res.data && res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token'); 
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let fetchedOrders = [];
      if (res.data) {
        fetchedOrders = Array.isArray(res.data) ? res.data : (res.data.data || res.data.orders || []);
      }
      
      setOrders(fetchedOrders);

      if (fetchedOrders.length > 0) {
        const revenue = fetchedOrders.reduce((sum, order) => {
          return order.status !== 'Cancelled' ? sum + (Number(order.totalPrice) || 0) : sum;
        }, 0);
        setTotalRevenue(revenue);
      } else {
        setTotalRevenue(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await axios.get('http://localhost:5000/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && res.data.success) {
        setMessages(res.data.data || []); 
      }
    } catch (error) {
      console.error("Error fetching admin messages:", error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(books) && books.length > 0) {
      const filtered = books.filter(book => 
        book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book?.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [searchTerm, books]);


  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <span className="text-amber-500 font-bold">🔄</span>;
      case 'Shipped': return <span className="text-blue-500 font-bold">🚚</span>;
      case 'Delivered': return <span className="text-emerald-500 font-bold">✓</span>;
      case 'Cancelled': return <span className="text-rose-500 font-bold">✕</span>;
      default: return null;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Shipped': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Delivered': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Cancelled': return 'bg-rose-50 border-rose-200 text-rose-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };
  
  const confirmStatusChange = async (orderId, newStatus, oldStatus) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); 
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', price: '', category: '', image: '', description: '' });
    setEditingBook(null);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category?._id || book.category,
      image: book.image || book.coverImage || '',
      description: book.description || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const apiUrl = 'http://localhost:5000/api/books'; 

      if (editingBook) {
        await axios.put(`${apiUrl}/${editingBook._id}`, formData, config);
        toast.success("Book updated successfully!");
      } else {
        await axios.post(apiUrl, formData, config);
        toast.success("New book added successfully!");
      }
      resetForm();
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error(error.response?.data?.message || "Error occurred while saving book");
    }
  };

  const confirmDelete = (book) => {
    const BookConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-xs font-semibold text-gray-800 mb-2.5 leading-relaxed">
          Are you sure you want to delete <span className="text-rose-600 font-bold">"{book.title}"</span> from inventory?
        </p>
        <div className="flex justify-end gap-2 text-[11px]">
          <button
            onClick={closeToast}
            className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
          >
            No
          </button>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/books/${book._id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                toast.success("Book deleted successfully!", { 
                  position: "top-right",
                  toastId: "book-delete-success"
                });
                fetchBooks(); 
              } catch (error) {
                console.error("Error deleting book:", error);
                toast.error("Failed to delete book", {
                  toastId: "book-delete-error"
                });
              }
            }}
            className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all shadow-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );

    toast(<BookConfirmToast />, {
      position: "top-center",
      autoClose: false,      
      closeOnClick: false,
      draggable: false,
      closeButton: false,    
      className: "border border-gray-100 shadow-xl rounded-2xl p-4 bg-white",
      toastId: "book-confirm-popup" 
    });
  };


  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const config = { 
        headers: { Authorization: `Bearer ${token}` } 
      };

      const apiUrl = 'http://localhost:5000/api/categories'; 

      if (editingCategory) {
        await axios.put(`${apiUrl}/${editingCategory._id}`, { name: newCategoryName }, config);
        toast.success("Category updated successfully");
      } else {
        await axios.post(apiUrl, { name: newCategoryName }, config);
        toast.success("New category created successfully!");
      }
      
      setNewCategoryName('');
      setShowCategoryModal(false);
      setEditingCategory(null);
      fetchCategories(); 
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const confirmCategoryDelete = async (category) => {
    if (window.confirm(`Delete category "${category.name}"?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/categories/${category._id}`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Category removed");
        fetchCategories(); 
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  
  const confirmDeleteUser = (e, user) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    const UserConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-xs font-semibold text-gray-800 mb-2.5 leading-relaxed">
          Are you sure you want to delete user <span className="text-rose-600 font-bold">"{user.name}"</span>?
        </p>
        <div className="flex justify-end gap-2 text-[11px]">
          <button
            onClick={closeToast}
            className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
          >
            No
          </button>
          <button
            onClick={async () => {
              toast.dismiss(); 
              try {
                const token = localStorage.getItem('token');
                const res = await axios.delete(`http://localhost:5000/api/admin/users/${user._id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.status === 200 || res.status === 204 || res.data?.success) {
                  
                  setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
                  
                  toast.success(`User "${user.name}" deleted successfully!`, { 
                    position: "top-right",
                    toastId: `user-delete-success-${user._id}`
                  });
                } else {
                  toast.error("Failed to delete user", { toastId: `user-delete-fail-${user._id}` });
                }
              } catch (error) {
                console.error("Error deleting user:", error);
                toast.error(error.response?.data?.message || "Failed to delete user", {
                  toastId: `user-delete-err-${user._id}`
                });
              }
            }}
            className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all shadow-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );
    
    toast(<UserConfirmToast />, {
      position: "top-center",
      autoClose: false,      
      closeOnClick: false,
      draggable: false,
      closeButton: false,    
      className: "border border-gray-100 shadow-xl rounded-2xl p-4 bg-white",
      toastId: `user-confirm-popup-${user._id}` 
    });
  };


  const confirmDeleteMessage = (msg) => {
    const MsgConfirmToast = ({ closeToast }) => (
      <div className="p-1">
        <p className="text-xs font-semibold text-gray-800 mb-2.5 leading-relaxed">
          Are you sure you want to delete message from <span className="text-rose-600 font-bold">"{msg.name}"</span>?
        </p>
        <div className="flex justify-end gap-2 text-[11px]">
          <button
            onClick={closeToast}
            className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
          >
            No
          </button>
          <button
            onClick={async () => {
              toast.dismiss(); 
              try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/messages/${msg._id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                toast.success("Message deleted successfully!", { 
                  position: "top-right",
                  toastId: "msg-delete-success"
                });
                fetchMessages(); 
              } catch (error) {
                console.error("Error deleting message:", error);
                toast.error("Failed to delete message", {
                  toastId: "msg-delete-error"
                });
              }
            }}
            className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all shadow-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );

    toast(<MsgConfirmToast />, {
      position: "top-center",
      autoClose: false,      
      closeOnClick: false,
      draggable: false,
      closeButton: false,   
      className: "border border-gray-100 shadow-xl rounded-2xl p-4 bg-white",
      toastId: "msg-confirm-popup" 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your books, categories, and track business revenue</p>
          </div>
    
          <div className="bg-gray-100/80 backdrop-blur-xs p-1.5 rounded-2xl flex flex-wrap gap-1 items-center self-start shadow-inner">
            
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'books' 
                  ? 'bg-[#2d5a5a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Books Inventory
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'categories' 
                  ? 'bg-[#2d5a5a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Categories
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders' 
                  ? 'bg-[#2d5a5a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Orders & Finance 
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'messages' 
                  ? 'bg-[#2d5a5a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Messages 
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                activeTab === 'messages' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'users' 
                  ? 'bg-[#2d5a5a] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Users 
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {users.length}
              </span>
            </button>

          </div>
        </div>

        <main className="mt-2">
          
          {activeTab === 'books' && (
            <AdminBooks
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredBooks={filteredBooks}
              categories={categories}
              showModal={showModal}
              setShowModal={setShowModal}
              editingBook={editingBook}
              formData={formData}
              resetForm={resetForm}
              openEditModal={openEditModal}
              confirmDelete={confirmDelete}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
              showCategoryModal={showCategoryModal}
              setShowCategoryModal={setShowCategoryModal}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              handleAddCategory={handleAddCategory}
              confirmCategoryDelete={confirmCategoryDelete}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrderFinance
              totalRevenue={totalRevenue}
              orders={orders}
              ordersLoading={ordersLoading}
              fetchOrders={fetchOrders}
              confirmStatusChange={confirmStatusChange}
              getStatusIcon={getStatusIcon}
              getStatusStyle={getStatusStyle}
            />
          )}

          {activeTab === 'users' && (
            <AdminUserManagement 
              users={users} 
              setUsers={setUsers} 
              confirmDeleteUser={confirmDeleteUser} 
            />
          )}

          {activeTab === 'messages' && (
            <AdminMessages 
              messages={messages} 
              messagesLoading={messagesLoading}
              confirmDeleteMessage={confirmDeleteMessage}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;