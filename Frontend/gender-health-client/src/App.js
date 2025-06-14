import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./features/auth/pages/LoginPage";
import Register from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import MenstrualTracker from "./features/menstrual/pages/MenstrualTracker";
import LogoutPage from "./features/auth/pages/LogoutPage";
import HomePage from "./features/home/pages/HomePage";
import Layout from "./layouts/layout";
import Payments from "./pages/Payments";
import Packages from "./pages/Packages";
import PaymentConfirm from "./pages/PaymentConfirm";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <GoogleOAuthProvider clientId="866435222285-ifhi75knei1ai0450jlph4ui9s2slmu4.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Pages */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/package" element={<Packages />} />
            <Route path="/payment-confirm" element={<PaymentConfirm/>}/>
            <Route path="/PaymentPage" element={<PaymentPage/>}/>
          </Route>

          {/* Menstrual tracking */}
          <Route path="/menstrual/:userId" element={<MenstrualTracker />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
