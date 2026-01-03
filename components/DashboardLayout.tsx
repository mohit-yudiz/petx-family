'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  PawPrint,
  Home,
  Search,
  Calendar,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { database } from '@/lib/database';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Find Hosts', href: '/hosts', icon: Search },
    { name: 'My Pets', href: '/pets', icon: PawPrint },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Services', href: '/services', icon: ShoppingBag },
  ];

  if (profile?.is_host) {
    navigation.splice(2, 0, { name: 'Availability', href: '/availability', icon: Calendar });
  }

  // Poll for unread notifications
  useEffect(() => {
    if (!profile?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await database
          .from('notifications')
          .select('id')
          .eq('user_id', profile.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread notifications:', error);
          return;
        }

        setUnreadCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    // Fetch immediately
    fetchUnreadCount();

    // Poll every 15 seconds
    pollingIntervalRef.current = setInterval(fetchUnreadCount, 15000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [profile?.id]);

  // Also fetch when navigating to notifications page
  useEffect(() => {
    if (pathname === '/notifications' && profile?.id) {
      const fetchUnreadCount = async () => {
        try {
          const { data, error } = await database
            .from('notifications')
            .select('id')
            .eq('user_id', profile.id)
            .eq('is_read', false);

          if (!error) {
            setUnreadCount(data?.length || 0);
          }
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      };
      fetchUnreadCount();
    }
  }, [pathname, profile?.id]);

  // Poll for unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!profile?.id) {
        setUnreadMessagesCount(0);
        return;
      }

      try {
        // Get all unread messages where the current user is the receiver
        const { data, error } = await database
          .from('messages')
          .select('id')
          .neq('sender_id', profile.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread messages:', error);
          return;
        }

        setUnreadMessagesCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    // Poll every 15 seconds
    const messageInterval = setInterval(fetchUnreadMessages, 15000);

    return () => clearInterval(messageInterval);
  }, [profile?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Image src="/icon.png" alt="PetXfamily" width={40} height={40} className="w-10 h-10" />
                <span className="text-2xl font-bold text-gray-900">PetXfamily</span>
              </Link>

              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const showMessagesBadge = item.name === 'Messages' && unreadMessagesCount > 0;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={`${isActive ? 'bg-orange-500 hover:bg-orange-600' : ''} relative`}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                        {showMessagesBadge && (
                          <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-white text-xs rounded-full">
                            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/notifications')}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs rounded-full"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.profile_photo || ''} />
                      <AvatarFallback>
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      {/* <Badge variant="outline" className="text-xs">
                        {profile?.active_role === 'both' ? 'Owner & Host' : profile?.active_role}
                      </Badge> */}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/reviews')}>
                    <User className="w-4 h-4 mr-2" />
                    Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${isActive ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start relative"
                onClick={() => {
                  router.push('/notifications');
                  setMobileMenuOpen(false);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge 
                    className="ml-auto h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs rounded-full"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push('/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
