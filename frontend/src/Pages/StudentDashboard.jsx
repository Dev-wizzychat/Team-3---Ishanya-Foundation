import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const studentData = {
  name: "John Doe",
  photo: "/api/placeholder/150/150",
  gender: "Male",
  dob: "2001-05-21",
  studentId: "ST12345",
  enrollYear: "2020",
  status: "Active",
  email: "johndoe@example.com",
  program: "Computer Science",
  sessions: 45,
  fatherName: "Michael Doe",
  motherName: "Sarah Doe",
  bloodGroup: "O+",
};

const performanceData = [
  { week: "Week 1", score: 75 },
  { week: "Week 2", score: 80 },
  { week: "Week 3", score: 78 },
  { week: "Week 4", score: 85 },
];

const attendanceData = [
  { name: "Present", value: 85, color: "#4CAF50" },
  { name: "Absent", value: 15, color: "#F44336" },
];

const courseData = [
  { id: 1, code: "CS101", name: "Introduction to Programming", credits: 3, grade: "A" },
  { id: 2, code: "CS201", name: "Data Structures & Algorithms", credits: 4, grade: "B+" },
  { id: 3, code: "MATH202", name: "Discrete Mathematics", credits: 3, grade: "A-" },
  { id: 4, code: "ENG103", name: "Technical Communication", credits: 2, grade: "B" },
];

const attendanceLog = [
  { date: "2025-03-01", status: "Present", class: "CS101" },
  { date: "2025-03-03", status: "Present", class: "MATH202" },
  { date: "2025-03-05", status: "Absent", class: "CS101" },
  { date: "2025-03-08", status: "Present", class: "CS201" },
  { date: "2025-03-10", status: "Present", class: "ENG103" },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [showAttendanceLog, setShowAttendanceLog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...studentData});

  // Handle course details
  const handleCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowMaterials(false);
  };

  // Handle course materials
  const handleCourseMaterials = (course) => {
    setSelectedCourse(course);
    setShowMaterials(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save changes to the backend here
    // For this demo, we'll just update the studentData state
    Object.assign(studentData, editedProfile);
    setShowEditProfile(false);
    alert("Profile updated successfully!");
  };

  // Handle password change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setShowChangePassword(false);
    alert("Password changed successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p>Welcome back, {studentData.name}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['overview', 'performance', 'courses', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowFullReport(false);
              setShowAttendanceLog(false);
              setSelectedCourse(null);
              setShowMaterials(false);
              setShowEditProfile(false);
              setShowChangePassword(false);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Info Card - Always visible unless in edit mode */}
        {!showEditProfile && !showChangePassword && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center col-span-1">
            <div className="relative mb-4 inline-block">
              <img src={studentData.photo} alt="Student" className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-200" />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            
            <h2 className="text-xl font-semibold">{studentData.name}</h2>
            <p className="text-gray-600">{studentData.program} | {studentData.status}</p>
            <p className="text-gray-500 mb-4">ID: {studentData.studentId} | Year: {studentData.enrollYear}</p>
            
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow hover:shadow-lg text-sm"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            
            {showDetails && (
              <div className="mt-4 text-left border-t pt-4">
                <p><span className="font-medium">Email:</span> {studentData.email}</p>
                <p><span className="font-medium">Gender:</span> {studentData.gender}</p>
                <p><span className="font-medium">Date of Birth:</span> {studentData.dob}</p>
                <p><span className="font-medium">Father's Name:</span> {studentData.fatherName}</p>
                <p><span className="font-medium">Mother's Name:</span> {studentData.motherName}</p>
                <p><span className="font-medium">Blood Group:</span> {studentData.bloodGroup}</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'overview' && !showFullReport && !showAttendanceLog && (
          <>
            {/* Performance Chart for Overview */}
            <div className="bg-white shadow-lg rounded-lg p-6 col-span-1">
              <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowFullReport(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm"
                >
                  View Full Report
                </button>
              </div>
            </div>
            
            {/* Attendance Chart for Overview */}
            <div className="bg-white shadow-lg rounded-lg p-6 col-span-1">
              <h3 className="text-lg font-semibold mb-4">Attendance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie 
                    data={attendanceData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowAttendanceLog(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm"
                >
                  View Attendance Log
                </button>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'overview' && showFullReport && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Detailed Performance Report</h3>
              <button 
                onClick={() => setShowFullReport(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
              >
                Back to Overview
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                  name="Weekly Score"
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-4">Weekly Breakdown</h4>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 text-left">Week</th>
                    <th className="py-2 px-4 bg-gray-100 text-left">Score</th>
                    <th className="py-2 px-4 bg-gray-100 text-left">Grade</th>
                    <th className="py-2 px-4 bg-gray-100 text-left">Change</th>
                    <th className="py-2 px-4 bg-gray-100 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((week, index) => {
                    const prevScore = index > 0 ? performanceData[index - 1].score : week.score;
                    const change = week.score - prevScore;
                    let grade = "F";
                    if (week.score >= 90) grade = "A";
                    else if (week.score >= 80) grade = "B";
                    else if (week.score >= 70) grade = "C";
                    else if (week.score >= 60) grade = "D";
                    
                    return (
                      <tr key={week.week} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{week.week}</td>
                        <td className="py-2 px-4">{week.score}%</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${grade === 'A' ? 'bg-green-100 text-green-800' : 
                             grade === 'B' ? 'bg-blue-100 text-blue-800' :
                             grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                             grade === 'D' ? 'bg-orange-100 text-orange-800' :
                             'bg-red-100 text-red-800'}`}
                          >
                            {grade}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          {index === 3 ? "Excellent improvement" :
                           index === 2 ? "Slight decrease" :
                           index === 1 ? "Good progress" : "Initial assessment"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-4">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Continue with the current study pattern to maintain improvement</li>
                <li>Focus on practical applications to strengthen understanding</li>
                <li>Schedule a consultation with the advisor to discuss future goals</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'overview' && showAttendanceLog && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Attendance Log</h3>
              <button 
                onClick={() => setShowAttendanceLog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
              >
                Back to Overview
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Present: 85%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span>Absent: 15%</span>
                </div>
              </div>
            </div>
            
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 text-left">Date</th>
                  <th className="py-2 px-4 bg-gray-100 text-left">Class</th>
                  <th className="py-2 px-4 bg-gray-100 text-left">Status</th>
                  <th className="py-2 px-4 bg-gray-100 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLog.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{log.date}</td>
                    <td className="py-2 px-4">{log.class}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => alert(`Details for attendance on ${log.date}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all duration-300 text-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => alert("Attendance report downloaded!")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm"
              >
                Download Report
              </button>
              <button 
                onClick={() => alert("Request sent to admin!")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm"
              >
                Request Correction
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <h3 className="text-xl font-semibold mb-6">Detailed Performance Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                  name="Weekly Score"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => alert("Detailed average analytics")}>
                <h4 className="font-medium text-indigo-800">Current Average</h4>
                <p className="text-2xl font-bold text-indigo-600">79.5%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => alert("Top score breakdown")}>
                <h4 className="font-medium text-green-800">Highest Score</h4>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => alert("Weekly improvement trends")}>
                <h4 className="font-medium text-yellow-800">Improvement</h4>
                <p className="text-2xl font-bold text-yellow-600">+10%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => alert("Class ranking details")}>
                <h4 className="font-medium text-blue-800">Class Ranking</h4>
                <p className="text-2xl font-bold text-blue-600">15 / 120</p>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h4 className="font-medium text-gray-700 mb-4">Performance Goals</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Grade</span>
                    <span className="text-sm font-medium">80% / 85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm font-medium">85% / 90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Assignments</span>
                    <span className="text-sm font-medium">75% / 80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => alert("Goals updated successfully!")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
                >
                  Update Goals
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'courses' && !selectedCourse && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <h3 className="text-xl font-semibold mb-6">Enrolled Courses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 bg-gray-100 text-left">Course Code</th>
                    <th className="py-3 px-4 bg-gray-100 text-left">Course Name</th>
                    <th className="py-3 px-4 bg-gray-100 text-left">Credits</th>
                    <th className="py-3 px-4 bg-gray-100 text-left">Grade</th>
                    <th className="py-3 px-4 bg-gray-100 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{course.code}</td>
                      <td className="py-3 px-4">{course.name}</td>
                      <td className="py-3 px-4">{course.credits}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleCourseDetails(course)}
                          className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all duration-300 text-xs"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => handleCourseMaterials(course)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-xs"
                        >
                          Materials
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => alert("Course registration period will open soon!")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
              >
                Register New Course
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'courses' && selectedCourse && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {showMaterials ? `Course Materials: ${selectedCourse.code}` : `Course Details: ${selectedCourse.code}`}
              </h3>
              <button 
                onClick={() => {
                  setSelectedCourse(null);
                  setShowMaterials(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
              >
                Back to Courses
              </button>
            </div>
            
            {!showMaterials ? (
              // Course Details View
              <div>
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-indigo-800 text-lg mb-2">{selectedCourse.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p><span className="font-medium">Course Code:</span> {selectedCourse.code}</p>
                    <p><span className="font-medium">Credits:</span> {selectedCourse.credits}</p>
                    <p><span className="font-medium">Current Grade:</span> {selectedCourse.grade}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-4">Course Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-indigo-600 h-4 rounded-full text-xs text-white flex items-center justify-center"
                      style={{ width: '65%' }}
                    >
                      65%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Upcoming Assignments</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between p-2 bg-yellow-50 rounded">
                        <span>Assignment 3</span>
                        <span className="text-red-600">Due in 2 days</span>
                      </li>
                      <li className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Final Project</span>
                        <span>Due in 3 weeks</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Recent Grades</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between p-2 bg-green-50 rounded">
                        <span>Quiz 2</span>
                        <span className="font-medium">92%</span>
                      </li>
                      <li className="flex justify-between p-2 bg-blue-50 rounded">
                        <span>Assignment 2</span>
                        <span className="font-medium">88%</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleCourseMaterials(selectedCourse)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
                  >
                    View Materials
                  </button>
                  <button 
                    onClick={() => alert(`Opening discussion forum for ${selectedCourse.code}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
                  >
                    Discussion Forum
                  </button>
                </div>
              </div>
            ) : (
              // Course Materials View
              <div>
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-4">Course Materials</h4>
                  <ul className="space-y-3">
                    <li className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Lecture 1: Introduction</span>
                        <span className="text-sm text-gray-500">PDF, 2.3 MB</span>
                      </div>
                      <button 
                        onClick={() => alert("Downloading lecture 1...")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Download
                      </button>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Lecture 2: Core Concepts</span>
                        <span className="text-sm text-gray-500">PDF, 3.1 MB</span>
                      </div>
                      <button 
                        onClick={() => alert("Downloading lecture 2...")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Download
                      </button>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Lab Assignment 1</span>
                        <span className="text-sm text-gray-500">ZIP, 1.5 MB</span>
                      </div>
                      <button 
                        onClick={() => alert("Downloading lab assignment...")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Download
                      </button>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Recorded Lecture: Week 3</span>
                        <span className="text-sm text-gray-500">MP4, 105 MB</span>
                      </div>
                      <button 
                        onClick={() => alert("Opening video player...")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Watch Online
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Additional Resources</h4>
                  <ul className="space-y-3">
                    <li className="p-3 bg-indigo-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Course Syllabus</span>
                        <span className="text-sm text-gray-500">PDF, 0.8 MB</span>
                      </div>
                      <button 
                        onClick={() => alert("Downloading syllabus...")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Download
                      </button>
                    </li>
                    <li className="p-3 bg-indigo-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-medium block">Reference Textbook</span>
                        <span className="text-sm text-gray-500">External Link</span>
                      </div>
                      <button 
                        onClick={() => alert("Opening external link...")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Visit
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'profile' && !showEditProfile && !showChangePassword && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <h3 className="text-xl font-semibold mb-6">Student Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <p><span className="font-medium">Full Name:</span> {studentData.name}</p>
                    <p><span className="font-medium">Gender:</span> {studentData.gender}</p>
                    <p><span className="font-medium">Date of Birth:</span> {studentData.dob}</p>
                    <p><span className="font-medium">Blood Group:</span> {studentData.bloodGroup}</p>
                    <p><span className="font-medium">Email:</span> {studentData.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Academic Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <p><span className="font-medium">Student ID:</span> {studentData.studentId}</p>
                    <p><span className="font-medium">Program:</span> {studentData.program}</p>
                    <p><span className="font-medium">Enrollment Year:</span> {studentData.enrollYear}</p>
                    <p><span className="font-medium">Status:</span> {studentData.status}</p>
                    <p><span className="font-medium">Total Sessions:</span> {studentData.sessions}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-3">Family Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><span className="font-medium">Father's Name:</span> {studentData.fatherName}</p>
                    <p><span className="font-medium">Mother's Name:</span> {studentData.motherName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowEditProfile(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setShowChangePassword(true)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
              >
                Change Password
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'profile' && showEditProfile && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Profile</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={editedProfile.name} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={editedProfile.email} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={editedProfile.dob} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select 
                    name="bloodGroup" 
                    value={editedProfile.bloodGroup} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input 
                    type="text" 
                    name="fatherName" 
                    value={editedProfile.fatherName} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input 
                    type="text" 
                    name="motherName" 
                    value={editedProfile.motherName} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'profile' && showChangePassword && (
          <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <button 
                onClick={() => setShowChangePassword(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>© 2025 Student Management System. All rights reserved.</p>
        <p className="mt-1">Version 1.0.2</p>
      </div>
    </div>
  );
};

export default StudentDashboard;