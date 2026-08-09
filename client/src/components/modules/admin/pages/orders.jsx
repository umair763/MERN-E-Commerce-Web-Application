import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../../../common";
import { OrdersTableResp, OrdersEditDialogue, OrderViewDialogue } from "../order";
import { UiDelete } from "../../../../common/ui.delete";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const AdminOrders = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}/api/orders/admin/all`, {
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
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openView = (order) => {
    setViewingOrder(order);
  };

  const openEdit = (order) => {
    setEditingOrder(order);
    setEditForm({
      status: order.status || "",
      shippingAddress: order.shippingAddress,
      subtotal: order.totals?.subtotal || "",
      discount: order.totals?.discount || "",
      shipping: order.totals?.shipping || "",
      tax: order.totals?.tax || "",
      total: order.totals?.total || "",
    });
  };

  const closeEdit = () => {
    setEditingOrder(null);
    setEditForm({});
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingOrder?._id) {
      error("Order ID is missing");
      return;
    }

    try {
      setEditLoading(true);
      const payload = {
        status: editForm.status,
        shippingAddress: editForm.shippingAddress,
        totals: {
          subtotal: parseFloat(editForm.subtotal) || 0,
          discount: parseFloat(editForm.discount) || 0,
          shipping: parseFloat(editForm.shipping) || 0,
          tax: parseFloat(editForm.tax) || 0,
          total: parseFloat(editForm.total) || 0,
        },
      };

      const response = await fetch(`${BaseUrl}/api/orders/admin/${editingOrder._id.trim()}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchOrders();
        success("Order updated successfully!");
        closeEdit();
      } else {
        const result = await response.json();
        error(result.message || "Failed to update order");
      }
    } catch (error) {
      console.log(error);
      error("Failed to update order");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/orders/admin/${deletingOrder._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchOrders();
        success("Order deleted successfully!");
      } else {
        error("Failed to delete order");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Orders"]}
          title="All Orders"
          subtitle="Manage all customer orders"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <OrdersTableResp
          orders={orders}
          onEdit={openEdit}
          onDelete={setDeletingOrder}
          onView={openView}
        />
      </div>

      {viewingOrder && (
        <OrderViewDialogue
          isOpen={!!viewingOrder}
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {editingOrder && (
        <OrdersEditDialogue
          isOpen={!!editingOrder}
          order={editingOrder}
          formData={editForm}
          onChange={handleEditChange}
          loading={editLoading}
          onClose={closeEdit}
          onSave={handleEditSave}
        />
      )}

      {deletingOrder && (
        <UiDelete
          open={!!deletingOrder}
          onClose={() => setDeletingOrder(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Order"
          itemType="order"
          itemName={deletingOrder.orderNumber}
        />
      )}
    </div>
  );
};