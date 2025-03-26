import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, User, Home, Edit, ArrowLeft, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('program');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [filters, setFilters] = useState({
    program: '',
    educator: '',
  });

  const sampleSessions = [
    {
      session_id: "SES001",
      days: ["Monday", "Wednesday", "Friday"],
      time: "10:00",
      duration: 90,
      program: "CS101",
      educator_id: "EDU1"
    },
    {
      session_id: "SES002",
      days: ["Tuesday", "Thursday"],
      time: "14:00",
      duration: 120,
      program: "DS201",
      educator_id: "EDU3"
    },
    {
      session_id: "SES003",
      days: ["Saturday"],
      time: "11:00",
      duration: 60,
      program: "WD301",
      educator_id: "EDU4"
    }
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/all-sessions`);
        console.log("API Response:", response.data); // Debugging
        setSessions(response.data);
        setFilteredSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSessions(sampleSessions); // Use sample data if API fails
        setFilteredSessions(sampleSessions);
      }
    };
    fetchSessions();
  }, []);
  useEffect(() => {
    let results = sessions;

    // Apply search
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(session => {
        if (searchType === 'program') {
          return session.program.toLowerCase().includes(searchTermLower);
        } else if (searchType === 'educatorId') {
          return session.educator_id.toLowerCase().includes(searchTermLower);
        }
        return false;
      });
    }

    // Apply filters
    if (filters.program) {
      results = results.filter(session =>
        session.program.toLowerCase().includes(filters.program.toLowerCase())
      );
    }

    if (filters.educator) {
      results = results.filter(session =>
        session.educator_id.toLowerCase().includes(filters.educator.toLowerCase())
      );
    }

    setFilteredSessions(results);
  }, [searchTerm, searchType, filters, sessions]);

  // Update selectedDays when a session is selected
  useEffect(() => {
    if (selectedSession) {
      setSelectedDays(selectedSession.days);
    }
  }, [selectedSession]);

  const handleSearch = () => {
    // Trigger search (currently redundant due to useEffect, but can be expanded)
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setIsEditing(false);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  const handleAddSession = async (e) => {
    e.preventDefault();

    const newSession = {
      session_id: e.target.sessionId.value, // Session ID
      name: e.target.name.value, // Session Name
      date_timing: e.target.dateTiming.value, // Date and Time
      duration: parseInt(e.target.duration.value), // Duration in minutes
      course_id: e.target.courseId.value, // Course ID
    };

    try {
      const response = await axios.post(`http://localhost:8000/add-session/`, newSession);

      // Add the new session to the list
      const updatedSessions = [...sessions, response.data];
      setSessions(updatedSessions);
      setFilteredSessions(updatedSessions);

      // Reset add session state
      setIsAddingSession(false);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };
  const handleUpdateSession = async (e) => {
    e.preventDefault();

    const updatedSession = {
      days: selectedDays,
      time: e.target.time.value,
      duration: parseInt(e.target.duration.value),
      program: e.target.program.value,
      educator_id: e.target.educatorId.value
    };
    try {
      await axios.put(`http://127.0.0.1:8000/update-session/${selectedSession.session_id}/`, updatedSession);

      setSessions(sessions.map(session =>
        session.session_id === selectedSession.session_id
          ? { ...selectedSession, ...updatedSession }
          : session
      ));

      setSelectedSession({ ...selectedSession, ...updatedSession });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-session/${selectedSession.session_id}/`);

      setSessions(sessions.filter(session => session.session_id !== selectedSession.session_id));
      setSelectedSession(null);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const DaysCheckboxGroup = ({ selectedDays, onDaysChange, name = "days" }) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleCheckboxChange = (day) => {
      const newSelectedDays = selectedDays.includes(day)
        ? selectedDays.filter(d => d !== day)
        : [...selectedDays, day];
      onDaysChange(newSelectedDays);
    };

    return (
      <div className="grid grid-cols-3 gap-2">
        {daysOfWeek.map(day => (
          <label key={day} className="inline-flex items-center">
            <input
              type="checkbox"
              name={name}
              value={day}
              checked={selectedDays.includes(day)}
              onChange={() => handleCheckboxChange(day)}
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-sm text-gray-700">{day}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderAddSessionForm = () => {
    return (
      <div className="w-full h-full bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsAddingSession(false)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add New Session</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Session Details</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleAddSession}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Session ID */}
                  <div className="sm:col-span-3">
                    <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700">
                      Session ID
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="sessionId"
                        id="sessionId"
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                      />
                    </div>
                  </div>

                  {/* Session Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Session Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                      />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="sm:col-span-3">
                    <label htmlFor="dateTiming" className="block text-sm font-medium text-gray-700">
                      Date and Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="datetime-local"
                        name="dateTiming"
                        id="dateTiming"
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="sm:col-span-2">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                      />
                    </div>
                  </div>

                  {/* Course ID */}
                  <div className="sm:col-span-3">
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                      Course ID
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="courseId"
                        id="courseId"
                        required
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingSession(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderSessionList = () => (
    <div className="w-full h-full bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsAddingSession(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </button>
            <button onClick={() => navigate('/')} className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <Home className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search input with dropdown */}
        <div className="mb-4 flex items-center space-x-2">
          {/* Search Type Dropdown */}
          {/* Search Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {searchType === 'sessionId' ? 'Session ID' : 'Session Name'}
              <ChevronDown className="ml-2 -mr-1 h-5 w-5" />
            </button>

            {isSearchDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                <ul className="py-1">
                  <li
                    onClick={() => {
                      setSearchType('Session ID');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Session ID
                  </li>
                  <li
                    onClick={() => {
                      setSearchType('Session Name');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Session Name
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search by ${searchType === 'program' ? 'Program' : 'Educator ID'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <li key={session.session_id}>
                
                  <div className="px-4 py-4 sm:px-6">
                    {/* Session ID Title */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Session ID: {session.session_id}
                      </h3>
                    </div>

                    {/* Session Details */}
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="mt-2 flex flex-col text-sm text-gray-500 sm:mt-0">
                        <p>
                          <span className="font-medium text-gray-700">Session Name:</span> {session.name}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Course ID:</span> {session.course_id}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Timing:</span> {session.date_timing}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Duration:</span> {session.duration} mins
                        </p>
                      </div>
                    </div>
                  </div>
                
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );

  const renderSessionDetail = () => {
    return (
      <div className="w-full h-full bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleBackToSessions}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Session {selectedSession.session_id}</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Details'}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <Home className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>


        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {isEditing ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Session Details</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <form onSubmit={handleUpdateSession}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                        Days of Week
                      </label>
                      <DaysCheckboxGroup
                        selectedDays={selectedDays}
                        onDaysChange={setSelectedDays}
                      />
                      <input
                        type="hidden"
                        name="days"
                        value={JSON.stringify(selectedDays)}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          name="time"
                          id="time"
                          defaultValue={selectedSession.time}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="duration"
                          id="duration"
                          defaultValue={selectedSession.duration}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                        Program
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="program"
                          id="program"
                          defaultValue={selectedSession.program}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="educatorId" className="block text-sm font-medium text-gray-700">
                        Educator ID
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="educatorId"
                          id="educatorId"
                          defaultValue={selectedSession.educator_id}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-9"
                        />
                      </div>
                    </div>
                  </div>


                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Session Details</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Session ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedSession.session_id}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Days</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSession.days.join(', ')}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Time</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSession.time}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedSession.duration} minutes</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Program</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedSession.program}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Educator ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedSession.educator_id}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleDeleteSession()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Session
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isAddingSession ? (
        renderAddSessionForm()
      ) : selectedSession ? (
        renderSessionDetail()
      ) : (
        renderSessionList()
      )}
    </div>
  );
};

export default SessionList;