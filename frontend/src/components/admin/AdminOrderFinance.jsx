import React from 'react';
import { DollarSign, ShoppingCart, RefreshCw } from 'lucide-react';

const AdminOrderFinance = ({
 
  totalRevenue,
  orders,
  ordersLoading,
  fetchOrders,
  confirmStatusChange,
  getStatusIcon,  
  getStatusStyle  
}) => {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
     
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total Store Revenue
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total Volume
            </p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">
              {orders.length} Orders
            </p>
          </div>
        </div>
      </div>

    
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm">
            Incoming Store Orders Log
          </h3>

          <button
            onClick={fetchOrders}
            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-gray-500"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

       
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Bill</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Paid Status</th>
                <th className="px-6 py-3.5">Status Control</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-xs text-gray-600">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-gray-700">
                    #{order._id?.slice(-8).toUpperCase()}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.shippingAddress?.name || "Guest User"}
                  </td>

                  <td className="px-6 py-4 font-black text-gray-900">
                    ${(order.totalPrice || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {order.paymentMethod}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        order.isPaid
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {order.isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Icon Component/Element */}
                      {getStatusIcon && <span>{getStatusIcon(order.status)}</span>}

                      <select
                        value={order.status}
                        onChange={(e) =>
                          confirmStatusChange(
                            order._id,
                            e.target.value,
                            order.status
                          )
                        }
                        className={`px-2 py-1 border rounded-xl font-bold text-[11px] ${
                          getStatusStyle ? getStatusStyle(order.status) : ""
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !ordersLoading && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-gray-400 font-medium"
                  >
                    No system order records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       
        <div className="md:hidden space-y-4 p-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm space-y-3"
            >
             
              <div className="flex justify-between items-center">
                <p className="font-mono text-xs font-bold text-gray-700">
                  #{order._id?.slice(-8).toUpperCase()}
                </p>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    order.isPaid
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {order.isPaid ? "PAID" : "UNPAID"}
                </span>
              </div>

            
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Customer</p>
                <p className="font-semibold text-gray-800">
                  {order.shippingAddress?.name || "Guest User"}
                </p>
              </div>

              
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Total</p>
                  <p className="font-black text-gray-900">
                    ${(order.totalPrice || 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Payment</p>
                  <p className="text-gray-600 font-medium">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

             
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {getStatusIcon && <span>{getStatusIcon(order.status)}</span>}

                  <select
                    value={order.status}
                    onChange={(e) =>
                      confirmStatusChange(
                        order._id,
                        e.target.value,
                        order.status
                      )
                    }
                    className={`px-2 py-1 border rounded-xl font-bold text-[11px] ${
                      getStatusStyle ? getStatusStyle(order.status) : ""
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && !ordersLoading && (
            <div className="text-center py-10 text-gray-400 font-medium">
              No system order records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderFinance;