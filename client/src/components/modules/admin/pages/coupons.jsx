import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../../../../common";
import { CouponTableResp, CouponCreateDialogue, CouponEditDialogue } from "../coupon";
import { UiDelete } from "../../../../common/ui.delete";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const generateCouponCode = () => {
  const uniqueId = Math.random().toString(36).substring(2, 11);
  return `coupon-${uniqueId}`;
};

const EMPTY_COUPON_FORM = {
  code: "",
  type: "",
  value: "",
  minOrder: "",
  usageLimit: "",
  maxDiscount: "",
  startsAt: "",
  expiresAt: "",
};

export const AdminCoupons = () => {
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_COUPON_FORM);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_COUPON_FORM);
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const [deletingCoupon, setDeletingCoupon] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/coupons`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCoupons(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openAdd = () => {
    setAddForm({ ...EMPTY_COUPON_FORM, code: generateCouponCode() });
    setAddErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setAddForm(EMPTY_COUPON_FORM);
    setAddErrors({});
  };

  const handleAddChange = (field, value) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async () => {
    let errors = {};

    if (!addForm.type) errors.type = "Discount type is required";
    if (!addForm.value) errors.value = "Discount value is required";

    if (Object.keys(errors).length) {
      setAddErrors(errors);
      return;
    }

    try {
      setAddLoading(true);

      const payload = {
        code: addForm.code,
        type: addForm.type,
        value: parseFloat(addForm.value),
        minOrder: addForm.minOrder ? parseFloat(addForm.minOrder) : 0,
        usageLimit: addForm.usageLimit ? parseInt(addForm.usageLimit) : undefined,
        maxDiscount: addForm.maxDiscount ? parseFloat(addForm.maxDiscount) : undefined,
        startsAt: addForm.startsAt || undefined,
        expiresAt: addForm.expiresAt || undefined,
      };

      const response = await fetch(`${BaseUrl}/api/coupons`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchCoupons();
        success("Coupon created successfully!");
        closeAdd();
      } else {
        error(result.message || "Failed to create coupon");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setEditForm({
      code: coupon.code || "",
      type: coupon.type || "",
      value: String(coupon.value || ""),
      minOrder: String(coupon.minOrder || ""),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      startsAt: coupon.startsAt || "",
      expiresAt: coupon.expiresAt || "",
    });
    setEditErrors({});
  };

  const closeEdit = () => {
    setEditingCoupon(null);
    setEditForm(EMPTY_COUPON_FORM);
    setEditErrors({});
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    let errors = {};

    if (!editForm.code) errors.code = "Coupon code is required";
    if (!editForm.type) errors.type = "Discount type is required";
    if (!editForm.value) errors.value = "Discount value is required";

    if (Object.keys(errors).length) {
      setEditErrors(errors);
      return;
    }

    try {
      setEditLoading(true);

      const payload = {
        code: editForm.code.toUpperCase(),
        type: editForm.type,
        value: parseFloat(editForm.value),
        minOrder: editForm.minOrder ? parseFloat(editForm.minOrder) : 0,
        usageLimit: editForm.usageLimit ? parseInt(editForm.usageLimit) : undefined,
        maxDiscount: editForm.maxDiscount ? parseFloat(editForm.maxDiscount) : undefined,
        startsAt: editForm.startsAt || undefined,
        expiresAt: editForm.expiresAt || undefined,
      };

      const response = await fetch(`${BaseUrl}/api/coupons/${editingCoupon._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchCoupons();
        success("Coupon updated successfully!");
        closeEdit();
      } else {
        error(result.message || "Failed to update coupon");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/coupons/${deletingCoupon._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCoupons();
        success("Coupon deleted successfully!");
      } else {
        error("Failed to delete coupon");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingCoupon(null);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Admin", "Coupons"]}
          title="Coupons"
          subtitle="Manage discount coupons"
          buttonLabel="Create Coupon"
          onButtonClick={openAdd}
        />
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <CouponCreateDialogue
              isOpen={isAddOpen}
              onClose={closeAdd}
              formData={addForm}
              onChange={handleAddChange}
              errors={addErrors}
              loading={addLoading}
              onSubmit={handleAddSubmit}
            />
          </div>
        </div>
      )}

      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <CouponEditDialogue
              isOpen={!!editingCoupon}
              onClose={closeEdit}
              formData={editForm}
              onChange={handleEditChange}
              errors={editErrors}
              loading={editLoading}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}

      {deletingCoupon && (
        <UiDelete
          open={!!deletingCoupon}
          onClose={() => setDeletingCoupon(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Coupon"
          itemType="coupon"
          itemName={deletingCoupon.code}
        />
      )}

      <div className="ml-3 mr-3">
        <CouponTableResp
          coupons={coupons}
          onEdit={openEdit}
          onDelete={setDeletingCoupon}
        />
      </div>
    </div>
  );
};