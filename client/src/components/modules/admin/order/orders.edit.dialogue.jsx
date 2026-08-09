export const OrdersEditDialogue = ({
  isOpen,
  onClose,
  order,
  formData,
  onChange,
  loading,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
          <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
            <h2 className="m-0 text-[15px] font-semibold text-white">Edit Order</h2>
          </div>

          <div className="px-6 py-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Order Number</label>
                <input
                  type="text"
                  value={order?.orderNumber || ""}
                  disabled
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300 bg-gray-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Shipping Address</label>
                <textarea
                  placeholder="Shipping address"
                  value={typeof formData.shippingAddress === 'object' 
                    ? `${formData.shippingAddress.street || ''}, ${formData.shippingAddress.city || ''}, ${formData.shippingAddress.state || ''} ${formData.shippingAddress.zip || ''}`
                    : formData.shippingAddress || ""}
                  onChange={(e) => onChange("shippingAddress", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300 min-h-[80px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Order Status</label>
                <select
                  value={formData.status || ""}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Subtotal</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.subtotal || ""}
                    onChange={(e) => onChange("subtotal", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Discount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.discount || ""}
                    onChange={(e) => onChange("discount", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Shipping</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.shipping || ""}
                    onChange={(e) => onChange("shipping", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Tax</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.tax || ""}
                    onChange={(e) => onChange("tax", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Total</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.total || ""}
                  onChange={(e) => onChange("total", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={loading}
                  className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};