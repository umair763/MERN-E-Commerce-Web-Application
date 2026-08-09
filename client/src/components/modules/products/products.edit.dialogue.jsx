export const ProductsEditDialogue = ({
  isOpen,
  onClose,
  formData,
  onChange,
  errors,
  loading,
  onSubmit,
  categories = [],
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
        <h2 className="m-0 text-[15px] font-semibold leading-[1.4] text-white">
          Edit Product
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name & SKU */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                className={`w-full rounded-lg border px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)] ${
                  errors?.name
                    ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-[#e2e8f0]"
                }`}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              {errors?.name && (
                <span className="-mt-1 text-xs text-red-500">{errors.name}</span>
              )}
            </div>

            {/* SKU */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                SKU
              </label>

              <input
                type="text"
                placeholder="Enter SKU"
                className={`w-full rounded-lg border px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)] ${
                  errors?.sku
                    ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-[#e2e8f0]"
                }`}
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
              />

              {errors?.sku && (
                <span className="-mt-1 text-xs text-red-500">{errors.sku}</span>
              )}
            </div>
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                Category
              </label>

              <select
                className={`min-h-[44px] w-full cursor-pointer appearance-none rounded-lg border bg-white px-[14px] pr-9 text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] ${
                  errors?.category ? "border-red-500" : "border-[#E4E7EC]"
                }`}
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors?.category && (
                <span className="-mt-1 text-xs text-red-500">{errors.category}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                className={`w-full rounded-lg border px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)] ${
                  errors?.price
                    ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-[#e2e8f0]"
                }`}
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />

              {errors?.price && (
                <span className="-mt-1 text-xs text-red-500">{errors.price}</span>
              )}
            </div>
          </div>

          {/* Stock & Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Stock */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                Stock
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                className={`w-full rounded-lg border px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)] ${
                  errors?.stock
                    ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-[#e2e8f0]"
                }`}
                value={formData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
              />

              {errors?.stock && (
                <span className="-mt-1 text-xs text-red-500">{errors.stock}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
                Status
              </label>

              <select
                className={`min-h-[44px] w-full cursor-pointer appearance-none rounded-lg border bg-white px-[14px] pr-9 text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] ${
                  errors?.status ? "border-red-500" : "border-[#E4E7EC]"
                }`}
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {errors?.status && (
                <span className="-mt-1 text-xs text-red-500">{errors.status}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
              Description
            </label>

            <textarea
              placeholder="Enter product description"
              className={`w-full rounded-lg border px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)] ${
                errors?.description
                  ? "border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  : "border-[#e2e8f0]"
              }`}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows="3"
            />

            {errors?.description && (
              <span className="-mt-1 text-xs text-red-500">
                {errors.description}
              </span>
            )}
          </div>

          {/* Product Image */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium leading-none text-[#09090B]">
              Product Image
            </label>

            <input
              type="url"
              placeholder="Enter product image URL"
              className="w-full rounded-lg border border-[#e2e8f0] px-[14px] py-[10px] text-sm text-[#2A3547] outline-none transition-all focus:border-[#4F30A9] focus:shadow-[0_0_0_3px_rgba(74,2,249,0.1)]"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E4E7EC]" />

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 min-w-[90px] items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-5 text-sm font-medium text-[#344054] transition-all hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 min-w-[90px] items-center justify-center rounded-lg border-none bg-[#4F30A9] px-5 text-sm font-medium text-white transition-all hover:bg-[#4F30A9]/90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
