import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Eligibility from "./pages/Eligibility";
import ContestRound from "./pages/ContestRound";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentProfile from "./pages/StudentProfile";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard with Sidebar */}
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="eligibility" element={<Eligibility />} />
          <Route path="contest" element={<ContestRound />} />
        </Route>

        {/* Other Dashboards */}
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Invalid Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;