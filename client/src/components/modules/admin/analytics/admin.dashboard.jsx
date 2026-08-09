import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../../../common";
import { ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}/api/analytics/dashboard`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: analytics?.orders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "Total Revenue",
      value: `$${(analytics?.revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Total Products",
      value: analytics?.products || 0,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      label: "Low Stock Items",
      value: analytics?.lowStock || 0,
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Dashboard"]}
          title="Admin Dashboard"
          subtitle="Manage products, orders, and customers"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    <TrendingUp size={16} className="inline mr-1" />
                    +12.5%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <Package size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">Manage Products</span>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <ShoppingCart size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">View Orders</span>
            </a>
            <a
              href="/admin/coupons"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <DollarSign size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">Manage Coupons</span>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <AlertTriangle size={20} className="text-[#4F30A9]" />
              <span className="font-medium text-gray-700">Manage Users</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
