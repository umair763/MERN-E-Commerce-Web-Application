import { useState, useEffect } from "react";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const UserEditDialogue = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const { error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    status: "active",
    roles: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact || "",
        status: user.status || "active",
        roles: user.roles?.map(r => r.name) || [],
      });
    }
  }, [user]);

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
      const response = await fetch(`${BaseUrl}/api/users/${user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, roleNames: formData.roles }),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        error(result.message || "Failed to update user");
        setErrors({ general: result.message });
      }
    } catch (err) {
      error("Failed to update user");
      setErrors({ general: "Failed to update user" });
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
            <h2 className="m-0 text-[15px] font-semibold text-white">Edit User</h2>
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
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Contact</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={formData.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.contact ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.contact && <span className="text-xs text-red-500">{errors.contact}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.status ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  {errors?.status && <span className="text-xs text-red-500">{errors.status}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Roles</label>
                <input
                  type="text"
                  placeholder="customer, admin (comma separated)"
                  value={formData.roles.join(', ')}
                  onChange={(e) => handleChange("roles", e.target.value.split(',').map(r => r.trim()))}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.roles ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors?.roles && <span className="text-xs text-red-500">{errors.roles}</span>}
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