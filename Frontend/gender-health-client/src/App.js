import React from "react";
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

// Menstrual
import MenstrualTracker from "./features/menstrual/pages/MenstrualTracker";

// Consultation
import ConsultationBooking from './features/consultation/page/ConsultationBooking';
import Appointments from './features/consultation/page/Appointments';
import BookAppointment from './features/consultation/page/BookAppointment';
import BookingSuccess from './features/consultation/page/BookingSuccess';
import Feedback from './features/consultation/page/Feedback';

// Admin
import RequireAuth from "./routes/RequireAuth";
import ManagementWelcome from "./features/admin/ManagementWelcome";
import AdminDashboard from "./features/admin/AdminDashboard";
import UserManagement from "./features/admin/UserManagerment";

// Consultant
import WorkSlotPicker from "./features/consultant/WorkSlotPicker";
import ConsultantAppointmentHistory from "./features/consultant/ConsultantAppointmentHistory";

// Testing
import Payments from "./features/testing/pages/Payments";
import Packages from "./features/testing/pages/Packages";
import PaymentSuccess from "./features/testing/pages/PaymentSuccess";
import PaymentPageForPackage from "./features/testing/pages/PaymentsPackage";
import StaffPage from "./features/testing/pages/staff";

function App() {
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

          {/* Menstrual tracking */}
          <Route path="/menstrual/:userId" element={<MenstrualTracker />} />

          {/* Consultation routes */}
          <Route path="/consultation" element={<ConsultationBooking />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/bookappointment" element={<BookAppointment />} />
          <Route path="/bookingsuccess" element={<BookingSuccess />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* Testing routes */}
          <Route path="/package" element={<Packages />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/payment-package" element={<PaymentPageForPackage />} />
          <Route path="/staff" element={<StaffPage />} />

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

          {/* Catch-all route */}
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
