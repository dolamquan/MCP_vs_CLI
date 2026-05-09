import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { AnalyzePage } from "./components/AnalyzePage";
import { ComparePage } from "./components/ComparePage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import { InfoPage } from "./components/InfoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/forgot-password",
    element: (
      <InfoPage
        title="Password Recovery"
        description="Authentication flows are still demo-only in this frontend, so password reset is not wired up yet."
      />
    ),
  },
  {
    path: "/terms",
    element: (
      <InfoPage
        title="Terms of Service"
        description="This placeholder page keeps navigation complete until legal copy is added."
      />
    ),
  },
  {
    path: "/privacy",
    element: (
      <InfoPage
        title="Privacy Policy"
        description="This placeholder page keeps the signup flow complete until a real privacy policy is added."
      />
    ),
  },
  {
    path: "/dashboard",
    element: <DashboardLayout><Dashboard /></DashboardLayout>,
  },
  {
    path: "/dashboard/analyze",
    element: <DashboardLayout><AnalyzePage /></DashboardLayout>,
  },
  {
    path: "/dashboard/compare",
    element: <DashboardLayout><ComparePage /></DashboardLayout>,
  },
  {
    path: "/dashboard/history",
    element: <DashboardLayout><HistoryPage /></DashboardLayout>,
  },
  {
    path: "/dashboard/settings",
    element: <DashboardLayout><SettingsPage /></DashboardLayout>,
  },
  {
    path: "*",
    element: (
      <InfoPage
        title="Page Not Found"
        description="That route does not exist in the frontend app yet."
      />
    ),
  },
]);
