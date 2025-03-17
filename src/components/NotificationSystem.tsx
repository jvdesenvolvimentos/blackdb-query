
import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
    
    return newNotification.id;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
  };
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onRemove }: NotificationItemProps) => {
  const bgColors = {
    info: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
  };

  const textColors = {
    info: 'text-blue-800 dark:text-blue-300',
    success: 'text-green-800 dark:text-green-300',
    warning: 'text-yellow-800 dark:text-yellow-300',
    error: 'text-red-800 dark:text-red-300',
  };

  return (
    <div 
      className={`${bgColors[notification.type]} ${notification.read ? 'opacity-70' : 'opacity-100'} p-3 rounded-md relative mb-2`}
    >
      <button 
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => onRemove(notification.id)}
      >
        <XCircle className="h-4 w-4" />
      </button>
      
      <div className="pr-4">
        <h4 className={`font-medium ${textColors[notification.type]}`}>{notification.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {notification.timestamp.toLocaleTimeString()}
          </span>
          {!notification.read && (
            <button 
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Marcar como lido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onRemove, 
  onMarkAllAsRead, 
  onClearAll 
}: { 
  notifications: Notification[]; 
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}) => {
  if (notifications.length === 0) {
    return <p className="text-center text-gray-500 py-4">Nenhuma notificação</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-1">
        <button 
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          onClick={onMarkAllAsRead}
        >
          Marcar todas como lidas
        </button>
        <button 
          className="text-xs text-red-600 dark:text-red-400 hover:underline"
          onClick={onClearAll}
        >
          Limpar todas
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onMarkAsRead={onMarkAsRead}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export { NotificationItem, NotificationList };
