export const CouponsEditDialogue = ({
  isOpen,
  onClose,
  formData,
  onChange,
  errors,
  loading,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
        <h2 className="m-0 text-[15px] font-semibold text-white">Edit Coupon</h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {errors?.general && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Code and Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Code */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Coupon Code</label>

              <input
                type="text"
                placeholder="Enter coupon code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.code ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.code && (
                <span className="text-xs text-red-500">{errors.code}</span>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Discount Type</label>

              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Type</option>
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>

              {errors?.type && (
                <span className="text-xs text-red-500">{errors.type}</span>
              )}
            </div>
          </div>

          {/* Value and Min Order */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Value */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Discount Value</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter discount value"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.value ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.value && (
                <span className="text-xs text-red-500">{errors.value}</span>
              )}
            </div>

            {/* Min Order */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Minimum Order</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter minimum order amount"
                value={formData.minOrder}
                onChange={(e) => handleChange("minOrder", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.minOrder ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.minOrder && (
                <span className="text-xs text-red-500">{errors.minOrder}</span>
              )}
            </div>
          </div>

          {/* Usage Limit and Max Discount */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Usage Limit */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Usage Limit</label>

              <input
                type="number"
                min="0"
                placeholder="Enter usage limit (optional)"
                value={formData.usageLimit}
                onChange={(e) => handleChange("usageLimit", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.usageLimit ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.usageLimit && (
                <span className="text-xs text-red-500">{errors.usageLimit}</span>
              )}
            </div>

            {/* Max Discount */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Max Discount</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter max discount (optional)"
                value={formData.maxDiscount}
                onChange={(e) => handleChange("maxDiscount", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.maxDiscount ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.maxDiscount && (
                <span className="text-xs text-red-500">{errors.maxDiscount}</span>
              )}
            </div>
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Start Date */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Start Date</label>

              <input
                type="datetime-local"
                value={formData.startsAt}
                onChange={(e) => handleChange("startsAt", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.startsAt ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.startsAt && (
                <span className="text-xs text-red-500">{errors.startsAt}</span>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">End Date</label>

              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => handleChange("expiresAt", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.expiresAt ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.expiresAt && (
                <span className="text-xs text-red-500">{errors.expiresAt}</span>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
