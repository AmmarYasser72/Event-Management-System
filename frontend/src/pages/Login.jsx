import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/v1/user/login", form, {
        withCredentials: true,
      });

      if (data?.success) {
        toast.success(data.message || "Welcome back!");
        if (data.token) localStorage.setItem("userToken", JSON.stringify({ token: data.token }));
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        // route by role
        if (data.user?.role === "admin") nav("/adminDashBoard");
        else nav("/browse"); // or /userDashBoard if you prefer
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-gray-900 p-6 rounded-xl">
        <h1 className="text-xl font-semibold">Sign in</h1>

        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-gray-400">
          Don’t have an account? <a href="/register" className="underline">Create one</a>
        </p>
      </form>
    </div>
  );
}
