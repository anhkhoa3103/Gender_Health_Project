import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Auth
import Login from "./features/auth/pages/LoginPage";
import Register from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import LogoutPage from "./features/auth/pages/LogoutPage";

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

function App() {
  return (
    <GoogleOAuthProvider clientId="866435222285-ifhi75knei1ai0450jlph4ui9s2slmu4.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />

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
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
