import React, { useState } from 'react';
import { Bell, Home, Search, User, Settings, LogOut, HelpCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Sample admin data
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    lastLogin: "Today at 09:15 AM",
    joinDate: "Jan 15, 2023"
  };
  
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const handleSearch = () => {
    const filtered = users.filter(user => {
      const value = user[searchBy].toLowerCase();
      return value.includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filtered);
    setHasSearched(true);
    setShowSearchOptions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setFilteredUsers([]);
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
              {/* Search */}
              <div className="relative mr-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 w-48 focus:outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    onClick={handleSearch}
                    className="bg-indigo-500 p-2 hover:bg-indigo-600 text-white"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={toggleSearchOptions}
                    className="bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* Search options dropdown */}
                {showSearchOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Search by:</p>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="searchBy" 
                            value="name" 
                            checked={searchBy === 'name'} 
                            onChange={() => setSearchBy('name')}
                            className="mr-2"
                          />
                          Name
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="searchBy" 
                            value="id" 
                            checked={searchBy === 'id'} 
                            onChange={() => setSearchBy('id')}
                            className="mr-2"
                          />
                          ID
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="searchBy" 
                            value="city" 
                            checked={searchBy === 'city'} 
                            onChange={() => setSearchBy('city')}
                            className="mr-2"
                          />
                          City
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="searchBy" 
                            value="profession" 
                            checked={searchBy === 'profession'} 
                            onChange={() => setSearchBy('profession')}
                            className="mr-2"
                          />
                          Profession
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
                  <Bell className="h-6 w-6 text-gray-500" />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <button className="text-xs text-indigo-600 hover:text-indigo-800">
                          Mark all as read
                        </button>
                      </div>
                      <div className="divide-y">
                        {notifications.map(notification => (
                          <div key={notification.id} className="py-2">
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
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
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome to your admin dashboard. You can search for users by name, ID, city, or profession.</p>
          
          {/* Search Results */}
          {hasSearched && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-700">
                  Search Results ({filteredUsers.length})
                </h2>
                <button 
                  onClick={handleClearSearch}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Clear
                </button>
              </div>
              
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.profession === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {user.profession}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No users found matching "{searchQuery}" in {searchBy}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Dashboard Stats (only shown when not displaying search results) */}
          {!hasSearched && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{users.length}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Teachers</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {users.filter(user => user.profession === 'teacher').length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
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
                            {users.filter(user => user.profession === 'student').length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;