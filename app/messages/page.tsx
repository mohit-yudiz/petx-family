/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Send, Image as ImageIcon, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase, Message, Profile } from '@/lib/supabase';

type MessageWithUser = Message & {
  sender?: Profile;
};

type Conversation = {
  booking_id: string;
  other_user?: Profile;
  last_message?: Message;
  unread_count?: number;
};

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}

function MessagesContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingIdParam = searchParams.get('booking');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookingIdParam);
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!profile?.id) return;

    try {
      // Fetch all messages where user is sender or receiver
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*), receiver:receiver_id(*)')
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by booking_id
      const conversationMap = new Map<string, Conversation>();
      
      messagesData?.forEach((msg: any) => {
        if (!conversationMap.has(msg.booking_id)) {
          const otherUser = msg.sender_id === profile.id ? msg.receiver : msg.sender;
          conversationMap.set(msg.booking_id, {
            booking_id: msg.booking_id,
            other_user: otherUser,
            last_message: msg,
            unread_count: 0,
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  const fetchMessages = useCallback(async () => {
    if (!selectedBookingId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*)')
        .eq('booking_id', selectedBookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as any || []);

      // Mark all unread messages in this conversation as read
      if (data && data.length > 0 && profile?.id) {
        const unreadMessageIds = data
          .filter((msg: any) => msg.receiver_id === profile.id && msg.read_at === null)
          .map((msg: any) => msg.id);

        if (unreadMessageIds.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessageIds);
        }
      }
    } catch (error) {
      toast.error('Failed to load messages');
    }
  }, [selectedBookingId, profile?.id]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (bookingIdParam) {
      setSelectedBookingId(bookingIdParam);
    }
  }, [bookingIdParam]);

  useEffect(() => {
    if (selectedBookingId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedBookingId, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedBookingId) return;

    try {
      const { data: booking } = await supabase
        .from('bookings')
        .select('owner_id, host_id')
        .eq('id', selectedBookingId)
        .single();

      if (!booking) return;

      const receiverId = booking.owner_id === profile?.id ? booking.host_id : booking.owner_id;

      const { error } = await supabase.from('messages').insert({
        booking_id: selectedBookingId,
        sender_id: profile!.id,
        receiver_id: receiverId,
        message_text: newMessage,
      });

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
      fetchConversations();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const selectConversation = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    router.push(`/messages?booking=${bookingId}`, { scroll: false });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const userName = `${conv.other_user?.first_name || ''} ${conv.other_user?.last_name || ''}`.toLowerCase();
    return userName.includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-0 bg-white rounded-lg overflow-hidden shadow-sm border">
        {/* Sidebar - Conversations List */}
        <div className={`w-full md:w-96 border-r flex flex-col bg-gray-50 ${
          selectedBookingId ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-center">No conversations yet</p>
                <p className="text-sm text-gray-400 text-center mt-1">
                  Start a conversation from your bookings
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.booking_id}
                  onClick={() => selectConversation(conv.booking_id)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 border-b transition-colors ${
                    selectedBookingId === conv.booking_id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conv.other_user?.profile_photo || ''} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {conv.other_user?.first_name?.[0]}{conv.other_user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.other_user?.first_name} {conv.other_user?.last_name}
                        </h3>
                        {conv.last_message && (
                          <span className="text-xs text-gray-500">
                            {new Date(conv.last_message.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                      {conv.last_message && (
                        <p className="text-sm text-gray-600 truncate">
                          {conv.last_message.message_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${
          selectedBookingId ? 'flex' : 'hidden md:flex'
        }`}>
          {!selectedBookingId ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center px-4">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h2>
                <p className="text-gray-600">Choose a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                {(() => {
                  const currentConv = conversations.find((c) => c.booking_id === selectedBookingId);
                  return currentConv ? (
                    <div className="flex items-center space-x-3">
                      {/* Back button for mobile */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedBookingId(null)}
                        className="md:hidden flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div
                        onClick={() => router.push(`/profile/${currentConv.other_user?.id}`)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={currentConv.other_user?.profile_photo || ''} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {currentConv.other_user?.first_name?.[0]}{currentConv.other_user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {currentConv.other_user?.first_name} {currentConv.other_user?.last_name}
                          </h3>
                          <p className="text-xs text-gray-500">Active now</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
                {messages.map((message) => {
                  const isOwn = message.sender_id === profile?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[85%] md:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwn && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={message.sender?.profile_photo || ''} />
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                              {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`rounded-2xl px-4 py-2 break-words ${
                              isOwn
                                ? 'bg-orange-500 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                            }`}
                          >
                            {message.is_system_message && (
                              <p className="text-xs mb-1 opacity-75">System Message</p>
                            )}
                            <p className="leading-relaxed">{message.message_text}</p>
                            {message.image_url && (
                              <img
                                src={message.image_url}
                                alt="Shared"
                                className="mt-2 rounded-lg max-w-full"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-2">
                            {new Date(message.created_at).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-3 md:p-4 bg-white">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0"
                  />
                  <Button 
                    onClick={sendMessage} 
                    className="bg-orange-500 hover:bg-orange-600 flex-shrink-0"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
