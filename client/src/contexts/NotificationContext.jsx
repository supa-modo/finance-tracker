import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Notification generation utilities
  const generateInvestmentNotifications = (investments, transactions) => {
    investments.forEach((investment) => {
      // Low balance alert
      if (investment.currentBalance < investment.initialBalance * 0.1) {
        addNotification({
          type: "warning",
          title: "Low Investment Balance",
          message: `Your investment "${investment.name}" is below 10% of initial balance.`,
        });
      }

      // Performance tracking
      const investmentTransactions = transactions.filter(
        (t) => t.investmentId === investment.id
      );

      const lastTransaction =
        investmentTransactions.length > 0
          ? investmentTransactions[investmentTransactions.length - 1]
          : null;

      if (lastTransaction) {
        const daysSinceLastTransaction =
          (new Date() - new Date(lastTransaction.timestamp)) /
          (1000 * 60 * 60 * 24);

        if (daysSinceLastTransaction > 90) {
          addNotification({
            type: "info",
            title: "Inactive Investment",
            message: `No transactions for "${investment.name}" in the last 3 months.`,
          });
        }
      }
    });
  };

  // Periodic notification generation
  useEffect(() => {
    const investments = JSON.parse(localStorage.getItem("investments") || "[]");
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    generateInvestmentNotifications(investments, transactions);
  }, []); // Run on mount and when investments/transactions change

  // Cleanup old notifications
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setNotifications((prev) =>
      prev.filter(
        (notification) => new Date(notification.timestamp) > thirtyDaysAgo
      )
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Notification Component
export const NotificationCenter = () => {
  const { notifications, markNotificationRead, clearNotifications } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "success":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        🔔
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] overflow-y-auto bg-white border rounded-xl shadow-lg z-50">
          <div className="flex justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              onClick={clearNotifications}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 border-b flex items-start 
                  ${getNotificationColor(notification.type)}
                  ${!notification.read ? "font-bold" : ""}
                `}
                onClick={() => markNotificationRead(notification.id)}
              >
                <span className="mr-3 text-2xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div>
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
