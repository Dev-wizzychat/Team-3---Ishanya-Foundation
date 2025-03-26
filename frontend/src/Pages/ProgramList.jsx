import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, Filter, User, Home, Edit, ArrowLeft } from 'lucide-react';

// Mock data for demonstration


const ProgramList = () => {
  // const [programs, setPrograms] = useState([]); // State to store programs
  // const [filteredPrograms, setFilteredPrograms] = useState([]); // State for filtered programs
  // const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const [programs, setPrograms] = useState([]);
  // const [programs, setPrograms] = useState(mockPrograms);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    program: '',
    course: '',
    teacher: ''
  });
  const [showAddProgramForm, setShowAddProgramForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042'];
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const API = import.meta.env.VITE_API_BASE_URL; // Replace with your API base URL
        const response = await axios.get(`http://localhost:8000/all-programs`); // Replace with your backend endpoint
        setPrograms(response.data); // Assuming the API returns an array of programs
        setFilteredPrograms(response.data); // Initialize filtered programs
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);
  useEffect(() => {

    let results = programs;

    // Apply search
    if (searchTerm) {
      results = results.filter(program =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.courses.some(course =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters.program) {
      results = results.filter(program =>
        program.name.toLowerCase().includes(filters.program.toLowerCase())
      );
    }

    if (filters.course) {
      results = results.filter(program =>
        program.courses.some(course =>
          course.name.toLowerCase().includes(filters.course.toLowerCase())
        )
      );
    }

    if (filters.teacher) {
      results = results.filter(program =>
        program.courses.some(course =>
          course.teacher.toLowerCase().includes(filters.teacher.toLowerCase())
        )
      );
    }

    setFilteredPrograms(results);
  }, [searchTerm, filters, programs]);

  useEffect(() => {
    // Fetch all courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/all-courses/');
        setPrograms(response.data); // Assuming the API returns programs with courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setSelectedCourse(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsEditing(false);
  };

  const handleBackToPrograms = () => {
    setSelectedProgram(null);
    setSelectedCourse(null);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSave = (e) => {
    e.preventDefault();

    // Here you would typically save changes to the backend
    // For this example, we'll just update the local state

    const updatedCourse = {
      ...selectedCourse,
      name: e.target.courseName.value,
      teacher: e.target.teacherName.value,
      progress: parseInt(e.target.progress.value),
      totalStudents: parseInt(e.target.totalStudents.value),
      attendingStudents: parseInt(e.target.attendingStudents.value)
    };

    const updatedProgram = {
      ...selectedProgram,
      courses: selectedProgram.courses.map(course =>
        course.id === selectedCourse.id ? updatedCourse : course
      )
    };

    setPrograms(programs.map(program =>
      program.id === selectedProgram.id ? updatedProgram : program
    ));

    setSelectedProgram(updatedProgram);
    setSelectedCourse(updatedCourse);
    setIsEditing(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();

    const newProgram = {
      name: e.target.programName.value,
      description: e.target.programDescription.value,
      duration: parseInt(e.target.programDuration.value),
      educator_enrolled: e.target.educatorEnrolled.value.split(',').map((id) => id.trim()),
      students_enrolled: e.target.studentsEnrolled.value.split(',').map((id) => id.trim()),
      start_date: e.target.startDate.value,
      courses: []
    };

    try {
      await axios.post('http://127.0.0.1:8000/add-course/', newProgram);
      setPrograms([...programs, { id: Date.now(), ...newProgram }]); // Add locally for immediate UI update
      setShowAddProgramForm(false);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error adding program:', error);
      setErrorMessage('Failed to add program. Please try again later.');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    const updatedCourse = {
      name: e.target.courseName.value,
      teacher: e.target.teacherName.value,
      description: e.target.courseDescription.value,
      progress: parseInt(e.target.progress.value),
      totalStudents: parseInt(e.target.totalStudents.value),
      attendingStudents: parseInt(e.target.attendingStudents.value)
    };

    try {
      await axios.put(`http://127.0.0.1:8000/update-course/${selectedCourse.id}/`, updatedCourse);
      const updatedProgram = {
        ...selectedProgram,
        courses: selectedProgram.courses.map(course =>
          course.id === selectedCourse.id ? { ...selectedCourse, ...updatedCourse } : course
        )
      };

      setPrograms(programs.map(program =>
        program.id === selectedProgram.id ? updatedProgram : program
      ));
      setSelectedProgram(updatedProgram);
      setSelectedCourse({ ...selectedCourse, ...updatedCourse });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-course/${courseId}/`);
      const updatedProgram = {
        ...selectedProgram,
        courses: selectedProgram.courses.filter(course => course.id !== courseId)
      };

      setPrograms(programs.map(program =>
        program.id === selectedProgram.id ? updatedProgram : program
      ));
      setSelectedProgram(updatedProgram);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const renderProgramList = () => (
    <div className="w-full h-full bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <div className="flex space-x-4">
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
        {/* <div className="mb-8">
          {errorMessage && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddProgramForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Program
            </button>
          </div>

          {showAddProgramForm && (
            <form onSubmit={handleAddProgram} className="bg-white shadow rounded-md p-4 mb-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="programName" className="block text-sm font-medium text-gray-700">
                    Program Name
                  </label>
                  <input
                    type="text"
                    name="programName"
                    id="programName"
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="programDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="programDescription"
                    id="programDescription"
                    rows="3"
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="programDuration" className="block text-sm font-medium text-gray-700">
                    Duration (in hours)
                  </label>
                  <input
                    type="number"
                    name="programDuration"
                    id="programDuration"
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="educatorEnrolled" className="block text-sm font-medium text-gray-700">
                    Educator IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="educatorEnrolled"
                    id="educatorEnrolled"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="studentsEnrolled" className="block text-sm font-medium text-gray-700">
                    Student IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="studentsEnrolled"
                    id="studentsEnrolled"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddProgramForm(false)}
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
          )}

          <div className="max-w-3xl mx-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search programs, courses, or teachers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex space-x-2">
              <div className="relative">
                <select
                  name="program"
                  value={filters.program}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Programs</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.name}>{program.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Courses</option>
                  {programs && programs.flatMap(program =>
                    program.courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="relative">
                <select
                  name="teacher"
                  value={filters.teacher}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Teachers</option>
                  {Array.from(new Set(programs.flatMap(program =>
                    program.courses.map(course => course.teacher)
                  ))).map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div> */}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {console.log("hello", filteredPrograms)}
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <li key={program.id}>
                  <button
                    onClick={() => handleProgramClick(program)}
                    className="block hover:bg-gray-50 w-full text-left"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-indigo-600 truncate">
                            {program.name}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {program.start_date} Start Date
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {program.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Duration: {program.duration}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-gray-500">
                No programs found. Try adjusting your search or filters.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );

  const renderProgramDetail = () => (
    <div className="w-full h-full bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleBackToPrograms}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h1>
          </div>
          <div className="flex space-x-4">
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Program Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{selectedProgram.description}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedProgram.duration}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Courses</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedProgram.courses.length}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Total Students</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedProgram.courses.reduce((sum, course) => sum + course.totalStudents, 0)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Courses</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {selectedProgram.courses.map((course) => (
              <li key={course.id}>
                <button
                  onClick={() => handleCourseClick(course)}
                  className="block hover:bg-gray-50 w-full text-left"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-indigo-600 truncate">
                          {course.name}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Progress: {course.progress}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Instructor: {course.teacher}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>Students: {course.attendingStudents}/{course.totalStudents}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );

  const renderCourseDetail = () => {
    const attendanceData = [
      { name: 'Attending', value: selectedCourse.attendingStudents },
      { name: 'Absent', value: selectedCourse.totalStudents - selectedCourse.attendingStudents }
    ];

    return (
      <div className="w-full h-full bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleBackToCourses}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h1>
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Course Details</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <form onSubmit={handleUpdateCourse}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                        Course Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="courseName"
                          id="courseName"
                          defaultValue={selectedCourse.name}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">
                        Teacher Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="teacherName"
                          id="teacherName"
                          defaultValue={selectedCourse.teacher}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          name="courseDescription"
                          id="courseDescription"
                          defaultValue={selectedCourse.description}
                          rows="3"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        ></textarea>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="totalStudents" className="block text-sm font-medium text-gray-700">
                        Total Students
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="totalStudents"
                          id="totalStudents"
                          defaultValue={selectedCourse.totalStudents}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="attendingStudents" className="block text-sm font-medium text-gray-700">
                        Attending Students
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="attendingStudents"
                          id="attendingStudents"
                          defaultValue={selectedCourse.attendingStudents}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                        Progress (%)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="progress"
                          id="progress"
                          min="0"
                          max="100"
                          defaultValue={selectedCourse.progress}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Course Details</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Part of {selectedProgram.name} program
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Course name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedCourse.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Teacher</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedCourse.teacher}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Total students</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedCourse.totalStudents}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Attending students</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedCourse.attendingStudents}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Course progress</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
                            <div
                              style={{ width: `${selectedCourse.progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            ></div>
                          </div>
                        </div>
                        {selectedCourse.progress}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance Overview</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Student Performance</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Grade distribution and attendance of enrolled students.
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-700">Enrolled Students</h4>
                        <span className="text-sm text-gray-500">Total: {selectedCourse.students.length}</span>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {selectedCourse.students.map((student) => (
                          <li key={student.id} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{student.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.attendance >= 90 ? 'bg-green-100 text-green-800' :
                                student.attendance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                Attendance: {student.attendance}%
                              </span>
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Grade: {student.grade}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleDeleteCourse(selectedCourse.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Course
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
      {selectedCourse ? renderCourseDetail() :
        selectedProgram ? renderProgramDetail() :
          renderProgramList()}
    </div>
  );
};

export default ProgramList;