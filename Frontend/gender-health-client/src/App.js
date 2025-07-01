import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";


// Auth
import Login from "./features/auth/pages/LoginPage";
import Register from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import LogoutPage from "./features/auth/pages/LogoutPage";
import LoginManagement from "./features/auth/pages/LoginManagement";
import LogoutManagement from "./features/auth/pages/LogoutManagement";

// Home
import HomePage from "./features/home/pages/HomePage";
import BlogDetailSession from "./features/home/sessions/BlogDetailSession";
import DoctorDetail from "./features/home/sessions/DoctorDetail";

// Menstrual
import MenstrualTracker from "./features/menstrual/pages/MenstrualTracker";

// Consultation
import ConsultationBooking from './features/consultation/page/ConsultationBooking';
import Appointments from './features/consultation/page/Appointments';
import BookAppointment from './features/consultation/page/BookAppointment';
import BookingSuccess from './features/consultation/page/BookingSuccess';
import Feedback from './features/consultation/page/Feedback';
import HealthcareWebsite_consultation from "./features/consultation/page/HealthcareWebsite_consultation.jsx";

// Admin
import RequireAuth from "./routes/RequireAuth";
import ManagementWelcome from "./features/admin/ManagementWelcome";
import AdminDashboard from "./features/admin/AdminDashboard";
import UserManagement from "./features/admin/UserManagerment";
import ConsultantManagement from "./features/admin/ConsultantManagement";
import AdminFeedback from "./features/admin/AdminFeedback";
import StaffsManagement from "./features/admin/StaffsManagement.jsx";
import AdminServices from "./features/admin/AdminServices.jsx";

// Consultant
import WorkSlotPicker from "./features/consultant/WorkSlotPicker";
import ConsultantAppointmentHistory from "./features/consultant/ConsultantAppointmentHistory";
import ConsultantFeedback from "./features/consultant/ConsultantFeedback";
import ConsultantDashboard from "./features/consultant/ConsultantDashboard.jsx";

// Testing
import Payments from "./features/testing/pages/Payments";
import Packages from "./features/testing/pages/Packages";
import PaymentSuccess from "./features/testing/pages/PaymentSuccess";
import PaymentPageForPackage from "./features/testing/pages/PaymentsPackage";
import StaffPage from "./features/staff/staff";
import Invoices from "./features/testing/pages/Invoices";
import CustomerTestResult from "./features/testing/pages/CustomerTestResult";
import CustomerInvoicesHistory from "./features/testing/pages/CustomerInvoicesHistory";
import CustomerTable from "./features/testing/pages/CustomerInfo.jsx";
import VnpayReturnPage from "./features/testing/pages/VnpayReturnPage.jsx";

// Staff
import StaffAppointmentManagement from "./features/staff/staffAppointment";
import StafftDashboard from "./features/staff/staffDashboard";
import StaffResult from "./features/staff/staffResult";

function App() {
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.error("🛑 Lỗi toàn cục:", message, error);
    };

    window.addEventListener("unhandledrejection", function (event) {
      console.error("🛑 Promise lỗi chưa xử lý:", event.reason);
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/loginmanagement" element={<LoginManagement />} />
          <Route path="/logoutmanagement" element={<LogoutManagement />} />

          {/* Main Page */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogDetailSession />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />

          {/* Menstrual tracking */}
          <Route path="/menstrual/:userId" element={<MenstrualTracker />} />

          {/* Consultation routes */}
          <Route path="/consultation" element={<HealthcareWebsite_consultation />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/bookappointment" element={<BookAppointment />} />
          <Route path="/bookingsuccess" element={<BookingSuccess />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* Testing routes */}
          <Route path="/package" element={<Packages />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payment-package" element={<PaymentPageForPackage />} />
          <Route path="/customer-results" element={<CustomerTestResult />} />
          <Route path="/customer-invoices" element={<CustomerInvoicesHistory />} />
          <Route path="/customer-info" element={<CustomerTable />} />
          <Route path="/vnpay-return" element={<VnpayReturnPage />} />
          {/* Staff routes */}
          <Route path="/staff/invoices" element={
            <RequireAuth allowedRoles={['staff']}>
              <StaffPage />
            </RequireAuth>
          } />
          <Route path="/staff/appointments" element={
            <RequireAuth allowedRoles={['staff']}>
              <StaffAppointmentManagement />
            </RequireAuth>
          } />
          <Route path="/staff/dashboard" element={
            <RequireAuth allowedRoles={['staff']}>
              <StafftDashboard />
            </RequireAuth>
          } />
          <Route path="/staff/results" element={
            <RequireAuth allowedRoles={['staff']}>
              <StaffResult />
            </RequireAuth>
          } />

          {/* Consultant routes */}
          <Route path="/consultant/workslots" element={
            <RequireAuth allowedRoles={['consultant']}>
              <WorkSlotPicker />
            </RequireAuth>
          } />
          <Route path="/consultant/appointments" element={
            <RequireAuth allowedRoles={['consultant']}>
              <ConsultantAppointmentHistory />
            </RequireAuth>
          } />
          <Route path="/consultant/feedback" element={
            <RequireAuth allowedRoles={['consultant']}>
              <ConsultantFeedback />
            </RequireAuth>
          } />
          <Route path="/consultant/dashboard" element={
            <RequireAuth allowedRoles={['consultant']}>
              <ConsultantDashboard />
            </RequireAuth>
          } />
          

          {/* Admin routes */}
          <Route path="/management/welcome" element={
            <RequireAuth allowedRoles={['admin', 'staff', 'consultant']}>
              <ManagementWelcome />
            </RequireAuth>
          } />
          <Route path="/admin/dashboard" element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminDashboard />
            </RequireAuth>
          } />
          <Route path="/admin/users" element={
            <RequireAuth allowedRoles={['admin']}>
              <UserManagement />
            </RequireAuth>
          } />
          <Route path="/admin/consultants" element={
            <RequireAuth allowedRoles={['admin']}>
              <ConsultantManagement />
            </RequireAuth>
          } />
          <Route path="/admin/feedbacks" element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminFeedback />
            </RequireAuth>
          } />
          <Route path="/admin/staffs" element={
            <RequireAuth allowedRoles={['admin']}>
              <StaffsManagement />
            </RequireAuth>
          } />
          <Route path="/admin/services" element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminServices />
            </RequireAuth>
          } />


          {/* Catch-all route */}
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
