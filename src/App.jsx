import  Timer  from './ components/timer/Timer';
import HomePage from './ components/authentication/HomePage'
import { Navigate, Route, Routes } from "react-router-dom";
import {AuthContextProvider} from "./ components/authentication/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import SecondPage from './ components/second_page/SecondPage';

export default function App() {
  let isAuthenticated = localStorage.getItem("userProfile");
  return (
    <>
        <AuthContextProvider>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <ProtectedRoute accessBy="authenticated">
                  <DashboardLayout />
                </ProtectedRoute>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          </Routes>
        </AuthContextProvider>
    </>
  );
}
function DashboardLayout() {
  return (
    <div>
      <Timer />
      <SecondPage />
    </div>
    );
}