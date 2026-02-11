// App.tsx
import type { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterAll from "./pages/auth/RegisterM";
import Home from "./pages/Home";
import CreateChurch from "./pages/CreateChurch";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import PastorDashboard from "./pages/dashboard/PastorDashboard";
import MemberDashboard from "./pages/dashboard/MemberDashboard";
import SermonsDashboard from "./pages/dashboard/SermonsDashboard";
import ManageSermons from "./pages/dashboard/sermon/ManageSermons";
import AddRole from "./pages/role/AddRole";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection racine */}
        <Route path="/" element={<Navigate to="/home" />} />
        {/* Pages publiques */}
        <Route path="/home" element={<Home />} />
        <Route path="/registerall" element={<RegisterAll />} />
        <Route path="/create-church" element={<CreateChurch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboards protégés */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pastor"
          element={
            <ProtectedRoute requiredRole="PASTOR">
              <PastorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/member"
          element={
            <ProtectedRoute requiredRole="MEMBER">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
    <Route
  path="/dashboard/sermons"
  element={
    <ProtectedRoute requiredRole={["ADMIN", "PASTOR", "MEMBER"]}>
      <SermonsDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/sermons/manage"
  element={
    <ProtectedRoute requiredRole={["ADMIN", "PASTOR"]}>
      <ManageSermons />
    </ProtectedRoute>
  }
/>
        {/* Pages administratives protégées */}
        <Route
          path="/add-role"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AddRole />
            </ProtectedRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </Router>
  );
}
export default App;