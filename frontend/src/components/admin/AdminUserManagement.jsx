import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RefreshCw, Loader2, Trash2 } from 'lucide-react';

const AdminUserManagement = ({ users, usersLoading, fetchUsers }) => {
  
  
  const handleDeleteUser = (userId, userName) => {
    const toastId = toast.info(
      <div className="flex flex-col gap-3 p-1">
        <p className="text-xs text-slate-800 font-medium">
          Are you sure you want to delete user 
          <span className="font-bold text-red-600"> "{userName}"</span>?
          <br />
          <span className="text-[10px] text-gray-400 block mt-1">(This action cannot be undone)</span>
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                toast.success(`User "${userName}" deleted successfully`);
                fetchUsers(); 
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete user");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white text-[10px] rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-md font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm overflow-hidden">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-800">User Management</h3>
          <p className="text-xs text-gray-400 mt-1">Manage registered users and roles</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-bold">
            {users.length} Users
          </span>
          <button
            onClick={fetchUsers}
            className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-gray-500"
          >
            <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {usersLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#2d5a5a]" />
        </div>
      ) : (
        <>
          
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-center">Action</th> 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {u._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 break-all">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] rounded-md font-bold uppercase ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">No registered users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

    
          <div className="lg:hidden space-y-4">
            {users.map((u) => (
              <div key={u._id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/30 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{u.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {u._id?.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 text-[10px] rounded-md font-bold uppercase ${
                      u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Email Address</p>
                  <p className="text-xs text-gray-600 break-all font-medium">{u.email}</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Joined Date</p>
                  <p className="text-xs font-semibold text-gray-700">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400 font-medium text-sm">No registered users found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserManagement;