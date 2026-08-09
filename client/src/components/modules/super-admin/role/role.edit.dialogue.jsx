import { useState, useEffect } from "react";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const RoleEditDialogue = ({
  isOpen,
  role,
  onClose,
  onSuccess,
}) => {
  const { error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    level: 0,
    permissions: [],
    isDefault: false,
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        level: role.level,
        permissions: role.permissions?.map(p => p._id) || [],
        isDefault: role.isDefault || false,
        description: role.description || "",
        isActive: role.isActive !== undefined ? role.isActive : true,
      });
    }
  }, [role]);

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
      const response = await fetch(`${BaseUrl}/api/admin/roles/${role._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        error(result.message || "Failed to update role");
        setErrors({ general: result.message });
      }
    } catch (err) {
      error("Failed to update role");
      setErrors({ general: "Failed to update role" });
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
            <h2 className="m-0 text-[15px] font-semibold text-white">Edit Role</h2>
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
                  <label className="text-[13.5px] font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="e.g., manager"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Level</label>
                  <input
                    type="number"
                    placeholder="0-3"
                    value={formData.level}
                    onChange={(e) => handleChange("level", parseInt(e.target.value))}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.level ? "border-red-500" : "border-gray-300"
                    }`}
                    min={0}
                    max={3}
                  />
                  {errors?.level && <span className="text-xs text-red-500">{errors.level}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Description</label>
                <textarea
                  placeholder="Role description"
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
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleChange("isDefault", e.target.checked)}
                  className="w-4 h-4 text-[#4F30A9] rounded focus:ring-2 focus:ring-[#4F30A9]"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Default Role</label>
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
