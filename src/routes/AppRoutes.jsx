import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import Root from "../pages/Root";
import Email from "../components/Auth/Signup/Email";
import VerificationCode from "../components/Auth/Signup/VerificationCode";
import PersonalInformation from "../components/Auth/Signup/PersonalInformation";
import Login from "../components/Auth/Login/Login";
import ServicesPage from "../pages/ServicesPage";
import AddNewServicePage from "../pages/AddNewServicePage";
import StatisticsPage from "../pages/StatisticsPage";
import EmployeesPage from "../pages/EmployeesPage";
import AddEmployeePage from "../pages/AddEmployeePage";
import BookingsPage from "../pages/BookingsPage";
import Protected from "../components/Protected/Protected";
import BusinessProfilePage from "../pages/BusinessProfilePage";
import ChatPage from "@/pages/ChatPage";
import NotFound from "@/components/NotFound/NotFound";
import DiaryPage from "@/pages/DiaryPage";
import EmployeeSetPasswordPage from "@/pages/EmployeeSetPasswordPage";
import AddAppointmentPage from "@/pages/AddAppointmentPage";
import EditServicePage from "@/pages/EditServicePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Login /> },
      {
        path: "/signup",
        element: <Email />,
      },
      {
        path: "/verificationCode",
        element: <Protected Component={VerificationCode} />,
      },
      {
        path: "/personalInformation",
        element: <Protected Component={PersonalInformation} />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Protected Component={BookingsPage} />,
      },
      {
        path: "/statistics",
        element: <Protected Component={StatisticsPage} />,
      },
      {
        path: "/services",
        element: <Protected Component={ServicesPage} />,
      },
      {
        path: "/newService",
        element: <Protected Component={AddNewServicePage} />,
      },
      {
        path: "/service/:serviceId/edit",
        element: <Protected Component={EditServicePage} />,
      },
      {
        path: "/employees",
        element: <Protected Component={EmployeesPage} />,
      },
      {
        path: "/addEmployee",
        element: <Protected Component={AddEmployeePage} />,
      },
      {
        path: "/profile",
        element: <Protected Component={BusinessProfilePage} />,
      },
      {
        path: "/chat",
        element: <Protected Component={ChatPage} />,
      },
      {
        path: "/diary",
        element: <Protected Component={DiaryPage} />,
      },
      {
        path: "/addAppointment",
        element: <Protected Component={AddAppointmentPage} />,
      },
      {
        path: "/setup-password",
        element: <EmployeeSetPasswordPage />,
      },
      {
        path: "*",
        element: <Protected Component={NotFound} />,
      },
    ],
  },
]);
