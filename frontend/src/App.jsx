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
import RegisterPage from "./Pages/RegisterPage";
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
      {/*  <Route path = "/admin/student-view" element = {<StudentListPage />} />*?}
        <Route path = "./admin/student/view/add" element = {<AddStudentForm />}/>
              { /*<Route path="/search" element={<Search />} />}*/}
       <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;
