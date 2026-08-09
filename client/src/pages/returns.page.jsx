import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { UiDelete } from "../common/ui.delete";
import { ActionMenu } from "../common/action.menu.jsx";
import { UiStatusPill } from "../common/ui.status.phill.jsx";
import { RotateCcw, Plus, Package } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const RETURN_STATUS_COLORS = {
  pending: "#F59E0B",
  approved: "#10B981",
  rejected: "#EF4444",
  processing: "#3B82F6",
  completed: "#8B5CF6",
};

const EMPTY_RETURN_FORM = {
  orderId: "",
  items: [],
  reason: "",
};

export const ReturnsPage = () => {
  const { success, error } = useToast();
  const [returns, setReturns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // ADD STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_RETURN_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ADMIN UPDATE STATE
  const [updatingReturn, setUpdatingReturn] = useState(null);
  const [adminStatus, setAdminStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  // ==========================
  // GET RETURNS
  // ==========================

  const fetchReturns = useCallback(async () => {
    try {
      const endpoint = isAdmin ? `${BaseUrl}/api/returns/admin/all` : `${BaseUrl}/api/returns`;
      
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setReturns(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, [isAdmin]);

  // GET DELIVERED ORDERS FOR RETURN
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/orders`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        const deliveredOrders = (result.data || []).filter(
          order => order.status === 'delivered'
        );
        setOrders(deliveredOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
    if (!isAdmin) {
      fetchOrders();
    }
  }, [fetchReturns, fetchOrders, isAdmin]);

  // ==========================
  // CREATE RETURN REQUEST
  // ==========================

  const openAdd = () => {
    setForm(EMPTY_RETURN_FORM);
    setErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setForm(EMPTY_RETURN_FORM);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemToggle = (itemIndex) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      const index = newItems.indexOf(itemIndex);
      if (index > -1) {
        newItems.splice(index, 1);
      } else {
        newItems.push(itemIndex);
      }
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async () => {
    let errors = {};

    if (!form.orderId) errors.orderId = "Order is required";
    if (form.items.length === 0) errors.items = "At least one item must be selected";
    if (!form.reason) errors.reason = "Reason is required";

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const selectedOrder = orders.find(o => o._id === form.orderId);
      const selectedItemDetails = form.items.map(itemIndex => ({
        product: selectedOrder.items[itemIndex].product,
        name: selectedOrder.items[itemIndex].name,
        quantity: selectedOrder.items[itemIndex].quantity,
      }));

      const response = await fetch(`${BaseUrl}/api/returns`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: form.orderId,
          items: selectedItemDetails,
          reason: form.reason,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchReturns();
        success("Return request submitted successfully!");
        closeAdd();
      } else {
        error(result.message || "Failed to submit return request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // ADMIN UPDATE RETURN STATUS
  // ==========================

  const openAdminUpdate = (returnRequest) => {
    setUpdatingReturn(returnRequest);
    setAdminStatus(returnRequest.status || "");
    setAdminNote(returnRequest.resolutionNote || "");
  };

  const handleAdminUpdate = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/returns/admin/${updatingReturn._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: adminStatus,
          resolutionNote: adminNote,
        }),
      });

      if (response.ok) {
        await fetchReturns();
        success("Return status updated successfully!");
        setUpdatingReturn(null);
      } else {
        error("Failed to update return status");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isAdmin) {
    // ADMIN VIEW
    const COLUMNS = [
      { key: "number", label: "#" },
      { key: "requestId", label: "Request ID" },
      { key: "customer", label: "Customer" },
      { key: "order", label: "Order" },
      { key: "reason", label: "Reason" },
      { key: "status", label: "Status" },
    ];

    const ROW_ACTIONS = [
      { key: "approved", label: "Approve", variant: "filled" },
      { key: "rejected", label: "Reject", variant: "danger" },
      { key: "processing", label: "Processing", variant: "outline" },
      { key: "completed", label: "Complete", variant: "outline" },
    ];

    return (
      <div>
        <div className="ml-3 mr-3">
          <PageHeader
            breadcrumbs={["Dashboard", "Returns"]}
            title="Return Requests"
            subtitle="Manage product return requests"
            showButton={false}
          />
        </div>

        <div className="ml-3 mr-3">
          {returns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
              <RotateCcw size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No return requests</h3>
              <p className="text-gray-500">Return requests will appear here</p>
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
                    {returns.map((returnRequest, index) => (
                      <tr key={returnRequest._id} className="transition hover:bg-indigo-50/50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {returnRequest._id.slice(-8)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="font-medium">{returnRequest.user?.name}</div>
                          <div className="text-xs text-gray-500">{returnRequest.user?.email}</div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {returnRequest.order?.orderNumber}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {returnRequest.reason}
                        </td>

                        <td className="px-6 py-4">
                          <UiStatusPill
                            status={returnRequest.status || "Pending"}
                            color={RETURN_STATUS_COLORS[returnRequest.status] || "#6B7280"}
                          />
                        </td>

                        <td className="w-24 px-6 py-4">
                          <div className="flex w-full justify-center">
                            <ActionMenu
                              actions={ROW_ACTIONS}
                              onAction={(actionKey) => {
                                setAdminStatus(actionKey);
                                openAdminUpdate(returnRequest);
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

        {/* Admin Update Modal */}
        {updatingReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl overflow-hidden">
              <div className="flex items-center justify-between bg-[#4F30A9] px-6 py-4">
                <h2 className="text-[15px] font-semibold text-white">Update Return Request</h2>
                <button
                  onClick={() => setUpdatingReturn(null)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Status</label>
                    <select
                      value={adminStatus}
                      onChange={(e) => setAdminStatus(e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Resolution Note</label>
                    <textarea
                      placeholder="Add a note about this resolution"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none"
                      rows="3"
                    />
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setUpdatingReturn(null)}
                      className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleAdminUpdate}
                      className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // USER VIEW
  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Returns"]}
          title="My Returns"
          subtitle="Manage your return requests"
          buttonLabel="Request Return"
          onButtonClick={openAdd}
        />
      </div>

      {/* Create Return Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#4F30A9] px-6 py-4">
              <h2 className="text-[15px] font-semibold text-white">Request Return</h2>
              <button
                onClick={closeAdd}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Select Order */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Select Order</label>
                  <select
                    value={form.orderId}
                    onChange={(e) => {
                      handleChange("orderId", e.target.value);
                      handleChange("items", []);
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.orderId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a delivered order</option>
                    {orders.map((order) => (
                      <option key={order._id} value={order._id}>
                        {order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  {errors?.orderId && (
                    <span className="text-xs text-red-500">{errors.orderId}</span>
                  )}
                </div>

                {/* Select Items */}
                {form.orderId && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Select Items to Return</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {orders.find(o => o._id === form.orderId)?.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border-b border-gray-200 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={form.items.includes(index)}
                            onChange={() => handleItemToggle(index)}
                            className="w-4 h-4 text-[#4F30A9] border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-700">${item.price}</p>
                        </div>
                      ))}
                    </div>
                    {errors?.items && (
                      <span className="text-xs text-red-500">{errors.items}</span>
                    )}
                  </div>
                )}

                {/* Reason */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Reason for Return</label>
                  <textarea
                    placeholder="Please explain why you want to return these items"
                    value={form.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.reason ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="4"
                  />
                  {errors?.reason && (
                    <span className="text-xs text-red-500">{errors.reason}</span>
                  )}
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeAdd}
                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ml-3 mr-3">
        {returns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <RotateCcw size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No return requests</h3>
            <p className="text-gray-500">You haven't submitted any return requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {returns.map((returnRequest) => (
              <div
                key={returnRequest._id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={20} className="text-[#4F30A9]" />
                      <span className="font-semibold text-gray-900">
                        Return Request #{returnRequest._id.slice(-8)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Order: {returnRequest.order?.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(returnRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <UiStatusPill
                    status={returnRequest.status || "Pending"}
                    color={RETURN_STATUS_COLORS[returnRequest.status] || "#6B7280"}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                  <div className="space-y-2">
                    {returnRequest.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reason</h4>
                  <p className="text-sm text-gray-600">{returnRequest.reason}</p>
                </div>

                {returnRequest.resolutionNote && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">Resolution Note</h4>
                    <p className="text-sm text-gray-600">{returnRequest.resolutionNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};