import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams,useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null)
  const [studentsByCourse, setStudentsByCourse] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [newPhoto, setNewPhoto] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectMode, setSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  // Mock teacher data
  useEffect(() => {
    // Fetch educator data from the backend
    const fetchEducatorData = async () => {
      try {
        const API = `http://localhost:8000/view-educator/${id}`;
        const response = await axios.get(API);
        const educatorData = response.data;

        setTeacherData(educatorData); // Update state with fetched educator data

        // Automatically fetch students for the first course
        console.log(educatorData.course_id)

        const firstCourse = educatorData.course_id;

        setSelectedCourse(firstCourse); // Set the first course as selected
        fetchStudentsByCourse(firstCourse); // Fetch students for the first course


        setIsLoading(false); // Set loading to false
      } catch (err) {
        console.error('Error fetching educator data:', err);
        setError('Failed to load educator data. Please try again later.');
        setIsLoading(false); // Set loading to false
      }
    };

    fetchEducatorData();
  }, [id]);
  const fetchStudentsByCourse = async (courseId) => {
    try {
      const API = `http://localhost:8000/students-in-course/${courseId}`;
      const response = await axios.get(API);
      setStudentsByCourse(response.data); // Update state with fetched students
    } catch (err) {
      console.error('Error fetching students by course:', err);
      alert('Failed to fetch students for this course. Please try again later.');
    }
  };
  const calculateAverage = (examRecord) => {
    console.log("Exam Record:", examRecord); // Debugging log
    if (!examRecord || examRecord.length === 0) return "N/A"; // Handle cases with no exams
    const totalMarks = examRecord.reduce((sum, exam) => {
      console.log("Exam Record:", exam); // Debugging log
      return sum + (exam.marks_obtained || 0);
    }, 0);
    return (totalMarks / examRecord.length).toFixed(2); // Return average with 2 decimal places
  };
  const calculateAttendence = (attendanceRecord) => {
    if (!attendanceRecord || attendanceRecord.length === 0) return "N/A"; // Handle cases with no attendance

    // Count the total sessions and the number of "present" sessions
    const totalSessions = attendanceRecord.length;
    const presentSessions = attendanceRecord.filter((session) => session.status === "present").length;

    // Calculate and return the attendance percentage
    return `${((presentSessions / totalSessions) * 100).toFixed(2)}%`; // Return attendance percentage
  };
  // Mock schedule data
  const scheduleData = [
    {
      day: "Monday", periods: [
        { time: "09:00 - 10:30", class: "Algebra I", room: "204" },
        { time: "11:00 - 12:30", class: "Pre-Calculus", room: "210" },
        { time: "14:00 - 15:30", class: "Mentoring Hours", room: "Office" }
      ]
    },
    {
      day: "Tuesday", periods: [
        { time: "08:00 - 09:30", class: "Geometry", room: "208" },
        { time: "10:00 - 11:30", class: "Algebra II", room: "204" },
        { time: "13:00 - 14:30", class: "Department Meeting", room: "Staff Room" }
      ]
    },
    {
      day: "Wednesday", periods: [
        { time: "09:00 - 10:30", class: "Algebra I", room: "204" },
        { time: "11:00 - 12:30", class: "Pre-Calculus", room: "210" },
        { time: "14:00 - 15:30", class: "Student Consultation", room: "Office" }
      ]
    },
    {
      day: "Thursday", periods: [
        { time: "08:00 - 09:30", class: "Geometry", room: "208" },
        { time: "10:00 - 11:30", class: "Algebra II", room: "204" },
        { time: "13:00 - 14:30", class: "Professional Development", room: "Library" }
      ]
    },
    {
      day: "Friday", periods: [
        { time: "09:00 - 10:30", class: "Algebra I", room: "204" },
        { time: "11:00 - 12:30", class: "Math Club", room: "210" },
        { time: "14:00 - 15:00", class: "Faculty Meeting", room: "Auditorium" }
      ]
    }
  ];

  // Mock student data
  const [studentData, setStudentData] = useState([
    {
      id: "S1001",
      name: "Alex Kim",
      grade: "10th",
      progress: 85,
      attendance: "95%",
      homeworkStatus: [
        { title: "Quadratic Equations", status: "Completed", grade: "A" },
        { title: "Linear Functions", status: "Completed", grade: "B+" },
        { title: "Polynomial Review", status: "Pending", grade: "-" }
      ],
      notes: "Excellent at problem-solving but needs to work on showing steps clearly."
    },
    {
      id: "S1025",
      name: "Jamie Rodriguez",
      grade: "9th",
      progress: 72,
      attendance: "88%",
      homeworkStatus: [
        { title: "Quadratic Equations", status: "Completed", grade: "C" },
        { title: "Linear Functions", status: "Completed", grade: "B-" },
        { title: "Polynomial Review", status: "Not Submitted", grade: "-" }
      ],
      notes: "Struggling with algebraic concepts. Consider additional tutoring."
    },
    {
      id: "S1042",
      name: "Taylor Smith",
      grade: "10th",
      progress: 93,
      attendance: "98%",
      homeworkStatus: [
        { title: "Quadratic Equations", status: "Completed", grade: "A+" },
        { title: "Linear Functions", status: "Completed", grade: "A" },
        { title: "Polynomial Review", status: "Completed", grade: "A-" }
      ],
      notes: "Exceptional student. Consider advanced placement for next term."
    },
    {
      id: "S1103",
      name: "Morgan Chen",
      grade: "9th",
      progress: 78,
      attendance: "92%",
      homeworkStatus: [
        { title: "Quadratic Equations", status: "Completed", grade: "B" },
        { title: "Linear Functions", status: "Completed", grade: "B" },
        { title: "Polynomial Review", status: "In Progress", grade: "-" }
      ],
      notes: "Consistent work. Participates well in group activities."
    }
  ]);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Schedule change: Professional Development moved to Friday", time: "2 hours ago", isNew: true },
    { id: 2, message: "New student assigned: Chris Turner (S1150)", time: "1 day ago", isNew: true },
    { id: 3, message: "Reminder: Submit Q1 grades by Friday", time: "2 days ago", isNew: false },
    { id: 4, message: "Department meeting rescheduled to 3 PM", time: "3 days ago", isNew: false }
  ]);


  const coursesData = [
    {
      id: "MATH101",
      name: "Algebra I",
      semester: "Spring 2025",
      students: [
        {
          studentId: "S1001",
          name: "Alex Kim",
          grade: "10th",
          attendance: {
            "2025-03-25": false,
            "2025-03-26": false,
            "2025-03-27": false
          }
        },
        {
          studentId: "S1025",
          name: "Jamie Rodriguez",
          grade: "9th",
          attendance: {
            "2025-03-25": false,
            "2025-03-26": false,
            "2025-03-27": false
          }
        },
        {
          studentId: "S1042",
          name: "Taylor Smith",
          grade: "10th",
          attendance: {
            "2025-03-25": false,
            "2025-03-26": false,
            "2025-03-27": false
          }
        }
      ]
    },
    {
      id: "MATH201",
      name: "Geometry",
      semester: "Spring 2025",
      students: [
        {
          studentId: "S1103",
          name: "Morgan Chen",
          grade: "9th",
          attendance: {
            "2025-03-25": false,
            "2025-03-26": false,
            "2025-03-27": false
          }
        }
      ]
    }
  ];

  // Handle search functionality
  const filteredStudents = searchQuery
    ? studentData.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : studentData;

  // Handle view details click
  const handleViewDetails = (studentId) => {
    console.log(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  // Handle add note
  const handleAddNote = (studentId) => {
    setSelectedStudentId(studentId);
    setShowAddNoteModal(true);
  };

  // Handle update progress
  const handleUpdateProgress = (studentId) => {
    const student = studentData.find(s => s.id === studentId);
    setSelectedStudentId(studentId);
    setProgressValue(student.progress);
    setShowUpdateProgressModal(true);
  };

  // Save note
  const saveNote = () => {
    if (noteText.trim() === '') return;

    setStudentData(studentData.map(student => {
      if (student.id === selectedStudentId) {
        return {
          ...student,
          notes: student.notes + '\n' + noteText
        };
      }
      return student;
    }));

    setNoteText('');
    setShowAddNoteModal(false);
  };

  // Save progress
  const saveProgress = () => {
    setStudentData(studentData.map(student => {
      if (student.id === selectedStudentId) {
        return {
          ...student,
          progress: progressValue
        };
      }
      return student;
    }));

    setShowUpdateProgressModal(false);
  };

  // Handle student request acceptance
  const handleAcceptRequest = () => {
    // Add Emily Parker to student list
    const newStudent = {
      id: "S1167",
      name: "Emily Parker",
      grade: "9th",
      progress: 0,
      attendance: "0%",
      homeworkStatus: [],
      notes: "New transfer from Wilson Middle School."
    };

    setStudentData([...studentData, newStudent]);

    // Add confirmation notification
    const newNotification = {
      id: Date.now(),
      message: "Student Emily Parker (S1167) has been added to your class roster",
      time: "Just now",
      isNew: true
    };

    setNotifications([newNotification, ...notifications]);

    // Show success message (could be a toast in a real app)
    alert("Student Emily Parker has been successfully added to your roster");
  };

  // Handle photo update
  const handlePhotoUpdate = () => {
    // In a real app, you would upload the photo to a server
    // For this demo, we'll just show an alert
    alert("Photo updated successfully!");
    setNewPhoto(null);
  };

  // Handle attendance toggle
  const handleBulkAttendanceToggle = (courseId, studentId) => {
    // If no dates selected, do nothing
    if (selectedDates.length === 0) return;

    setAttendanceData(prev => {
      const newAttendance = { ...prev };

      // Ensure nested objects exist
      if (!newAttendance[courseId]) {
        newAttendance[courseId] = {};
      }
      if (!newAttendance[courseId][studentId]) {
        newAttendance[courseId][studentId] = {};
      }

      // Toggle attendance for all selected dates
      selectedDates.forEach(date => {
        newAttendance[courseId][studentId][date] =
          !(newAttendance[courseId][studentId][date] || false);
      });

      return newAttendance;
    });

    // Reset selection after bulk update
    setSelectedDates([]);
    setSelectMode(false);
  };
  const toggleDateSelection = (date) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const renderSchedule = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Weekly Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class/Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduleData.flatMap((day, idx) => (
                day.periods.map((period, periodIdx) => (
                  <tr key={`${idx}-${periodIdx}`} className={periodIdx === 0 ? "bg-gray-50" : ""}>
                    {periodIdx === 0 ? (
                      <td rowSpan={day.periods.length} className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 align-top border-r border-gray-100">
                        {day.day}
                      </td>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{period.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{period.room}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">Mentored Students</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsByCourse.map((student) => (
                  // console.log(student),
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.student_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAverage(student.examResult)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAttendence(student.attendence)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleViewDetails(student.student_id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Details Section */}
        
      </div>
    );
  };

  const renderCommunications = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Administrative Communications</h3>
          </div>
          <div className="p-4">
            {notifications.map(notification => (
              <div key={notification.id} className={`p-4 mb-3 rounded-lg border ${notification.isNew ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {notification.isNew && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">New Student Requests</h3>
          </div>
          <div className="p-4">
            <div className="p-4 mb-3 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900">New student assignment request: Emily Parker (S1167)</p>
                  <p className="text-sm text-gray-600 mt-1">9th Grade, Transferring from Wilson Middle School</p>
                  <p className="text-sm text-gray-500 mt-1">Requested on: March 20, 2025</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    onClick={handleAcceptRequest}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    onClick={() => alert("Discussion thread opened with administration")}
                  >
                    Discuss
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 mb-3 rounded-lg border border-green-200 bg-green-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900">Schedule adjustment approved: Extended office hours on Thursdays</p>
                  <p className="text-sm text-gray-600 mt-1">15:00 - 16:30, Room 204</p>
                  <p className="text-sm text-gray-500 mt-1">Effective from: April 1, 2025</p>
                </div>
                <div>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    onClick={() => alert("Viewing schedule adjustment details")}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Educator Profile</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">


            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{teacherData.name}</h2>
                <h2 className="text-1xl text-gray-600">{teacherData.id}</h2>
                <p className="text-lg text-blue-600">{teacherData.subject} Educator</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-gray-900">{teacherData.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="text-gray-900">{teacherData.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Course ID</h4>
                    <p className="text-gray-900">{teacherData.course_id}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="text-gray-900">{teacherData.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                    <p className="text-gray-900">{teacherData.dob}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                    <p className="text-gray-900">{teacherData.joinDate}</p>
                  </div>
                </div>



              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Qualifications & Certifications</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>M.S. Mathematics Education, State University (2019)</li>
                  <li>B.S. Mathematics, National University (2016)</li>
                  <li>State Teaching Certification - Advanced Mathematics</li>
                  <li>AP Calculus Certified Instructor</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Note Modal
  const renderAddNoteModal = () => {
    if (!showAddNoteModal) return null;

    const student = studentData.find(s => s.id === selectedStudentId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Note for {student?.name}</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4 h-32"
            placeholder="Enter your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => {
                setShowAddNoteModal(false);
                setNoteText('');
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={saveNote}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Update Progress Modal
  const renderUpdateProgressModal = () => {
    if (!showUpdateProgressModal) return null;

    const student = studentData.find(s => s.id === selectedStudentId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Update Progress for {student?.name}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Percentage: {progressValue}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => setShowUpdateProgressModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={saveProgress}
            >
              Save Progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Profile Menu
  // Continuation of renderProfileMenu function


  // Notification Menu
  const renderNotificationsMenu = () => {
    if (!showNotifications) return null;

    return (
      <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <div className="py-2 px-4 border-b border-gray-100">
          <h3 className="text-sm font-medium">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map(notification => (
            <a
              key={notification.id}
              href="#"
              className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${notification.isNew ? 'bg-blue-50' : ''}`}
            >
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </a>
          ))}
        </div>
        <div className="py-2 px-4 text-center border-t border-gray-100">
          <a href="#" className="text-xs text-blue-600 hover:text-blue-800" onClick={() => setShowNotifications(false)}>
            Mark all as read
          </a>
        </div>
      </div>
    );
  };

  // Render Courses Tab
  const renderCourses = () => {
    // If no course is selected, show course list  
    // If a course is selected, show course details and student list
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">{selectedCourse.name}</h3>
            <p className="text-sm text-gray-600">Course ID: {selectedCourse.id}</p>
          </div>
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setSelectedCourse(null)}
          >
            Back to Courses
          </button>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Student Attendance</h4>

          {/* Bulk selection toggle */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectMode}
              onChange={() => setSelectMode(!selectMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Enable Bulk Selection</span>

            {selectMode && selectedDates.length > 0 && (
              <button
                onClick={() => {
                  const confirmBulk = window.confirm(`Apply attendance for ${selectedDates.length} selected dates?`);
                  if (confirmBulk) {
                    selectedCourse.students.forEach(student =>
                      selectedDates.forEach(date =>
                        handleAttendanceToggle(selectedCourse.id, student.studentId, date)
                      )
                    );
                    // Reset selection after bulk apply
                    setSelectedDates([]);
                  }
                }}
                className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Apply ({selectedDates.length} dates)
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  {['2025-03-25', '2025-03-26', '2025-03-27'].map((date) => (
                    <th
                      key={date}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {date}
                      {selectMode && (
                        <input
                          type="checkbox"
                          checked={selectedDates.includes(date)}
                          onChange={() => {
                            setSelectedDates(prev =>
                              prev.includes(date)
                                ? prev.filter(d => d !== date)
                                : [...prev, date]
                            );
                          }}
                          className="ml-2 form-checkbox h-4 w-4 text-blue-600"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedCourse.students.map((student) => (
                  <tr key={student.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                    {['2025-03-25', '2025-03-26', '2025-03-27'].map((date) => (
                      <td key={date} className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={
                            attendanceData[selectedCourse.id] &&
                            attendanceData[selectedCourse.id][student.studentId] &&
                            attendanceData[selectedCourse.id][student.studentId][date]
                          }
                          onChange={() => {
                            if (selectMode) {
                              // Toggle date selection in bulk mode
                              setSelectedDates(prev =>
                                prev.includes(date)
                                  ? prev.filter(d => d !== date)
                                  : [...prev, date]
                              );
                            } else {
                              // Normal single attendance toggle
                              handleAttendanceToggle(
                                selectedCourse.id,
                                student.studentId,
                                date
                              );
                            }
                          }}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  // Main render function
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-800">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">


              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                >

                  {/* <span className="font-medium text-gray-700 hidden md:block">{teacherData.name}</span> */}

                </button>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            {/* <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'communications' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('communications')}
            >
              Communications
            </button> */}
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>

          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'courses' && renderCourses()}
        </div>
      </main>

      {/* Modals */}
      {renderAddNoteModal()}
      {renderUpdateProgressModal()}
    </div>
  );
};

export default TeacherDashboard;