import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Home,
  Search,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Plus,
  ChevronLeft,
  Eye,
  Edit,
  Trash2,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddStudent from "./NewEnrollmentform";
// import { useNavigate } from "react-router-dom";
const StudentListPage = () => {
  const navigate = useNavigate();
  // States
  // const [students, setStudents] = useState([]);
  const [selectedStudentForAttendance, setSelectedStudentForAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ student_id: "", session_id: "", status: "present" });
  const [selectedStudentForAssessment, setSelectedStudentForAssessment] = useState(null);
  const [assessmentData, setAssessmentData] = useState({
    student_id: "",
    session_id: "",
    marks_obtained: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [students, setStudents] = useState([true]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    studentId: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [newStudent, setNewStudent] = useState({
    student_id: "",
    name: "",
    gender: "",
    father_name: "",
    mother_name: "",
    student_email: "",
    parent_email: "",
    contact_number: "",
    alt_contact_number: "",
    address: "",
    pincode: "",
    dob: "",
    blood_group: "",
    comorbidity: "",
    udid: "",
    diagnosis: "",
    allergies: "",
    days_attending: [],
    available_from: "",
    available_until: "",
  });
  //have to make this dynamic

  // Sample admin data
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    lastLogin: "Today at 09:15 AM",
    joinDate: "Jan 15, 2023",
  };
  //have to make this dynamic

  // Sample data for notifications
  const notifications = [
    { id: 1, text: "New student registered", time: "5 min ago", read: false },
    { id: 2, text: "Report generated", time: "1 hour ago", read: false },
    {
      id: 3,
      text: "System update completed",
      time: "3 hours ago",
      read: false,
    },
  ];
  //make this dynamic
  const [notificationsList, setNotificationsList] = useState(notifications);

  // Initialize student data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/all-students");
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  //add API
  // Filter students based on search criteria
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attendance Data:", attendanceData);
      await axios.post("http://127.0.0.1:8000/mark-session-attendance/", {
        student_id: attendanceData.student_id,
        session_id: attendanceData.session_id,
        status: attendanceData.status,

      });

      alert("Attendance marked successfully!");
      setSelectedStudentForAttendance(null);
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance. Please try again.");
    }
  };
  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Assessment Data:", assessmentData);
      await axios.post("http://127.0.0.1:8000/mark-assessment/", {
        student_id: assessmentData.student_id,
        session_id: assessmentData.session_id,
        marks_obtained: parseFloat(assessmentData.marks_obtained),
      });
      alert("Assessment marked successfully!");
      setSelectedStudentForAssessment(null); // Close the form
    } catch (err) {
      console.error("Error marking assessment:", err);
      alert("Failed to mark assessment. Please try again.");
    }
  };
  const filteredStudents =
    searchQuery.trim() === ""
      ? students
      : students.filter((student) => {
        const value = student[searchBy]?.toLowerCase() || "";
        return value.includes(searchQuery.toLowerCase());
      });

  // Toggle functions
  const toggleSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions);
    if (showNotifications) setShowNotifications(false);
    if (showProfile) setShowProfile(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showSearchOptions) setShowSearchOptions(false);
    if (showProfile) setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (showSearchOptions) setShowSearchOptions(false);
    if (showNotifications) setShowNotifications(false);
  };

  // Handler functions
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowSearchOptions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsAddingStudent(false);
    setIsEditingStudent(false);
    setDeleteConfirm({ show: false, studentId: null });
    navigate(`/admin/student-details/${student.student_id}`);
  };

  const handleCloseStudentView = () => {
    setSelectedStudent(null);
    setIsEditingStudent(false);
  };

  const handleAddStudent = () => {
    setIsAddingStudent(true);
    setSelectedStudent(null);
    setIsEditingStudent(false);
    setFormErrors({});
    setNewStudent({
      student_id: "",
      name: "",
      gender: "",
      father_name: "",
      mother_name: "",
      student_email: "",
      parent_email: "",
      contact_number: "",
      alt_contact_number: "",
      address: "",
      pincode: "",
      dob: "",
      blood_group: "",
      comorbidity: "",
      udid: "",
      diagnosis: "",
      allergies: "",
      days_attending: [],
      available_from: "",
      available_until: "",
    });
  };

  const handleCancelAddStudent = () => {
    setIsAddingStudent(false);
    setFormErrors({});
    setNewStudent({
      id: "",
      name: "",
      city: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      enrollmentDate: "",
      program: "",
      semester: "",
      gpa: "",
      courses: [],
      address: "",
    });
  };

  const handleEditStudent = (student) => {
    setIsEditingStudent(true);
    setSelectedStudent(student);
    setIsAddingStudent(false);
    setFormErrors({});
    setNewStudent({ ...student });
    setEditingStudentId(student.id);
  };

  const handleCancelEditStudent = () => {
    setIsEditingStudent(false);
    setFormErrors({});
    setNewStudent({
      id: "",
      name: "",
      city: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      enrollmentDate: "",
      program: "",
      semester: "",
      gpa: "",
      courses: [],
      address: "",
    });
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNewStudentCourseChange = (e, index) => {
    const newCourses = [...newStudent.courses];
    newCourses[index] = e.target.value;
    setNewStudent((prev) => ({
      ...prev,
      courses: newCourses,
    }));
  };

  const handleAddCourse = () => {
    setNewStudent((prev) => ({
      ...prev,
      courses: [...prev.courses, ""],
    }));
  };

  const handleRemoveCourse = (index) => {
    const newCourses = [...newStudent.courses];
    newCourses.splice(index, 1);
    setNewStudent((prev) => ({
      ...prev,
      courses: newCourses,
    }));
  };

  const validateForm = () => {
    const errors = {};
    // Required fields
    if (!newStudent.id) errors.id = "Student ID is required";
    if (!newStudent.name) errors.name = "Full name is required";
    if (!newStudent.email) errors.email = "Email is required";
    if (!newStudent.program) errors.program = "Program is required";

    // Email validation
    if (newStudent.email && !/\S+@\S+\.\S+/.test(newStudent.email)) {
      errors.email = "Email is invalid";
    }

    // GPA validation
    if (
      newStudent.gpa &&
      (parseFloat(newStudent.gpa) < 0 || parseFloat(newStudent.gpa) > 4.0)
    ) {
      errors.gpa = "GPA must be between 0 and 4.0";
    }

    // ID uniqueness (only for new students, not for editing)
    if (
      !isEditingStudent &&
      students.some((student) => student.id === newStudent.id)
    ) {
      errors.id = "Student ID must be unique";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitNewStudent = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create a new student with required properties
    const studentToAdd = {
      ...newStudent,
      courses: newStudent.courses.length
        ? newStudent.courses
        : ["No courses added yet"], // Default value
    };

    // For adding new student
    if (!isEditingStudent) {
      // In a real app, you would add the student to your database
      setStudents((prevStudents) => [...prevStudents, studentToAdd]);
      console.log("New student submitted:", studentToAdd);
    }
    // For editing existing student
    else {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === editingStudentId ? studentToAdd : student
        )
      );
      console.log("Student updated:", studentToAdd);
    }

    // Reset form and close add/edit student view
    handleCancelAddStudent();
    setIsEditingStudent(false);
    setEditingStudentId(null);
  };

  const handleDeleteClick = (studentId) => {
    setDeleteConfirm({ show: true, studentId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.studentId) {
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== deleteConfirm.studentId)
      );
      setDeleteConfirm({ show: false, studentId: null });

      // If we're viewing the student that is being deleted, close the view
      if (selectedStudent && selectedStudent.id === deleteConfirm.studentId) {
        setSelectedStudent(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, studentId: null });
  };

  const handlePrintDetails = () => {
    if (!selectedStudent) return;

    // Create a new window with just the student details
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Details - ${selectedStudent.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .course-item { margin-bottom: 5px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Details</h1>
            <h2>${selectedStudent.name} (${selectedStudent.id})</h2>
          </div>
          
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-row"><div class="info-label">Email:</div> ${selectedStudent.email
      }</div>
            <div class="info-row"><div class="info-label">Phone:</div> ${selectedStudent.phone
      }</div>
            <div class="info-row"><div class="info-label">Date of Birth:</div> ${selectedStudent.dateOfBirth
      }</div>
            <div class="info-row"><div class="info-label">Address:</div> ${selectedStudent.address
      }</div>
          </div>
          
          <div class="section">
            <div class="section-title">Academic Information</div>
            <div class="info-row"><div class="info-label">Program:</div> ${selectedStudent.program
      }</div>
            <div class="info-row"><div class="info-label">Enrollment Date:</div> ${selectedStudent.enrollmentDate
      }</div>
            <div class="info-row"><div class="info-label">Current Semester:</div> ${selectedStudent.semester
      }</div>
            <div class="info-row"><div class="info-label">GPA:</div> ${selectedStudent.gpa
      }</div>
          </div>
          
          <div class="section">
            <div class="section-title">Enrolled Courses</div>
            <div>
              ${selectedStudent.courses
        .map(
          (course, i) => `
                <div class="course-item">${i + 1}. ${course}</div>
              `
        )
        .join("")}
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo & Home button */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">
                  Admin Portal
                </span>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center"
                >
                  <Home className="h-5 w-5 mr-1" />
                  Home
                </Link>
                <Link
                  to="/students"
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 bg-gray-100 flex items-center"
                >
                  <User className="h-5 w-5 mr-1" />
                  Students
                </Link>
              </div>
            </div>

            {/* Right side - Search, notifications, and profile */}
            <div className="flex items-center">
              {/* Search */}
              <div className="relative mr-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="px-4 py-2 w-48 focus:outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="bg-indigo-500 p-2 hover:bg-indigo-600 text-white">
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleSearchOptions}
                    className="bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Search options dropdown */}
                {showSearchOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Search by:
                      </p>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="searchBy"
                            value="name"
                            checked={searchBy === "name"}
                            onChange={() => setSearchBy("name")}
                            className="mr-2"
                          />
                          Name
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="searchBy"
                            value="id"
                            checked={searchBy === "id"}
                            onChange={() => setSearchBy("id")}
                            className="mr-2"
                          />
                          ID
                        </label>

                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative mr-4">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  {/* <Bell className="h-6 w-6 text-gray-500" /> */}
                  {/* <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notificationsList.filter((n) => !n.read).length}
                  </span> */}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="divide-y">
                        {notificationsList.map((notification) => (
                          <div
                            key={notification.id}
                            className={`py-2 ${notification.read ? "opacity-50" : ""
                              }`}
                          >
                            <p className="text-sm text-gray-800">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 w-full text-center">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </button>

                {/* Profile dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-semibold">
                            {adminData.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {adminData.email}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Role</p>
                        <p className="text-sm">{adminData.role}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Last Login</p>
                        <p className="text-sm">{adminData.lastLogin}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Member Since
                        </p>
                        <p className="text-sm">{adminData.joinDate}</p>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <button className="flex items-center w-full py-2 px-1 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </button>
                        <button className="flex items-center w-full py-2 px-1 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help Center
                        </button>
                        <button className="flex items-center w-full py-2 px-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Student Management
            </h1>
            <button
              onClick={() => navigate("./add-student", { relative: "path" })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </button>
          </div>



          {/* Student List or Details View */}
          {!selectedStudent && !isAddingStudent ? (
            <div>
              {searchQuery.trim() !== "" && (
                <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Found {filteredStudents.length} students matching "
                    {searchQuery}" in {searchBy}
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear search
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.student_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 hover:underline"
                          >
                            {student.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.contact_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.student_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              setSelectedStudentForAttendance({
                                student_id: student.student_id,
                              })
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                          >
                            Mark Attendance
                          </button>
                          <button
                            onClick={() =>
                              setSelectedStudentForAssessment({
                                student_id: student.student_id,
                              })
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                          >
                            Mark Session
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedStudent && !isAddingStudent && !isEditingStudent ? (
            // Student Details View
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleCloseStudentView}
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back to List
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditStudent(selectedStudent)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={handlePrintDetails}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedStudent.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedStudent.name}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Student ID: {selectedStudent.student_id}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-base">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-base">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-base">{selectedStudent.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-base">{selectedStudent.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Academic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="text-base">{selectedStudent.program}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Enrollment Date</p>
                      <p className="text-base">
                        {selectedStudent.enrollmentDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Semester</p>
                      <p className="text-base">{selectedStudent.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current GPA</p>
                      <p className="text-base">{selectedStudent.gpa}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Enrolled Courses
                </h3>
                <ul className="space-y-2">
                  {selectedStudent.courses.map((course, index) => (
                    <li key={index} className="text-base text-gray-800">
                      • {course}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            // Add or Edit Student Form
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={
                    isAddingStudent
                      ? handleCancelAddStudent
                      : handleCancelEditStudent
                  }
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Cancel
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isAddingStudent ? "Add New Student" : "Edit Student"}
                </h2>
              </div>

              <form onSubmit={handleSubmitNewStudent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID*
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={newStudent.id}
                      onChange={handleNewStudentChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.id ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter student ID"
                      disabled={isEditingStudent} // Disable editing ID for existing students
                    />
                    {formErrors.id && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.id}
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={handleNewStudentChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleNewStudentChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newStudent.phone}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newStudent.dateOfBirth}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Enrollment Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Date
                    </label>
                    <input
                      type="date"
                      name="enrollmentDate"
                      value={newStudent.enrollmentDate}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Program */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program*
                    </label>
                    <input
                      type="text"
                      name="program"
                      value={newStudent.program}
                      onChange={handleNewStudentChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.program
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      placeholder="Enter program name"
                    />
                    {formErrors.program && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.program}
                      </p>
                    )}
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Semester
                    </label>
                    <input
                      type="text"
                      name="semester"
                      value={newStudent.semester}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter current semester"
                    />
                  </div>

                  {/* GPA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA
                    </label>
                    <input
                      type="text"
                      name="gpa"
                      value={newStudent.gpa}
                      onChange={handleNewStudentChange}
                      className={`w-full px-3 py-2 border rounded-md ${formErrors.gpa ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter GPA (0.0 - 4.0)"
                    />
                    {formErrors.gpa && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.gpa}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={newStudent.city}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter city"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newStudent.address}
                      onChange={handleNewStudentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Enrolled Courses
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Course
                    </button>
                  </div>

                  {newStudent.courses.length === 0 ? (
                    <p className="text-sm text-gray-500 italic my-2">
                      No courses added
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {newStudent.courses.map((course, index) => (
                        <div key={index} className="flex">
                          <input
                            type="text"
                            value={course}
                            onChange={(e) =>
                              handleNewStudentCourseChange(e, index)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder={`Course ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(index)}
                            className="ml-2 px-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={
                      isAddingStudent
                        ? handleCancelAddStudent
                        : handleCancelEditStudent
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {isAddingStudent ? "Add Student" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {selectedStudentForAttendance && (
            <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-6 z-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mark Attendance</h2>
              <form onSubmit={handleAttendanceSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    value={selectedStudentForAttendance.student_id}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Session ID</label>
                  <input
                    type="text"
                    value={attendanceData.session_id}
                    onChange={(e) =>
                      setAttendanceData((prev) => ({
                        ...prev,
                        session_id: e.target.value,
                        student_id: selectedStudentForAttendance.student_id,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={attendanceData.status}
                    onChange={(e) =>
                      setAttendanceData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForAttendance(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
          {selectedStudentForAssessment && (
            <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg p-6 z-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mark Assessment</h2>
              <form onSubmit={handleAssessmentSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    value={selectedStudentForAssessment.student_id}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Session ID</label>
                  <input
                    type="text"
                    value={assessmentData.session_id}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        session_id: e.target.value,
                        student_id: selectedStudentForAssessment.student_id,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Marks Obtained</label>
                  <input
                    type="number"
                    value={assessmentData.marks_obtained}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        marks_obtained: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForAssessment(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentListPage;
