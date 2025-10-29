'use client';

import { useSession, signOut } from 'next-auth/react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/use-toast';
import { initializePusher, bindPusherEvents } from '@/lib/pusher';
import { useState, useEffect } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      initializePusher();
      
      const cleanup = bindPusherEvents({
        'srd:new': (data) => {
          const newNotification = {
            id: Date.now(),
            type: 'new',
            message: `New SRD created: ${data.refNo}`,
            timestamp: new Date()
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: 'New SRD Created',
            description: `SRD ${data.refNo} has been created`,
          });
        },
        'srd:update': (data) => {
          const newNotification = {
            id: Date.now(),
            type: 'update',
            message: `SRD ${data.id} updated`,
            timestamp: new Date()
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: 'SRD Updated',
            description: `SRD ${data.id} has been updated`,
          });
        },
        'srd:flag': (data) => {
          const newNotification = {
            id: Date.now(),
            type: 'flag',
            message: `SRD ${data.id} flagged by ${data.department}`,
            timestamp: new Date()
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: 'SRD Flagged',
            description: `SRD ${data.id} flagged: ${data.comment?.text}`,
            variant: 'destructive'
          });
        }
      });
      
      return cleanup;
    }
  }, [session, toast]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const markNotificationsAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">SRD Tracking System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.role?.toUpperCase()}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}