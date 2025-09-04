import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/v1/user/register", form, { withCredentials: true });
      if ((res.status === 200 || res.status === 201) && res.data?.success) {
        toast.success(res.data?.message || "Account created! Please sign in.");
        navigate("/login", { replace: true });
      } else {
        toast.success("Account created! Please sign in.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-gray-900 p-6 rounded-xl">
        <h1 className="text-xl font-semibold">Create an account</h1>
        <div><label className="block text-sm text-gray-300">Username</label>
          <input name="username" value={form.username} onChange={onChange} className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2" required />
        </div>
        <div><label className="block text-sm text-gray-300">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2" required />
        </div>
        <div><label className="block text-sm text-gray-300">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2" required minLength={6} />
        </div>
        <div><label className="block text-sm text-gray-300">Role</label>
          <select name="role" value={form.role} onChange={onChange} className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 p-2">
            <option value="user">User</option><option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2">
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="text-xs text-gray-400">Already have an account? <a href="/login" className="underline">Sign in</a></p>
      </form>
    </div>
  );
}
