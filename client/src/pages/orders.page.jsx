import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { UiDelete } from "../common/ui.delete";
import { ActionMenu } from "../common/action.menu.jsx";
import { UiStatusPill } from "../common/ui.status.phill.jsx";
import { Eye, X, RotateCcw } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const ORDER_STATUS_COLORS = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#06B6D4",
  delivered: "#10B981",
  cancelled: "#EF4444",
  returned: "#8B5CF6",
};

export const OrdersPage = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [returningOrder, setReturningOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnItems, setReturnItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // ==========================
  // GET ORDERS
  // ==========================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? `${BaseUrl}/api/orders/admin/all` : `${BaseUrl}/api/orders`;
      
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ==========================
  // CANCEL ORDER
  // ==========================

  const handleCancelConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/orders/${cancellingOrder._id}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        await fetchOrders();
        success("Order cancelled successfully!");
      } else {
        const result = await response.json();
        error(result.message || "Failed to cancel order");
      }
    } catch (error) {
      console.log(error);
      error("Failed to cancel order");
    }

    setCancellingOrder(null);
  };

  // ==========================
  // RETURN ORDER
  // ==========================

  const handleReturnSubmit = async () => {
    if (!returnReason.trim()) {
      error("Please provide a reason for return");
      return;
    }

    if (returnItems.length === 0) {
      error("Please select at least one item to return");
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/api/returns`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: returningOrder._id,
          items: returnItems,
          reason: returnReason,
        }),
      });

      if (response.ok) {
        await fetchOrders();
        success("Return request submitted successfully!");
        setReturningOrder(null);
        setReturnReason("");
        setReturnItems([]);
      } else {
        const result = await response.json();
        error(result.message || "Failed to submit return request");
      }
    } catch (error) {
      console.log(error);
      error("Failed to submit return request");
    }
  };

  const toggleReturnItem = (itemId, variantId) => {
    const exists = returnItems.find(
      (item) => item.product === itemId && item.variantId === variantId
    );
    if (exists) {
      setReturnItems(returnItems.filter((item) => 
        !(item.product === itemId && item.variantId === variantId)
      ));
    } else {
      const orderItem = returningOrder.items.find(
        (item) => item.product === itemId && item.variantId === variantId
      );
      if (orderItem) {
        setReturnItems([...returnItems, {
          product: itemId,
          variantId: variantId,
          quantity: orderItem.quantity,
        }]);
      }
    }
  };

  // ==========================
  // ADMIN UPDATE STATUS
  // ==========================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BaseUrl}/api/orders/admin/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        success("Order status updated successfully!");
      } else {
        error("Failed to update order status");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  const COLUMNS = [
    { key: "number", label: "#" },
    { key: "orderNumber", label: "Order Number" },
    { key: "customer", label: isAdmin ? "Customer" : "Date" },
    { key: "products", label: "Products" },
    { key: "payment", label: "Payment" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  const getRowActions = (order) => {
    if (isAdmin) {
      return [
        { key: "view", label: "View", variant: "filled" },
        { key: "pending", label: "Pending", variant: "outline" },
        { key: "confirmed", label: "Confirmed", variant: "outline" },
        { key: "processing", label: "Processing", variant: "outline" },
        { key: "shipped", label: "Shipped", variant: "outline" },
        { key: "delivered", label: "Delivered", variant: "outline" },
        { key: "cancelled", label: "Cancelled", variant: "danger" },
      ];
    } else {
      const actions = [{ key: "view", label: "View", variant: "filled" }];
      
      if (order.status === "pending") {
        actions.push({ key: "cancel", label: "Cancel", variant: "danger" });
      }
      
      if (order.status === "delivered") {
        actions.push({ key: "return", label: "Return", variant: "outline" });
      }
      
      return actions;
    }
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Orders"]}
          title={isAdmin ? "All Orders" : "My Orders"}
          subtitle={isAdmin ? "Manage all customer orders" : "View your order history"}
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <Eye size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {isAdmin ? "No orders have been placed yet" : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
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
                        {isAdmin ? (
                          <div>
                            <div className="font-medium">{order.user?.name}</div>
                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                          </div>
                        ) : (
                          new Date(order.createdAt).toLocaleDateString()
                        )}
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
                            actions={getRowActions(order)}
                            onAction={(actionKey) => {
                              if (actionKey === "view") setSelectedOrder(order);
                              if (actionKey === "cancel") setCancellingOrder(order);
                              if (actionKey === "return") {
                                setReturningOrder(order);
                                setReturnReason("");
                                setReturnItems([]);
                              }
                              if (isAdmin && ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].includes(actionKey)) {
                                updateOrderStatus(order._id, actionKey);
                              }
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
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#4F30A9] px-6 py-4">
              <h2 className="text-[15px] font-semibold text-white">
                Order Details - {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <UiStatusPill
                    status={selectedOrder.status}
                    color={ORDER_STATUS_COLORS[selectedOrder.status] || "#6B7280"}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price} × {item.quantity}</p>
                      <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${selectedOrder.totals?.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>-${selectedOrder.totals?.discount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${selectedOrder.totals?.shipping?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${selectedOrder.totals?.tax?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${selectedOrder.totals?.total?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cancellingOrder && (
        <UiDelete
          open={!!cancellingOrder}
          onClose={() => setCancellingOrder(null)}
          onConfirm={handleCancelConfirm}
          title="Cancel Order"
          itemType="order"
          itemName={cancellingOrder.orderNumber}
          message="Are you sure you want to cancel this order? This action cannot be undone."
        />
      )}

      {returningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#4F30A9] px-6 py-4">
              <h2 className="text-[15px] font-semibold text-white">
                Return Order - {returningOrder.orderNumber}
              </h2>
              <button
                onClick={() => {
                  setReturningOrder(null);
                  setReturnReason("");
                  setReturnItems([]);
                }}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Items to Return
                </label>
                <div className="space-y-2">
                  {returningOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={returnItems.some(
                            (ri) => ri.product === item.product && ri.variantId === item.variantId
                          )}
                          onChange={() => toggleReturnItem(item.product, item.variantId)}
                          className="w-4 h-4 text-[#4F30A9] border-gray-300 rounded focus:ring-[#4F30A9]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Return
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Please explain why you want to return these items..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#4F30A9] focus:ring-1 focus:ring-[#4F30A9]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setReturningOrder(null);
                    setReturnReason("");
                    setReturnItems([]);
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnSubmit}
                  disabled={returnItems.length === 0 || !returnReason.trim()}
                  className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4F30A9]/90"
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};