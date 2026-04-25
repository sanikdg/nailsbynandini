import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import api from '../../services/api';

// Helper to normalize conversationId (could be object from populate or string)
const getConversationId = (booking) => {
  const cid = booking?.conversationId;
  if (!cid) return null;
  if (typeof cid === 'object') return cid._id || cid.toString();
  return cid;
};

export const ChatModal = ({ booking, onClose, isCustomer = false }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const conversationId = getConversationId(booking);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Initial fetch
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [conversationId, fetchMessages]);

  // Socket: join room and listen for messages
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    socket.emit('join chat', conversationId);

    const handleMessage = (newMsg) => {
      // Avoid duplicates by checking _id
      setMessages(prev => {
        if (prev.some(m => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };

    socket.on('message received', handleMessage);

    return () => {
      socket.off('message received', handleMessage);
    };
  }, [socket, isConnected, conversationId]);

  // Polling fallback: fetch messages every 3 seconds when socket is disconnected
  useEffect(() => {
    if (!conversationId) return;
    if (isConnected) return;

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId, isConnected, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        conversationId,
        text: newMessage,
        messageType: 'text',
      });

      // Emit message through socket for real-time delivery
      if (socket && isConnected) {
        socket.emit('new message', {
          ...data,
          conversationId,
        });
      }

      // Add to local messages (avoid duplicates)
      setMessages(prev => {
        if (prev.some(m => m._id === data._id)) return prev;
        return [...prev, data];
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <div>
            <h2 className="font-bold text-lg">
              {isCustomer ? 'Chat with Admin' : booking.customerName}
            </h2>
            <p className="text-sm text-pink-100">{booking.designName || 'Custom Design'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-pink-200">{isConnected ? 'Live' : 'Polling'}</span>
            <button
              onClick={onClose}
              className="text-white hover:bg-pink-700 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {!conversationId && (
            <div className="text-center py-8 text-amber-600 font-semibold bg-amber-50 rounded-lg p-4">
              ⚠️ Chat not available yet<br/>
              <span className="text-sm font-normal">Status: {booking.status}</span><br/>
              {booking.status === 'Pending' && <span className="text-xs text-amber-600">Waiting for admin to accept your booking</span>}
              {booking.status === 'Rejected' && <span className="text-xs text-red-600">Your booking was rejected</span>}
            </div>
          )}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
              const isOwnMessage = senderId === user._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-pink-500 text-white rounded-br-sm'
                        : 'bg-gray-300 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {typeof msg.senderId === 'object' ? msg.senderId.name : 'Admin'}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {conversationId && (
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-white rounded-b-lg flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

