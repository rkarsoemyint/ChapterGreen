import React, { useState } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';

const AdminMessages = ({ messages = [], messagesLoading = false, confirmDeleteMessage }) => {
  
  if (messagesLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d5a5a]"></div>
        <span className="ml-3 text-xs text-gray-500 font-medium">Loading messages...</span>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs text-gray-400 font-medium text-xs flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 text-lg">📩</div>
        <span>No incoming customer messages found in the log.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
  
      <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2d5a5a]" /> Customer Messages Log ({messages.length})
        </h2>
      </div>

  
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
            
         
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
               
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {msg.name || "Anonymous Guest"}
                </div>
               
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${msg.email}`} className="hover:text-[#2d5a5a] hover:underline transition-all">
                    {msg.email}
                  </a>
                </div>
               
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-gray-300" />
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                  }) : 'Unknown Date'}
                </div>
              </div>

            
              {msg.subject && (
                <div className="text-xs font-bold text-gray-700 bg-gray-50 inline-block px-2.5 py-1 rounded-md">
                  Subject: {msg.subject}
                </div>
              )}

         
              <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-gray-100/50 mt-1 whitespace-pre-wrap">
                {msg.message || msg.content}
              </p>
            </div>

          
            <div className="flex items-center md:self-start pt-1">
              <button
                onClick={() => confirmDeleteMessage(msg)}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;