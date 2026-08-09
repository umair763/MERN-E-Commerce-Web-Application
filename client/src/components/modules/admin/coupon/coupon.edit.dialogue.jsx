export const CouponEditDialogue = ({
  isOpen,
  onClose,
  formData,
  onChange,
  errors,
  loading,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl">
        <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
          <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
            <h2 className="m-0 text-[15px] font-semibold text-white">Edit Coupon</h2>
          </div>

          <div className="px-6 py-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g., SUMMER20"
                  value={formData.code}
                  onChange={(e) => onChange("code", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
                {errors.code && <span className="text-xs text-red-500">{errors.code}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Discount Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => onChange("type", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                >
                  <option value="">Select type</option>
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Discount Value</label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  value={formData.value}
                  onChange={(e) => onChange("value", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
                {errors.value && <span className="text-xs text-red-500">{errors.value}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Minimum Order Value</label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.minOrder}
                  onChange={(e) => onChange("minOrder", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Usage Limit (optional)</label>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.usageLimit}
                  onChange={(e) => onChange("usageLimit", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Maximum Discount (optional)</label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.maxDiscount}
                  onChange={(e) => onChange("maxDiscount", e.target.value)}
                  className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Start Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => onChange("startsAt", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[13.5px] font-medium">Expiry Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => onChange("expiresAt", e.target.value)}
                    className="rounded-lg border px-4 py-2 text-sm outline-none border-gray-300"
                  />
                </div>
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
                  onClick={onSubmit}
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