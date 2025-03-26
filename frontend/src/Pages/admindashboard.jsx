import React, { useState ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import CalendarScheduleViewer from '../components/Calendarschedule';
import { Link } from "react-router-dom";
import { Bell, Home, Search, User, Settings, LogOut, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
const AdminDashboard = () => {
 const navigate = useNavigate();


 // const [showNotifications, setShowNotifications] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [educatorCount, setEducatorCount] = useState(0); 
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentSearchBy, setStudentSearchBy] = useState('name');
  const [appliedStudentSearch, setAppliedStudentSearch] = useState({ 
    query: '', 
    by: 'name' 
  });
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/student-count/'); // Replace with your API URL
        setStudentCount(response.data.student_count); // Update state with the count
      } catch (error) {
        console.error('Error fetching student count:', error);
      }
    };

    fetchStudentCount();
  }, []); 
  useEffect(() => {
    const fetchEducatorCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/educator-count/'); // Replace with your API URL
        setEducatorCount(response.data.student_count); // Update state with the count
      } catch (error) {
        console.error('Error fetching educator count:', error);
      }
    };

    fetchEducatorCount();
  }, []);
  // Sample admin data
  console.log(setEducatorCount);
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    lastLogin: "Today at 09:15 AM",
    joinDate: "Jan 15, 2023"
  };
  const programs = [
    { id: "PROG001", name: "Computer Science", description: "Comprehensive CS Program" },
    { id: "PROG002", name: "Data Science", description: "Advanced Data Analytics" },
    { id: "PROG003", name: "Web Development", description: "Full-Stack Web Technologies" },
    { id: "PROG004", name: "Machine Learning", description: "AI and Deep Learning" }
  ];
  // Sample data for notifications
  const notifications = [
    { id: 1, text: 'New user registered', time: '5 min ago' },
    { id: 2, text: 'Report generated', time: '1 hour ago' },
    { id: 3, text: 'System update completed', time: '3 hours ago' }
  ];

  // Sample user data
  const users = [
    { id: "USR001", name: "John Smith", city: "New York", profession: "teacher", email: "john.smith@example.com" },
    { id: "USR002", name: "Emily Johnson", city: "Los Angeles", profession: "student", email: "emily.j@example.com" },
    { id: "USR003", name: "Michael Brown", city: "Chicago", profession: "teacher", email: "michael.b@example.com" },
    { id: "USR004", name: "Sarah Davis", city: "Houston", profession: "student", email: "sarah.d@example.com" },
    { id: "USR005", name: "David Wilson", city: "Phoenix", profession: "teacher", email: "david.w@example.com" },
    { id: "USR006", name: "Jessica Taylor", city: "Philadelphia", profession: "student", email: "jessica.t@example.com" },
    { id: "USR007", name: "James Martinez", city: "San Antonio", profession: "teacher", email: "james.m@example.com" },
    { id: "USR008", name: "Jennifer Garcia", city: "San Diego", profession: "student", email: "jennifer.g@example.com" },
    { id: "USR009", name: "Robert Miller", city: "Dallas", profession: "teacher", email: "robert.m@example.com" },
    { id: "USR010", name: "Lisa Rodriguez", city: "San Jose", profession: "student", email: "lisa.r@example.com" }
  ];

  // New student enrollment data
  const studentEnrollments = [
    { 
      id: "USR002", 
      name: "Emily Johnson", 
      course: "Computer Science", 
      enrollmentDate: "2024-01-15", 
      status: "approved" 
    },
    { 
      id: "USR004", 
      name: "Sarah Davis", 
      course: "Data Science", 
      enrollmentDate: "2024-02-20", 
      status: "unapproved" 
    },
    { 
      id: "USR006", 
      name: "Jessica Taylor", 
      course: "Machine Learning", 
      enrollmentDate: "2024-03-10", 
      status: "approved" 
    },
    { 
      id: "USR008", 
      name: "Jennifer Garcia", 
      course: "Web Development", 
      enrollmentDate: "2024-03-25", 
      status: "unapproved" 
    },
    { 
      id: "USR010", 
      name: "Lisa Rodriguez", 
      course: "Cybersecurity", 
      enrollmentDate: "2024-04-05", 
      status: "approved" 
    }
  ];

 {/* const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };*/}

{/*}  const toggleSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions);
    if (showNotifications) setShowNotifications(false);
    if (showProfile) setShowProfile(false);
  };*/}


  
  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (showSearchOptions) setShowSearchOptions(false);
    if (showNotifications) setShowNotifications(false);
  };

{/*  const handleSearch = () => {
    const filtered = users.filter(user => {
      const value = user[searchBy].toLowerCase();
      return value.includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filtered);
    setHasSearched(true);
    setShowSearchOptions(false);
  };*/}

{/*  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };*/}

 {/*} const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setFilteredUsers([]);
  };*/}
  const handleStudentSearch = () => {
    setAppliedStudentSearch({
      query: studentSearchQuery,
      by: studentSearchBy
    });
  };

  // New method to render tab content
  const renderTabContent = () => {
    switch(selectedTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'students':
        return renderStudentEnrollments();
      default:
        return renderDashboardContent();
    }
  };

  // Existing dashboard content method
  const renderDashboardContent = () => (
    <>
      {/* Existing dashboard stats code */}
   
       <div>

       <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
         <Link to="/admin/program-list" className="bg-indigo-50 overflow-hidden shadow rounded-lg hover:bg-indigo-100 transition-colors">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Programs</dt>
                   <dd className="flex items-baseline">
                     <div className="text-2xl font-semibold text-gray-900">{programs.length}</div>
                   </dd>
                 </dl>
               </div>
             </div>
           </div>
         </Link>
       
         <Link to="/admin/educator-list" className="bg-green-50 overflow-hidden shadow rounded-lg hover:bg-green-100 transition-colors">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Educators</dt>
                   <dd className="flex items-baseline">
                     <div className="text-2xl font-semibold text-gray-900">
                       {educatorCount}
                     </div>
                   </dd>
                 </dl>
               </div>
             </div>
           </div>
         </Link>
       
         <Link to="/admin/student-list" className="bg-blue-50 overflow-hidden shadow rounded-lg hover:bg-blue-100 transition-colors">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path d="M12 14l9-5-9-5-9 5 9 5z" />
                   <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Students</dt>
                   <dd className="flex items-baseline">
                     <div className="text-2xl font-semibold text-gray-900">
                       {studentCount}
                     </div>
                   </dd>
                 </dl>
               </div>
             </div>
           </div>
         </Link>
       </div>
       
 
      { <div className="mt-8">
      <CalendarScheduleViewer />
       </div>}
     </div>
      
    </>
  );
{
  // New method to render student enrollments
{/*  const renderStudentEnrollments = () => {
    const studentList = studentEnrollments.filter(enrollment => {
      const value = enrollment[appliedStudentSearch.by].toLowerCase();
      return value.includes(appliedStudentSearch.query.toLowerCase());
    });

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Student Enrollments</h1>
        
       
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
            />
            <select
              value={studentSearchBy}
              onChange={(e) => setStudentSearchBy(e.target.value)}
              className="absolute right-2 top-2 border rounded-lg px-2 py-1 bg-white text-sm"
            >
              <option value="name">Name</option>
              <option value="course">Course</option>
            </select>
          </div>
          <button
            onClick={handleStudentSearch}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

       
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentList.map(enrollment => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {enrollment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollment.enrollmentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View Details
                    </button>
                    <button className={`px-2 py-1 rounded text-xs ${
                      enrollment.status === 'approved' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}>
                      {enrollment.status === 'approved' ? 'Revoke' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );*/}
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
                <span className="text-xl font-bold text-indigo-600">Admin Portal</span>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center">
                  <Home className="h-5 w-5 mr-1" />
                  Home
                </button>
              </div>
            </div>
            
            {/* Right side - Search, notifications, and profile */}
            <div className="flex items-center">
            

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin</span>
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
                          <h3 className="text-sm font-semibold">{adminData.name}</h3>
                          <p className="text-xs text-gray-500">{adminData.email}</p>
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
                        <p className="text-xs text-gray-500 mb-1">Member Since</p>
                        <p className="text-sm">{adminData.joinDate}</p>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                       {/* <button className="flex items-center w-full py-2 px-1 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </button>
                        <button className="flex items-center w-full py-2 px-1 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help Center
                        </button>*/}
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
        {/* Add tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('dashboard')}
              className={`py-4 px-1 text-sm font-medium ${
                selectedTab === 'dashboard' 
                  ? 'border-indigo-500 text-indigo-600 border-b-2' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
           {/* <button
              onClick={() => setSelectedTab('students')}
              className={`py-4 px-1 text-sm font-medium ${
                selectedTab === 'students' 
                  ? 'border-indigo-500 text-indigo-600 border-b-2' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student Enrollments
            </button>*/}
          </nav>
        </div>

        {/* Conditionally render content based on selected tab */}
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
