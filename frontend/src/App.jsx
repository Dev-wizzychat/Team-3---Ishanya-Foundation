import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from './components/button';
import EnrollForm from './Pages/EnrollForm'
import StudentDashboard from "./Pages/StudentDashboard";
import Home from "./Pages/HomePage";
import AdminDashboard from "./Pages/admindashboard";
import EducatorDashboard from "./Pages/EducatorDashboard";
import LoginPage from "./Pages/LoginPage";
import StudentList from  "./Pages/StudentList"
import TeacherList from  "./Pages/TeacherList"
import ProgramList from  "./Pages/ProgramList"
//import { Link } from "react-router-dom";

import AddStudentForm from "./Pages/AddStudentForm";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
     <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/enroll" element={<EnrollForm />} />
         <Route path="/admin/student-list" element={<StudentList />} />
         <Route path="/admin/educator-list" element={<TeacherList />} />
         <Route path="/admin/program-list" element={<ProgramList />} />    
       <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;
