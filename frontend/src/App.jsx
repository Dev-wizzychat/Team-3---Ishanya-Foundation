import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from './components/button';
import StudentDashboard from "./Pages/StudentDashboard";
import Home from "./Pages/HomePage";
import AdminDashboard from "./Pages/admindashboard";
import EducatorDashboard from "./Pages/EducatorDashboard";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import StudentList from "./Pages/StudentList"
import TeacherList from "./Pages/TeacherList"
import ProgramList from "./Pages/ProgramList"
import Approvalrequest from "./Pages/Approvalrequest"
import NewEnrollmentform from './Pages/NewEnrollmentform'
import EnrollForm from './Pages/EnrollForm'

//import { Link } from "react-router-dom";

import AddStudentForm from "./Pages/AddStudentForm";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
     <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/enroll" element={<EnrollForm />} />
        <Route path="/admin/enroll" element={<NewEnrollmentform />} />
        <Route path="/admin/student-list" element={<StudentList />} />
        <Route path="/admin/educator-list" element={<TeacherList />} />
        <Route path="/admin/program-list" element={<ProgramList />} />
        <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin/approval-requests" element={<Approvalrequest />} />
      </Routes>
    </Router>
  );
}

export default App;
