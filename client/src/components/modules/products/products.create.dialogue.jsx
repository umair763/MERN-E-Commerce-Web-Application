export const ProductsCreateDialogue = ({
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
        <h2 className="m-0 text-[15px] font-semibold text-white">Add Product</h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {errors?.general && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Name and SKU */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Product Name</label>

              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.name ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </div>

            {/* SKU */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">SKU</label>

              <input
                type="text"
                placeholder="Enter SKU"
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.sku ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.sku && (
                <span className="text-xs text-red-500">{errors.sku}</span>
              )}
            </div>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Category</label>

              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors?.category && (
                <span className="text-xs text-red-500">{errors.category}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Price</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.price ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.price && (
                <span className="text-xs text-red-500">{errors.price}</span>
              )}
            </div>
          </div>

          {/* Stock and Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Stock */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Stock</label>

              <input
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                value={formData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.stock ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors?.stock && (
                <span className="text-xs text-red-500">{errors.stock}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[13.5px] font-medium">Status</label>

              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                  errors?.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {errors?.status && (
                <span className="text-xs text-red-500">{errors.status}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Description</label>

            <textarea
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                errors?.description ? "border-red-500" : "border-gray-300"
              }`}
              rows="3"
            />

            {errors?.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>

          {/* Product Image */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("image", e.target.files[0])}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />

            {formData.image && (
              <span className="text-xs text-gray-500">{formData.image.name}</span>
            )}
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
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
