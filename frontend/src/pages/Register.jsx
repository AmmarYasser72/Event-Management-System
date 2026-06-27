import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

  const onChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/user/register", form);

      if (!response.data?.success) {
        toast.error(response.data?.message || "Registration failed");
        return;
      }

      toast.success(response.data?.message || "Account created! Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#193f37,_#0a141d_45%,_#05070c)] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
            <Sparkles size={15} />
            <span>Build your EventX identity</span>
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-tight">Create one account for tickets, events, and admin tools.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
            Start as an attendee or an organizer. Your account will connect booking history, event publishing, and QR verification in one place.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#0e1726]/90 p-8 shadow-2xl shadow-black/35">
          <h2 className="text-3xl font-semibold">Create your account</h2>
          <p className="mt-2 text-sm text-white/60">Fill in your details and we&apos;ll take you straight to sign in.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm text-white/65">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="Your display name"
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                required
                minLength={6}
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
              <span>{loading ? "Creating account..." : "Create account"}</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-sm text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-emerald-200 underline decoration-emerald-200/30 underline-offset-4">
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
