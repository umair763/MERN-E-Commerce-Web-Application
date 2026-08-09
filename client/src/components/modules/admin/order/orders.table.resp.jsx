import { ActionMenu } from "../../../../common/action.menu.jsx";
import { UiStatusPill } from "../../../../common/ui.status.phill.jsx";

const ORDER_STATUS_COLORS = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#06B6D4",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export const OrdersTableResp = ({ orders, onStatusUpdate, onEdit, onDelete, onView }) => {
  const COLUMNS = [
    { key: "number", label: "#" },
    { key: "orderNumber", label: "Order Number" },
    { key: "customer", label: "Customer" },
    { key: "products", label: "Products" },
    { key: "payment", label: "Payment" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  const ROW_ACTIONS = [
    { key: "view", label: "View", variant: "filled" },
    { key: "edit", label: "Edit", variant: "outline" },
    { key: "delete", label: "Delete", variant: "danger" },
  ];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
        <div className="text-gray-300 mb-4">No orders found</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
        <p className="text-gray-500">No orders have been placed yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs uppercase text-gray-500"
                >
                  {column.label}
                </th>
              ))}

              <th className="w-24 px-6 py-4 text-center text-xs uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order, index) => (
              <tr key={order._id} className="transition hover:bg-indigo-50/50">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.orderNumber}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>
                    <div className="font-medium">{order.user?.name}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="max-w-xs">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {order.payment?.method === 'offline' ? 'COD' : order.payment?.method || 'N/A'}
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  ${order.totals?.total?.toFixed(2) || "0.00"}
                </td>

                <td className="px-6 py-4">
                  <UiStatusPill
                    status={order.status || "Pending"}
                    color={ORDER_STATUS_COLORS[order.status] || "#6B7280"}
                  />
                </td>

                <td className="w-24 px-6 py-4">
                  <div className="flex w-full justify-center">
                    <ActionMenu
                      actions={ROW_ACTIONS}
                      onAction={(actionKey) => {
                        if (actionKey === "view") onView(order);
                        if (actionKey === "edit") onEdit(order);
                        if (actionKey === "delete") onDelete(order);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};