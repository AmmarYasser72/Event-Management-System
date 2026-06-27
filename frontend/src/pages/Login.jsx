import React, { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api, setStoredAuth } from "../lib/api";

export default function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  const onChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const { data } = await api.post("/user/login", form);

      if (!data?.success) {
        toast.error(data?.message || "Login failed");
        return;
      }

      setStoredAuth({ token: data.token, user: data.user });
      toast.success(data.message || "Welcome back!");
      nav(data.user?.role === "admin" ? "/adminDashBoard" : "/browse");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#14324b,_#09111d_45%,_#05070c)] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">EventX Studio</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Sign in and get back to your events.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
            Manage bookings, publish events, scan QR codes, and keep everything moving from one clean dashboard.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm text-white/55">For attendees</div>
              <div className="mt-2 text-xl font-medium">See bookings and ticket QR codes instantly.</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm text-white/55">For admins</div>
              <div className="mt-2 text-xl font-medium">Create events, view analytics, and verify entries.</div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#0e1726]/90 p-8 shadow-2xl shadow-black/35">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm text-white/60">Use the same account you created for EventX Studio.</p>
            </div>
            <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 p-3 text-emerald-200">
              <ShieldCheck size={18} />
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm text-white/65">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/65">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/65">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-4 py-3 text-sm font-semibold text-[#07111e] disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-emerald-200 underline decoration-emerald-200/30 underline-offset-4">
                Create one
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
