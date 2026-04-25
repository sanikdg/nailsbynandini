import React, { useEffect, useState, useRef } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';

export const ChatUI = ({ conversationId }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Fetch initial messages and mark as read
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/messages/${conversationId}`);
        setMessages(data);
        // Mark as read
        await api.put(`/messages/${conversationId}/read`);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // Handle Socket Events
  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join room
    socket.emit('join chat', conversationId);

    const handleMessageReceived = async (newMessageReceived) => {
      if (newMessageReceived.conversationId !== conversationId) {
        // Notification for other conversation - ignored in this component
        return;
      }
      setMessages((prev) => [...prev, newMessageReceived]);
      // Mark as read immediately when active in window
      await api.put(`/messages/${conversationId}/read`);
    };

    socket.on('message received', handleMessageReceived);

    return () => {
      socket.off('message received', handleMessageReceived);
    };
  }, [socket, conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageUrl.trim()) return;

    const messageType = imageUrl.trim() ? 'image' : 'text';
    const textToSend = newMessage.trim();
    const imageToSend = imageUrl.trim();

    // Optimistically update UI
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      senderId: { _id: user._id, name: user.name },
      text: textToSend,
      imageUrl: imageToSend,
      messageType,
      conversationId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
    setImageUrl('');
    setShowImageInput(false);

    try {
      const { data } = await api.post('/messages', {
        conversationId,
        text: textToSend,
        imageUrl: imageToSend,
        messageType,
      });

      // Emit new message
      socket.emit('new message', data);

      // Replace optimistic message with actual data from DB (includes generated ID)
      setMessages((prev) => prev.map((msg) => (msg._id === tempId ? data : msg)));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
      {/* Connection Status indicator */}
      {!isConnected && (
         <div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-1 text-center font-medium">Reconnecting to chat server...</div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?._id === user._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 ${isMe ? 'bg-primary-dark text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {!isMe && <div className="text-xs font-bold mb-1 opacity-60">{msg.senderId?.name}</div>}
                  
                  {msg.messageType === 'image' && msg.imageUrl && (
                    <img 
                      src={msg.imageUrl} 
                      alt="Shared" 
                      className="max-w-full rounded-lg mb-2 border border-white/20" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image+URL'; }}
                    />
                  )}
                  
                  {msg.text && <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                  
                  <div className={`text-[10px] mt-2 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-gray-50/50">
        {showImageInput && (
          <div className="mb-3 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Paste image URL here..." 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button type="button" onClick={() => setShowImageInput(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium px-2">Cancel</button>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <button 
            type="button" 
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-3 rounded-xl transition-colors shrink-0 ${showImageInput ? 'bg-primary/20 text-primary-dark' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full max-h-32 px-4 py-3 outline-none resize-none text-sm bg-transparent"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!newMessage.trim() && !imageUrl.trim()}
            className="p-3 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
