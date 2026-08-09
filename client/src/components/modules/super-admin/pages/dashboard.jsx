import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Shield, Users, Settings, FileText, Crown, TrendingUp } from "lucide-react";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    recentOrders: [],
    orderStatusBreakdown: {},
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/super-admin/dashboard/stats`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: FileText, color: "bg-blue-500" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: Crown, color: "bg-green-500" },
    { label: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: Users, color: "bg-purple-500" },
    { label: "Total Admins", value: stats.totalAdmins.toLocaleString(), icon: Shield, color: "bg-orange-500" },
  ];

  const formatCurrency = (amount) => `$${amount?.toLocaleString() || 0}`;

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Dashboard"]}
          title="Super Admin Dashboard"
          subtitle="System administration and controls"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                {stats.recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.user?.name || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(order.totals?.total)}</p>
                          <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                {stats.recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium capitalize text-gray-900">{user.status}</p>
                          <p className="text-xs text-gray-500">
                            {user.roles?.map(r => r.name).join(', ') || 'No roles'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent users</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
              {Object.keys(stats.orderStatusBreakdown).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.orderStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 capitalize">{status}</p>
                      <p className="text-sm font-semibold text-blue-600">{count}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No order data available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
