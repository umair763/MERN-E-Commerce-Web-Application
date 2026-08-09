import { useState } from "react";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SettingsCreateDialogue = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { error } = useToast();
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      let parsedValue = formData.value;
      try {
        parsedValue = JSON.parse(formData.value);
      } catch {
        // Keep as string if not valid JSON
      }

      const response = await fetch(`${BaseUrl}/api/settings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: formData.key,
          value: parsedValue,
          description: formData.description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        error(result.message || "Failed to create setting");
        setErrors({ general: result.message });
      }
    } catch (err) {
      error("Failed to create setting");
      setErrors({ general: "Failed to create setting" });
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
            <h2 className="m-0 text-[15px] font-semibold text-white">Create Setting</h2>
          </div>

          <div className="px-6 py-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {errors?.general && (
                <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                  {errors.general}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Key</label>
                <input
                  type="text"
                  placeholder="Setting key (e.g., site_name, max_orders)"
                  value={formData.key}
                  onChange={(e) => handleChange("key", e.target.value)}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.key ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.key && <span className="text-xs text-red-500">{errors.key}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Value</label>
                <textarea
                  placeholder="Setting value (JSON or string)"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  rows={4}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.value ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.value && <span className="text-xs text-red-500">{errors.value}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13.5px] font-medium">Description</label>
                <textarea
                  placeholder="Setting description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={2}
                  className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                    errors?.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.description && <span className="text-xs text-red-500">{errors.description}</span>}
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
