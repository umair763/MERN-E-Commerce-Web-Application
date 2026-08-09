export const CategoriesCreateDialogue = ({
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
        <h2 className="m-0 text-[15px] font-semibold text-white">Add Category</h2>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {errors?.general && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
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

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] font-medium">Description</label>

            <textarea
              placeholder="Enter category description"
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
