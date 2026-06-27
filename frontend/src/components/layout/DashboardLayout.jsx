import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { api, clearStoredAuth } from "../../lib/api";

const Item = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition
       ${isActive ? "bg-black/10 dark:bg-white/10 font-semibold" : "hover:bg-black/5 dark:hover:bg-white/5"}`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{children}</span>
  </NavLink>
);

export default function DashboardLayout({ children }) {
  const nav = useNavigate();
  const { theme, toggle } = useTheme();

  async function logout() {
    try {
      await api.get("/user/logout").catch(() => {});
    } catch {}
    clearStoredAuth();
    nav("/login", { replace: true });
  }

  // read admin name for header welcome
  let adminName = "Admin";
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.username) adminName = u.username;
    else if (u?.email) adminName = u.email?.split("@")[0] || "Admin";
  } catch {}

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0c0c0d] dark:bg-[#0c0c0d] dark:text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 p-4">
          <div className="rounded-2xl bg-white dark:bg-[#111214] p-4 shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 grid place-items-center text-white font-bold">E</div>
              <div className="font-semibold text-lg">EventX <span className="text-xs opacity-60">studio</span></div>
            </div>

            <button
              onClick={() => nav("/addnewevent")}
              className="mb-4 w-full rounded-xl bg-emerald-600 text-white py-2 text-sm hover:bg-emerald-700"
            >
              + Add Quick Event
            </button>

            <div className="text-xs uppercase opacity-60 mb-2">Main Navigation</div>
            <div className="space-y-1 mb-4">
              <Item to="/adminDashBoard" icon="🏠">Dashboard</Item>
              <Item to="/manage-events" icon="🗂️">Manage Events</Item>
              <Item to="/attendee-insights" icon="👥">Attendee Insights</Item>
              <Item to="/analytics" icon="📈">Analytics & Reports</Item>
            </div>

            <div className="text-xs uppercase opacity-60 mb-2">Support & Management</div>
            <div className="space-y-1 mb-4">
              <Item to="/notifications" icon="🔔">Notifications</Item>
              <Item to="/settings" icon="⚙️">Settings</Item>
            </div>

            <div className="text-xs uppercase opacity-60 mb-2">Account</div>
            <div className="space-y-1">
              <button
                onClick={logout}
                className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span>🚪</span> <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {/* Header bar like mock */}
          <div className="rounded-2xl bg-white dark:bg-[#111214] shadow p-4 mb-6">
            <div className="flex items-center gap-4">
              <img alt="" className="h-10 w-10 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="text-lg font-semibold">Welcome {adminName}</div>
                <div className="text-xs opacity-60">System Administrator</div>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 bg-black/5 dark:bg-white/10">
                <span className="opacity-50">🔎</span>
                <input className="bg-transparent outline-none text-sm w-56" placeholder="Search ..." />
              </div>

              {/* Theme toggle + profile + logout */}
              <button onClick={toggle} className="rounded-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
              </button>
              <button onClick={logout} className="rounded-full px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10" title="Logout">
                ⏻
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
