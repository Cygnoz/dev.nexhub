import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AccountantRoutes from "./routes/AccountantRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import InventoryRoutes from "./routes/InventoryRoutes";
import PurchaseRoutes from "./routes/PurchaseRoutes";
import SalesRoutes from "./routes/SalesRoutes";
import ExpenseRoutes from "./routes/ExpenseRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import SupplierRoutes from "./routes/SupplierRoutes";
import SettingsRoutes from "./routes/SettingsRoutes";
import LayoutSkeleton from "./Components/skeleton/LayoutSkeleton";
import { OrganizationProvider } from "./context/OrganizationContext";
import ReportsRoutes from "./routes/ReportsRoutes";
import ReportsLayout from "./layout/ReportsLayout";
import Pos from "./features/pos/Pos";
import PosReceipt from "./features/pos/PosReceipt";

// Lazy imports of components
const Login = lazy(() => import("./features/login/Login"));
const Otp = lazy(() => import("./features/login/Otp"));
const Layout = lazy(() => import("./layout/Layout"));
const SettingsLayout = lazy(() => import("./layout/SettingsLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ErrorPage = lazy(() => import("./pages/Error"));
const LandingHome = lazy(() => import("./pages/LandingPage/LandingHome"));

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const routes = [
    {
      path: "/",
      element: isAuthenticated ? (
        <Layout children />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: "/", element: <Dashboard /> },
        ...AccountantRoutes,
        ...CustomerRoutes,
        ...InventoryRoutes,
        ...PurchaseRoutes,
        ...SalesRoutes,
        ...ExpenseRoutes,
        ...StaffRoutes,
        ...SupplierRoutes,
      ],
    },
    {
      path: "/",
      element: isAuthenticated ? (
        <SettingsLayout children />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: "", element: <Navigate to="/login" replace /> },
        ...SettingsRoutes,
      ],
    },
    {
      path: "/landing",
      element: isAuthenticated ? (
        <LandingHome />
      ) : (
        <Navigate to="/login" replace />
      ),
    }, 
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/pos",
      element: <Pos />,
    },
    {
      path: "/posreciept",
      element: <PosReceipt />,
    },
    {
      path: "/otp",
      element: <Otp />,
    }, {
      path: "/",
      element: isAuthenticated ? (
        <ReportsLayout children />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: "", element: <Navigate to="/login" replace /> },
        ...ReportsRoutes,
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  const element = useRoutes(routes);

  return (
    <OrganizationProvider>
      <Suspense
        fallback={
          <div>
            <LayoutSkeleton />
          </div>
        }
      >
        {element}
      </Suspense>
    </OrganizationProvider>
  );
};

export default App;
