import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AttendeeInsights from "../components/admin/AttendeeInsights";

export default function AttendeeInsightsPage() {
  return (
    <DashboardLayout>
      <AttendeeInsights />
    </DashboardLayout>
  );
}
