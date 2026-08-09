import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminSignUp = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", contact: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/super-admin/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (response.ok) {
        success("Super Admin account created");
        navigate("/super-admin/dashboard");
      } else {
        error(result.message);
      }
    } catch (err) {
      error("Failed to create super admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Create Super Admin Account</h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-2 rounded">
          {loading ? "Loading..." : "Create Super Admin"}
        </button>
      </form>
    </div>
  );
};
