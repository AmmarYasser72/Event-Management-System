import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashBoard from "../components/adminDashBoard";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
      <AdminDashBoard />
    </DashboardLayout>
  );
}