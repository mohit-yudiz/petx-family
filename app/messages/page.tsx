'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Send, Image as ImageIcon } from 'lucide-react';
import { supabase, Message, Profile } from '@/lib/supabase';

type MessageWithUser = Message & {
  sender?: Profile;
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
  const bookingId = searchParams.get('booking');
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  const fetchMessages = async () => {
    if (!bookingId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*)')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as any || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !bookingId) return;

    try {
      const { data: booking } = await supabase
        .from('bookings')
        .select('owner_id, host_id')
        .eq('id', bookingId)
        .single();

      if (!booking) return;

      const receiverId = booking.owner_id === profile?.id ? booking.host_id : booking.owner_id;

      const { error } = await supabase.from('messages').insert({
        booking_id: bookingId,
        sender_id: profile!.id,
        receiver_id: receiverId,
        message_text: newMessage,
      });

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!bookingId) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a booking to chat</h2>
          <p className="text-gray-600">Choose a booking from your bookings page to start messaging</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="h-[calc(100vh-12rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === profile?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender?.profile_photo || ''} />
                    <AvatarFallback>
                      {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwn
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.is_system_message && (
                        <p className="text-xs mb-1 opacity-75">System Message</p>
                      )}
                      <p>{message.message_text}</p>
                      {message.image_url && (
                        <img
                          src={message.image_url}
                          alt="Shared"
                          className="mt-2 rounded max-w-full"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t p-4">
          <div className="flex space-x-2">
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
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Button onClick={sendMessage} className="bg-orange-500 hover:bg-orange-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
