import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { User, Mail, Phone, Lock, Save, LogOut } from "lucide-react";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_PROFILE_FORM = {
  name: "",
  email: "",
  contact: "",
};

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const ProfilePage = () => {
  const { success, error } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // PROFILE UPDATE STATES
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE_FORM);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // PASSWORD CHANGE STATES
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ==========================
  // GET USER PROFILE
  // ==========================

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseUrl}/api/auth/profile`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.data);
        setProfileForm({
          name: result.data.name || "",
          email: result.data.email || "",
          contact: result.data.contact || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ==========================
  // UPDATE PROFILE
  // ==========================

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async () => {
    let errors = {};

    if (!profileForm.name) errors.name = "Name is required";
    if (!profileForm.email) errors.email = "Email is required";
    if (!profileForm.contact) errors.contact = "Contact is required";

    if (Object.keys(errors).length) {
      setProfileErrors(errors);
      return;
    }

    try {
      setProfileLoading(true);

      const response = await fetch(`${BaseUrl}/api/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchProfile();
        success("Profile updated successfully!");
      } else {
        error(result.message || "Failed to update profile");
        setProfileErrors({ general: result.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
    }
  };

  // ==========================
  // CHANGE PASSWORD
  // ==========================

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSubmit = async () => {
    let errors = {};

    if (!passwordForm.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) errors.newPassword = "New password is required";
    if (passwordForm.newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
    if (!passwordForm.confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await fetch(`${BaseUrl}/api/auth/password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPasswordForm(EMPTY_PASSWORD_FORM);
        setPasswordErrors({});
        success("Password changed successfully! Please log in again.");
        // Redirect to login or logout
        window.location.href = "/signin";
      } else {
        error(result.message || "Failed to change password");
        setPasswordErrors({ general: result.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = async () => {
    try {
      await fetch(`${BaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/signin";
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Profile"]}
          title="Profile & Settings"
          subtitle="Manage your account settings"
          showButton={false}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "profile"
                  ? "text-[#4F30A9] border-b-2 border-[#4F30A9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "security"
                  ? "text-[#4F30A9] border-b-2 border-[#4F30A9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

                {profileErrors?.general && (
                  <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                    {profileErrors.general}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={profileForm.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          profileErrors?.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {profileErrors?.name && (
                      <span className="text-xs text-red-500">{profileErrors.name}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={profileForm.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          profileErrors?.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {profileErrors?.email && (
                      <span className="text-xs text-red-500">{profileErrors.email}</span>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={profileForm.contact}
                        onChange={(e) => handleProfileChange("contact", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          profileErrors?.contact ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {profileErrors?.contact && (
                      <span className="text-xs text-red-500">{profileErrors.contact}</span>
                    )}
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                    <button
                      onClick={handleProfileSubmit}
                      disabled={profileLoading}
                      className="flex items-center gap-2 bg-[#4F30A9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d01d2] transition disabled:opacity-50"
                    >
                      <Save size={16} />
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>

                {passwordErrors?.general && (
                  <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                    {passwordErrors.general}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter your current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          passwordErrors?.currentPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors?.currentPassword && (
                      <span className="text-xs text-red-500">{passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Enter your new password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          passwordErrors?.newPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors?.newPassword && (
                      <span className="text-xs text-red-500">{passwordErrors.newPassword}</span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-medium">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Confirm your new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className={`w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none ${
                          passwordErrors?.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {passwordErrors?.confirmPassword && (
                      <span className="text-xs text-red-500">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex justify-end">
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={passwordLoading}
                      className="flex items-center gap-2 bg-[#4F30A9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d01d2] transition disabled:opacity-50"
                    >
                      <Lock size={16} />
                      {passwordLoading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};