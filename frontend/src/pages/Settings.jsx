import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useTheme } from "../context/ThemeProvider";

export default function Settings() {
  const { theme, toggle } = useTheme();
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white dark:bg-[#111214] p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        <div className="space-y-6">
          <section>
            <h3 className="font-medium mb-2">Appearance</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">Current theme:</span>
              <span className="text-sm font-semibold">{theme}</span>
              <button onClick={toggle} className="ml-3 rounded-lg bg-black/5 dark:bg-white/10 px-3 py-1 text-sm">
                Toggle Theme
              </button>
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-2">Account</h3>
            <div className="text-sm opacity-80">Name: {user?.username || "-"}</div>
            <div className="text-sm opacity-80">Email: {user?.email || "-"}</div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
