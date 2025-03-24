import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, Filter, User, Home, Edit, ArrowLeft } from 'lucide-react';

// Mock data for demonstration
const mockPrograms = [
  {
    id: 1,
    name: "Web Development Bootcamp",
    description: "Comprehensive web development course covering HTML, CSS, JavaScript, and React",
    duration: "12 weeks",
    courses: [
      {
        id: 101,
        name: "HTML & CSS Fundamentals",
        teacher: "Sarah Johnson",
        totalStudents: 30,
        attendingStudents: 27,
        progress: 75,
        students: [
          { id: 1001, name: "John Smith", attendance: 90, grade: "A" },
          { id: 1002, name: "Emily Davis", attendance: 85, grade: "B+" },
          { id: 1003, name: "Michael Brown", attendance: 95, grade: "A+" },
          { id: 1004, name: "Jessica Wilson", attendance: 80, grade: "B" },
          { id: 1005, name: "David Lee", attendance: 78, grade: "B-" },
        ]
      },
      {
        id: 102,
        name: "JavaScript Basics",
        teacher: "Robert Chen",
        totalStudents: 28,
        attendingStudents: 24,
        progress: 65,
        students: [
          { id: 1001, name: "John Smith", attendance: 88, grade: "B+" },
          { id: 1002, name: "Emily Davis", attendance: 92, grade: "A-" },
          { id: 1003, name: "Michael Brown", attendance: 90, grade: "A-" },
          { id: 1006, name: "Amanda Rodriguez", attendance: 86, grade: "B+" },
          { id: 1007, name: "Kevin Patel", attendance: 82, grade: "B" },
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Data Science Program",
    description: "Learn data analysis, visualization, and machine learning",
    duration: "16 weeks",
    courses: [
      {
        id: 201,
        name: "Python for Data Analysis",
        teacher: "Daniel White",
        totalStudents: 25,
        attendingStudents: 22,
        progress: 80,
        students: [
          { id: 2001, name: "Lisa Park", attendance: 92, grade: "A" },
          { id: 2002, name: "Ryan Thompson", attendance: 88, grade: "B+" },
          { id: 2003, name: "Maria Garcia", attendance: 95, grade: "A+" },
          { id: 2004, name: "Thomas Moore", attendance: 85, grade: "B" },
          { id: 2005, name: "Sophia Chen", attendance: 91, grade: "A-" },
        ]
      },
      {
        id: 202,
        name: "Machine Learning Fundamentals",
        teacher: "Jennifer Lewis",
        totalStudents: 22,
        attendingStudents: 18,
        progress: 60,
        students: [
          { id: 2001, name: "Lisa Park", attendance: 89, grade: "B+" },
          { id: 2002, name: "Ryan Thompson", attendance: 91, grade: "A-" },
          { id: 2003, name: "Maria Garcia", attendance: 93, grade: "A" },
          { id: 2006, name: "James Wilson", attendance: 82, grade: "B-" },
          { id: 2007, name: "Olivia Jackson", attendance: 87, grade: "B+" },
        ]
      }
    ]
  },
  {
    id: 3,
    name: "UX/UI Design Certification",
    description: "Master user experience and interface design principles",
    duration: "10 weeks",
    courses: [
      {
        id: 301,
        name: "UX Research Methods",
        teacher: "Michelle Torres",
        totalStudents: 20,
        attendingStudents: 17,
        progress: 70,
        students: [
          { id: 3001, name: "Christopher Lee", attendance: 87, grade: "B+" },
          { id: 3002, name: "Samantha Clark", attendance: 92, grade: "A-" },
          { id: 3003, name: "Nathan Wright", attendance: 89, grade: "B+" },
          { id: 3004, name: "Ashley Martinez", attendance: 94, grade: "A" },
          { id: 3005, name: "Brian Johnson", attendance: 91, grade: "A-" },
        ]
      },
      {
        id: 302,
        name: "UI Design Principles",
        teacher: "Alex Reynolds",
        totalStudents: 18,
        attendingStudents: 15,
        progress: 85,
        students: [
          { id: 3001, name: "Christopher Lee", attendance: 90, grade: "A-" },
          { id: 3002, name: "Samantha Clark", attendance: 94, grade: "A" },
          { id: 3003, name: "Nathan Wright", attendance: 88, grade: "B+" },
          { id: 3006, name: "Megan Brown", attendance: 92, grade: "A-" },
          { id: 3007, name: "Justin Kim", attendance: 85, grade: "B" },
        ]
      }
    ]
  }
];

const ProgramList = () => {
  const [programs, setPrograms] = useState(mockPrograms);
  const [filteredPrograms, setFilteredPrograms] = useState(mockPrograms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    program: '',
    course: '',
    teacher: ''
  });
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042'];

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
        <div className="mb-8">
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
                  {programs.flatMap(program => 
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
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
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
                            {program.courses.length} Courses
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
                <form onSubmit={handleEditSave}>
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
                      onClick={handleEditToggle}
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
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                student.attendance >= 90 ? 'bg-green-100 text-green-800' :
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