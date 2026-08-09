import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../common";
import { ShoppingCart, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BaseUrl = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    cartItems: 0,
    wishlist: 0,
    spent: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${BaseUrl}/api/customer/dashboard/stats`, {
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        setStats({
          orders: result.data.totalOrders,
          cartItems: 0,
          wishlist: 0,
          spent: result.data.totalSpent,
        });
        setRecentOrders(result.data.recentOrders || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const customerStats = [
    {
      label: "My Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "Cart Items",
      value: stats.cartItems,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      label: "Wishlist",
      value: stats.wishlist,
      icon: Heart,
      color: "bg-purple-500",
    },
    {
      label: "Total Spent",
      value: `$${stats.spent.toFixed(2)}`,
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard"]}
          title={`Welcome, ${user?.name || "Customer"}`}
          subtitle="Here's what's happening with your account"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {customerStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/cart"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ShoppingBag size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">View Cart</span>
              <ArrowRight size={16} className="ml-auto text-gray-400" />
            </Link>
            <Link
              to="/dashboard/orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ShoppingCart size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">My Orders</span>
              <ArrowRight size={16} className="ml-auto text-gray-400" />
            </Link>
            <Link
              to="/dashboard/wishlist"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <Heart size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">My Wishlist</span>
              <ArrowRight size={16} className="ml-auto text-gray-400" />
            </Link>
            <Link
              to="/dashboard/coupons"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ShoppingBag size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">View Coupons</span>
              <ArrowRight size={16} className="ml-auto text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-sm text-[#4F30A9] hover:underline">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders yet. Start shopping!
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4F30A9] rounded-lg flex items-center justify-center">
                      <ShoppingCart size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">${(order.totals?.total || 0).toFixed(2)}</p>
                    <span className="text-xs font-medium capitalize bg-gray-200 px-2 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
