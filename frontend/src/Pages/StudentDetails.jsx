import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const COLORS = ["#00C49F", "#FF4444"];

// const studentData = {
//   name: "John Doe",
//   photo: "/api/placeholder/150/150",
//   gender: "Male",
//   dob: "2001-05-21",
//   studentId: "ST12345",
//   enrollYear: "2020",
//   status: "Active",
//   email: "johndoe@example.com",
//   program: "Computer Science",
//   sessions: 45,
//   fatherName: "Michael Doe",
//   motherName: "Sarah Doe",
//   bloodGroup: "O+",
// };

// const performanceData = [
//   { week: "Week 1", score: 75 },
//   { week: "Week 2", score: 80 },
//   { week: "Week 3", score: 78 },
//   { week: "Week 4", score: 85 },
// ];

// const attendanceData = [
//   { name: "Present", value: 85, color: "#4CAF50" },
//   { name: "Absent", value: 15, color: "#F44336" },
// ];

const courseData = [
    { id: 1, code: "CS101", name: "Introduction to Programming", credits: 3, grade: "A" },
    { id: 2, code: "CS201", name: "Data Structures & Algorithms", credits: 4, grade: "B+" },
    { id: 3, code: "MATH202", name: "Discrete Mathematics", credits: 3, grade: "A-" },
    { id: 4, code: "ENG103", name: "Technical Communication", credits: 2, grade: "B" },
];

// const attendanceLog = [
//   { date: "2025-03-01", status: "Present", class: "CS101" },
//   { date: "2025-03-03", status: "Present", class: "MATH202" },
//   { date: "2025-03-05", status: "Absent", class: "CS101" },
//   { date: "2025-03-08", status: "Present", class: "CS201" },
//   { date: "2025-03-10", status: "Present", class: "ENG103" },
// ];
const MoveBack = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    return () => navigate('/admin/student-list'); // Return a function reference
};
const StudentDashboard = () => {

    const { id } = useParams(); // Get the student ID from the URL
    const [studentData, setStudentData] = useState(null); // State to store student details
    const [performanceData, setPerformanceData] = useState([]); // State for performance data
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceData2, setAttendanceData2] = useState([]); // State for attendance data
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showDetails, setShowDetails] = useState(false);
    const [showFullReport, setShowFullReport] = useState(false);
    const [showAttendanceLog, setShowAttendanceLog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showMaterials, setShowMaterials] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...studentData });
    const [showChangePassword, setShowChangePassword] = useState(false);
    // const [editedProfile, setEditedProfile] = useState({ ...studentData });

    // Handle course details
    useEffect(() => {
        // Fetch student details from the API
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/view-student/${id}`);
                const data = response.data;
                console.log("Student details:", data);

                // Set the student data
                setStudentData(data);

                // Set performance data (if available)
                if (data.examResult) {
                    console.log("Performance data:", data.examResult);
                    setPerformanceData(data.examResult);
                }

                // Set attendance data (if available)
                if (data.attendence) {
                    // console.log("Attendance data:", data.attendence);
                    const countStatus = data.attendence.reduce(
                        (acc, { status }) => {
                            if (status === "present") acc.present++;
                            else acc.absent++;
                            return acc;
                        },
                        { present: 0, absent: 0 }
                    );

                    // Data for Pie Chart
                    const attData = [
                        { name: "Present", value: countStatus.present },
                        { name: "Absent", value: countStatus.absent },
                    ];
                    setAttendanceData2(attData);
                    setAttendanceData(data.attendence);
                }

                setLoading(false); // Stop loading
            } catch (err) {
                console.error("Error fetching student details:", err);
                setError("Failed to fetch student details. Please try again later.");
                setLoading(false); // Stop loading
            }
        };

        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }


    // Handle form submission
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
    };
    // Handle password change
    const handleProfileSubmit = async (e) => {
        console.log("Edited Profile:", editedProfile);
        e.preventDefault();
        
        try {
            // Update the student details on the backend
            await axios.put(`http://localhost:8000/update-student/${id}`, editedProfile);
            setStudentData(editedProfile); // Update the local state
            setShowEditProfile(false); // Exit edit mode
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating student details:", err);
            alert("Failed to update profile. Please try again.");
        }
    };
    const calculateAverageMarks = (data) => {
        if (!data || data.length === 0) return 0; // Handle empty or undefined data
        const totalMarks = data.reduce((sum, record) => sum + record.marks_obtained, 0);
        return (totalMarks / data.length).toFixed(2); // Return average rounded to 2 decimal places
    };
    const getHighestScore = (data) => {
        if (!data || data.length === 0) return 0; // Handle empty or undefined data
        return data.reduce((max, record) => Math.max(max, record.marks_obtained), 0);
    };
    const calculateImprovement = (data) => {
        if (!data || data.length < 2) return 0; // Handle cases with fewer than 2 exams

        // Get the last two exam marks
        const lastExamMarks = data[data.length - 1].marks_obtained;
        const prevLastExamMarks = data[data.length - 2].marks_obtained;

        // Calculate improvement percentage
        const improvement = ((lastExamMarks - prevLastExamMarks) / prevLastExamMarks) * 100;

        return improvement.toFixed(2); // Return improvement rounded to 2 decimal places
    };

    // Example usage
    const averageMarks = calculateAverageMarks(performanceData);
    console.log("Average Marks:", averageMarks);

    return (

        // Initialize useNavigate

        <div className="bg-gray-100 min-h-screen p-6">

            <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin-Student Dashboard</h1>


            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['overview', 'performance', 'profile'].map((tab) => (
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
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === tab
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
                {!showEditProfile && !showChangePassword && activeTab !== 'profile' && (
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center col-span-1">
                        <h2 className="text-xl font-semibold">{studentData.name}</h2>
                        <p className="text-gray-500 mb-4">ID: {studentData.student_id}</p>

                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow hover:shadow-lg text-sm"
                        >
                            {showDetails ? "Hide Details" : "Show Details"}
                        </button>

                        {showDetails && (
                            <div className="mt-4 text-left border-t pt-4">
                                <p><span className="font-medium">Email:</span> {studentData.student_email}</p>
                                <p><span className="font-medium">Gender:</span> {studentData.gender}</p>
                                <p><span className="font-medium">Date of Birth:</span> {studentData.dob}</p>
                                <p><span className="font-medium">Father's Name:</span> {studentData.father_name}</p>
                                <p><span className="font-medium">Mother's Name:</span> {studentData.mother_name}</p>
                                <p><span className="font-medium">Blood Group:</span> {studentData.blood_group}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'overview' && !showFullReport && !showAttendanceLog && (
                    <>
                        {/* Performance Chart for Overview */}
                        <div className="bg-white shadow-lg rounded-lg p-6 col-span-1">
                            <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="session_id" angle={-30} textAnchor="end" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="marks_obtained" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
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

                            {/* <ResponsiveContainer width="100%" height={220}> */}
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={attendanceData2}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {attendanceData2.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                            {/* </ResponsiveContainer> */}
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
                            <LineChart data={performanceData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="session_id" angle={-30} textAnchor="end" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="marks_obtained" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-6">
                            <h4 className="font-medium text-gray-700 mb-4">Session Breakdown</h4>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 bg-gray-100 text-left">Session ID</th>
                                        <th className="py-2 px-4 bg-gray-100 text-left">Session Name</th>
                                        <th className="py-2 px-4 bg-gray-100 text-left">Time</th>
                                        <th className="py-2 px-4 bg-gray-100 text-left">Duration</th>
                                        <th className="py-2 px-4 bg-gray-100 text-left">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceData.map((week, index) => {
                                        return (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-4">{week.session_id}</td>
                                                <td className="py-2 px-4">{week.session.name}</td>
                                                <td className="py-2 px-4">{week.session.date_timing}</td>
                                                <td className="py-2 px-4">{week.session.duration}</td>
                                                <td className="py-2 px-4">{week.marks_obtained}</td>
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
                        <div className="flex items-center justify-between">
                            {/* Attendance Details */}
                            <div className="mr-10"> {/* Added margin-right to move it further left */}
                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-gray-700 font-medium">
                                        Present: {((attendanceData2[0]?.value / (attendanceData2[1]?.value + attendanceData2[0]?.value)) * 100 || 0).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                    <span className="text-gray-700 font-medium">
                                        Absent: {((attendanceData2[1]?.value / (attendanceData2[1]?.value + attendanceData2[0]?.value)) * 100 || 0).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <PieChart width={200} height={200}>
                                <Pie
                                    data={attendanceData2}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {attendanceData2.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>

                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 bg-gray-100 text-left">Session ID</th>
                                    <th className="py-2 px-4 bg-gray-100 text-left">Session Name</th>
                                    <th className="py-2 px-4 bg-gray-100 text-left">Date</th>
                                    <th className="py-2 px-4 bg-gray-100 text-left">Duration</th>
                                    <th className="py-2 px-4 bg-gray-100 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {console.log(attendanceData2)} */}
                                {attendanceData.map((week, index) => {

                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{week.session_id}</td>
                                            <td className="py-2 px-4">{week.session.name}</td>
                                            <td className="py-2 px-4">{week.session.date_timing}</td>
                                            <td className="py-2 px-4">{week.session.duration}</td>
                                            <td className="py-2 px-4">{week.status}</td>
                                        </tr>
                                    );
                                })}
                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {log.status || "N/A"}
                      </span> */}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
                        <h3 className="text-xl font-semibold mb-6">Detailed Performance Analysis</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="session_id" angle={-30} textAnchor="end" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="marks_obtained" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                            </LineChart>

                            {/* </LineChart> */}
                        </ResponsiveContainer>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                            >
                                <h4 className="font-medium text-indigo-800">Current Average</h4>
                                <p className="text-2xl font-bold text-indigo-600">{calculateAverageMarks(performanceData)}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                            >
                                <h4 className="font-medium text-green-800">Highest Score</h4>
                                <p className="text-2xl font-bold text-green-600">{getHighestScore(performanceData)}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300"
                            >
                                <h4 className="font-medium text-yellow-800">Improvement</h4>
                                <p className="text-2xl font-bold text-yellow-600">{calculateImprovement(performanceData)}%</p>
                            </div>

                        </div>
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
                                        <p><span className="font-medium">Email:</span> {studentData.student_email}</p>
                                        <p><span className="font-medium">Date of Birth:</span> {studentData.dob}</p>

                                        <p><span className="font-medium">Phone:</span> {studentData.contact_number}</p>
                                        <p><span className="font-medium">Blood Group:</span> {studentData.blood_group}</p>

                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Academic Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 gap-3">
                                        <p><span className="font-medium">Student ID:</span> {studentData.student_id}</p>
                                        <p><span className="font-medium">Program:</span> {studentData.course_id}</p>
                                        <p><span className="font-medium">Days Available:</span> {studentData.days_attending ? studentData.days_attending.join(", ") : "N/A"}</p>
                                        <p><span className="font-medium">Available From:</span> {studentData.available_from}</p>
                                        <p><span className="font-medium">Available Until:</span> {studentData.available_until}</p>
                                        <p><span className="font-medium">Total Sessions:</span> {studentData.attendence.length}</p>
                                        <p><span className="font-medium">Present Sessions:</span> {studentData.attendence ? studentData.attendence.filter((session) => session.status === "present").length : 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-3">Family Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <p><span className="font-medium">Father's Name:</span> {studentData.father_name}</p>
                                        <p><span className="font-medium">Mother's Name:</span> {studentData.mother_name}</p>
                                        <p><span className="font-medium">Parent's Contact:</span> {studentData.alt_contact_number}</p>
                                        <p><span className="font-medium">Parent's Email:</span> {studentData.parent_email}</p>

                                        <p><span className="font-medium">Address:</span> {studentData.address}</p>

                                        <p><span className="font-medium">Pincode:</span> {studentData.pincode}</p>

                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-3">Medical Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <p><span className="font-medium">Allergies:</span> {studentData.allergies}</p>
                                        <p><span className="font-medium">Comorbidity:</span> {studentData.comorbidity}</p>
                                        <p><span className="font-medium">Diagnosis:</span> {studentData.diagnosis}</p>
                                        <p><span className="font-medium">UDID:</span> {studentData.udid}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {setShowEditProfile(true); setEditedProfile(studentData);}}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
                        >
                            Edit Student
                        </button>
                    </div>
                )}

                {activeTab === 'profile' && showEditProfile && (
                    <div className="bg-white shadow-lg rounded-lg p-6 col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Edit Profile</h3>
                            <button
                                onClick={() =>  {
                                    setEditedProfile(studentData); // Populate editedProfile with studentData
                                    setShowEditProfile(true); // Show the edit form
                                  }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md transition-all duration-300 text-sm"
                            >
                                Cancel
                            </button>
                        </div>

                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                                {/* Personal Information */}
                                {console.log("chkec", studentData, editedProfile)}
                                <div className="md:col-span-2">
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Personal Information</h4>
                                </div>

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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={editedProfile.gender || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                                    <input
                                        type="email"
                                        name="student_email"
                                        value={editedProfile.student_email || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={editedProfile.dob || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={editedProfile.contact_number || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
                                    <input
                                        type="text"
                                        name="alt_contact_number"
                                        value={editedProfile.alt_contact_number || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <select
                                        name="blood_group"
                                        value={editedProfile.blood_group || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Blood Group</option>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UDID</label>
                                    <input
                                        type="text"
                                        name="udid"
                                        value={editedProfile.udid || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Family Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Family Information</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                    <input
                                        type="text"
                                        name="father_name"
                                        value={editedProfile.father_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                                    <input
                                        type="text"
                                        name="mother_name"
                                        value={editedProfile.mother_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                                    <input
                                        type="email"
                                        name="parent_email"
                                        value={editedProfile.parent_email || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Address Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Address Information</h4>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={editedProfile.address || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={editedProfile.pincode || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Medical Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Medical Information</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                    <input
                                        type="text"
                                        name="diagnosis"
                                        value={editedProfile.diagnosis || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comorbidity</label>
                                    <select
                                        name="comorbidity"
                                        value={editedProfile.comorbidity || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                    <input
                                        type="text"
                                        name="allergies"
                                        value={editedProfile.allergies || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Schedule Information */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="font-medium text-gray-700 mb-3 border-b pb-2">Schedule Information</h4>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Days Attending</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <label key={day} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editedProfile.days_attending?.includes(day) || false}
                                                    onChange={(e) => {
                                                        const newDays = [...(editedProfile.days_attending || [])];
                                                        if (e.target.checked) {
                                                            newDays.push(day);
                                                        } else {
                                                            const index = newDays.indexOf(day);
                                                            if (index > -1) {
                                                                newDays.splice(index, 1);
                                                            }
                                                        }
                                                        setEditedProfile(prev => ({
                                                            ...prev,
                                                            days_attending: newDays
                                                        }));
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span>{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                                    <input
                                        type="time"
                                        name="available_from"
                                        value={editedProfile.available_from || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Until</label>
                                    <input
                                        type="time"
                                        name="available_until"
                                        value={editedProfile.available_until || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditProfile(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 shadow hover:shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
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