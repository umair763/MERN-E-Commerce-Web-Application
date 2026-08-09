import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react";
import { useToast } from "../common";
import { UiDelete } from "../common/ui.delete";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_ADDRESS_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export const AddressesPage = () => {
  const { success, error } = useToast();
  const [addresses, setAddresses] = useState([]);

  // ADD/EDIT STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // DELETE STATE
  const [deletingAddress, setDeletingAddress] = useState(null);

  // ==========================
  // GET ALL ADDRESSES
  // ==========================

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/addresses`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setAddresses(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ==========================
  // ADD ADDRESS
  // ==========================

  const openAdd = () => {
    setForm(EMPTY_ADDRESS_FORM);
    setErrors({});
    setIsAddOpen(true);
  };

  const openEdit = (address) => {
    setEditingAddress(address);
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      isDefault: address.isDefault || false,
    });
    setErrors({});
  };

  const closeForm = () => {
    setIsAddOpen(false);
    setEditingAddress(null);
    setForm(EMPTY_ADDRESS_FORM);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    let errors = {};

    if (!form.fullName) errors.fullName = "Full name is required";
    if (!form.phone) errors.phone = "Phone number is required";
    if (!form.addressLine1) errors.addressLine1 = "Address line 1 is required";
    if (!form.city) errors.city = "City is required";
    if (!form.state) errors.state = "State is required";
    if (!form.postalCode) errors.postalCode = "Postal code is required";
    if (!form.country) errors.country = "Country is required";

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const method = editingAddress ? "PATCH" : "POST";
      const url = editingAddress
        ? `${BaseUrl}/api/addresses/${editingAddress._id}`
        : `${BaseUrl}/api/addresses`;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchAddresses();
        success(editingAddress ? "Address updated successfully!" : "Address added successfully!");
        closeForm();
      } else {
        error(result.message || "Failed to save address");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // DELETE ADDRESS
  // ==========================

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/addresses/${deletingAddress._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchAddresses();
        success("Address deleted successfully!");
      } else {
        error("Failed to delete address");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingAddress(null);
  };

  // ==========================
  // SET DEFAULT ADDRESS
  // ==========================

  const setDefault = async (address) => {
    try {
      const response = await fetch(`${BaseUrl}/api/addresses/${address._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...address, isDefault: true }),
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Addresses"]}
          title="Addresses"
          subtitle="Manage your shipping addresses"
          buttonLabel="Add Address"
          onButtonClick={openAdd}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {(isAddOpen || editingAddress) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#4F30A9] px-6 py-4">
              <h2 className="text-[15px] font-semibold text-white">
                {editingAddress ? "Edit Address" : "Add Address"}
              </h2>
              <button
                onClick={closeForm}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.fullName && (
                    <span className="text-xs text-red-500">{errors.fullName}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.phone && (
                    <span className="text-xs text-red-500">{errors.phone}</span>
                  )}
                </div>

                {/* Address Line 1 */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13.5px] font-medium">Address Line 1</label>
                  <input
                    type="text"
                    placeholder="Street address, apartment, etc."
                    value={form.addressLine1}
                    onChange={(e) => handleChange("addressLine1", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.addressLine1 ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.addressLine1 && (
                    <span className="text-xs text-red-500">{errors.addressLine1}</span>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[13.5px] font-medium">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    value={form.addressLine2}
                    onChange={(e) => handleChange("addressLine2", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.city && (
                    <span className="text-xs text-red-500">{errors.city}</span>
                  )}
                </div>

                {/* State */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">State</label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.state && (
                    <span className="text-xs text-red-500">{errors.state}</span>
                  )}
                </div>

                {/* Postal Code */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Postal Code</label>
                  <input
                    type="text"
                    placeholder="Enter postal code"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.postalCode && (
                    <span className="text-xs text-red-500">{errors.postalCode}</span>
                  )}
                </div>

                {/* Country */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13.5px] font-medium">Country</label>
                  <input
                    type="text"
                    placeholder="Enter country"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className={`rounded-lg border px-4 py-2 text-sm outline-none ${
                      errors?.country ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors?.country && (
                    <span className="text-xs text-red-500">{errors.country}</span>
                  )}
                </div>

                {/* Default Address */}
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={form.isDefault}
                    onChange={(e) => handleChange("isDefault", e.target.checked)}
                    className="w-4 h-4 text-[#4F30A9] border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-6" />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-lg bg-[#4F30A9] px-5 py-2 text-sm text-white disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ml-3 mr-3">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <MapPin size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No addresses found</h3>
            <p className="text-gray-500">Add a shipping address to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white rounded-xl border p-6 relative ${
                  address.isDefault ? "border-[#4F30A9] ring-2 ring-[#4F30A9]/20" : "border-gray-200"
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#4F30A9] text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{address.fullName}</h3>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(address)}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 transition"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  {!address.isDefault && (
                    <button
                      onClick={() => setDefault(address)}
                      className="flex-1 border border-[#4F30A9] text-[#4F30A9] rounded-lg py-2 text-sm hover:bg-[#4F30A9]/5 transition"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingAddress(address)}
                    className="w-10 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deletingAddress && (
        <UiDelete
          open={!!deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Address"
          itemType="address"
          itemName={deletingAddress.fullName}
        />
      )}
    </div>
  );
};