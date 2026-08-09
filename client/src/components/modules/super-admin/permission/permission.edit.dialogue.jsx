import { useState, useEffect } from "react";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const PermissionEditDialogue = ({
  isOpen,
  permission,
  onClose,
  onSuccess,
}) => {
  const { error } = useToast();
  const [formData, setFormData] = useState({
    key: "",
    module: "",
    action: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission) {
      setFormData({
        key: permission.key,
        module: permission.module,
        action: permission.action,
        description: permission.description || "",
        isActive: permission.isActive !== undefined ? permission.isActive : true,
      });
    }
  }, [permission]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BaseUrl}/api/admin/permissions/${permission._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        error(result.message || "Failed to update permission");
        setErrors({ general: result.message });
      }
    } catch (err) {
      error("Failed to update permission");
      setErrors({ general: "Failed to update permission" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg">
        <div className="w-full overflow-hidden rounded-xl bg-white font-sans">
          <div className="flex items-center justify-between rounded-t-xl bg-[#4F30A9] px-6 py-4">
            <h2 className="m-0 text-[15px] font-semibold text-white">Edit Permission</h2>
          </div>

          <div className="px-6 py-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {errors?.general && (
                <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Key</label>
                  <input
                    type="text"
                    placeholder="e.g., product.create"
                    value={formData.key}
                    onChange={(e) => handleChange("key", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.key ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.key && <span className="text-xs text-red-500">{errors.key}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Module</label>
                  <input
                    type="text"
                    placeholder="e.g., product"
                    value={formData.module}
                    onChange={(e) => handleChange("module", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.module ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.module && <span className="text-xs text-red-500">{errors.module}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Action</label>
                <input
                  type="text"
                  placeholder="e.g., create"
                  value={formData.action}
                  onChange={(e) => handleChange("action", e.target.value)}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.action ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors?.action && <span className="text-xs text-red-500">{errors.action}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Description</label>
                <textarea
                  placeholder="Permission description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.description ? "border-red-500" : "border-gray-300"
                    }`}
                  rows={3}
                />
                {errors?.description && <span className="text-xs text-red-500">{errors.description}</span>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-[#4F30A9] rounded focus:ring-2 focus:ring-[#4F30A9]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="h-px bg-gray-200" />

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
      </div>
    </div>
  );
};
