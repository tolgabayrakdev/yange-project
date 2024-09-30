import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const HomePage = lazy(() => import('./pages/Home'));
const SignInPage = lazy(() => import('./pages/auth/SignIn'));
const SignUpPage = lazy(() => import('./pages/auth/SignUp'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPassword'));

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardIndex = lazy(() => import('./pages/dashboard/Index'));
const DashboardProfil = lazy(()=> import('./pages/dashboard/Profile'));


const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/sign-in",
        element: <SignInPage />
    },
    {
        path: "/sign-up",
        element: <SignUpPage />
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardIndex />, index: true },
            { path: "profile", element: <DashboardProfil /> }
        ]
    }
]);

export default routes;