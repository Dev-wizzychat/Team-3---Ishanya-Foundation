import React, { useState } from 'react';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    primaryDiagnosis: '',
    comorbidity: '',
    udid: '',
    program1: '',
    program2: '',
    sessionsPerWeek: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    educatorName: '',
    secondaryEducatorName: '',
    fathersName: '',
    mothersName: '',
    bloodGroup: '',
    allergies: '',
    contactNumber: '',
    alternateContactNumber: '',
    parentsEmail: '',
    studentsEmail: '',
    address: '',
    transport: '',
    strengths: '',
    weaknesses: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        daysOfWeek: [...prev.daysOfWeek, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        daysOfWeek: prev.daysOfWeek.filter(day => day !== value)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Registration form submitted successfully!");
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const educators = ["Educator 1", "Educator 2", "Educator 3", "Educator 4"];
  const programs = ["Program A", "Program B", "Program C", "Program D"];
  const diagnoses = ["Autism", "ADHD", "Learning Disability", "Developmental Delay", "Other"];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Registration Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    accept="image/*"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Diagnosis Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Diagnosis Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="primaryDiagnosis" className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
                  <select
                    id="primaryDiagnosis"
                    name="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Diagnosis</option>
                    {diagnoses.map(diagnosis => (
                      <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="comorbidity" className="block text-sm font-medium text-gray-700">Comorbidity</label>
                  <select
                    id="comorbidity"
                    name="comorbidity"
                    value={formData.comorbidity}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="udid" className="block text-sm font-medium text-gray-700">UDID</label>
                  <select
                    id="udid"
                    name="udid"
                    value={formData.udid}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Program Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Program Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="program1" className="block text-sm font-medium text-gray-700">Program 1</label>
                  <select
                    id="program1"
                    name="program1"
                    value={formData.program1}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="program2" className="block text-sm font-medium text-gray-700">Program 2</label>
                  <select
                    id="program2"
                    name="program2"
                    value={formData.program2}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="sessionsPerWeek" className="block text-sm font-medium text-gray-700">Sessions Per Week</label>
                  <input
                    type="number"
                    id="sessionsPerWeek"
                    name="sessionsPerWeek"
                    value={formData.sessionsPerWeek}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Timings</label>
                  <div className="flex space-x-4">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="self-center">to</span>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                <div className="flex flex-wrap gap-4">
                  {days.map(day => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={day}
                        checked={formData.daysOfWeek.includes(day)}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Educator Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Educator Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="educatorName" className="block text-sm font-medium text-gray-700">Primary Educator</label>
                  <select
                    id="educatorName"
                    name="educatorName"
                    value={formData.educatorName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Educator</option>
                    {educators.map(educator => (
                      <option key={educator} value={educator}>{educator}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="secondaryEducatorName" className="block text-sm font-medium text-gray-700">Secondary Educator</label>
                  <select
                    id="secondaryEducatorName"
                    name="secondaryEducatorName"
                    value={formData.secondaryEducatorName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Educator</option>
                    {educators.map(educator => (
                      <option key={educator} value={educator}>{educator}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fathersName" className="block text-sm font-medium text-gray-700">Father's Name</label>
                  <input
                    type="text"
                    id="fathersName"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="mothersName" className="block text-sm font-medium text-gray-700">Mother's Name</label>
                  <input
                    type="text"
                    id="mothersName"
                    name="mothersName"
                    value={formData.mothersName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <input
                    type="text"
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="alternateContactNumber" className="block text-sm font-medium text-gray-700">Alternate Contact Number</label>
                  <input
                    type="tel"
                    id="alternateContactNumber"
                    name="alternateContactNumber"
                    value={formData.alternateContactNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="parentsEmail" className="block text-sm font-medium text-gray-700">Parent's Email</label>
                  <input
                    type="email"
                    id="parentsEmail"
                    name="parentsEmail"
                    value={formData.parentsEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="studentsEmail" className="block text-sm font-medium text-gray-700">Student's Email</label>
                  <input
                    type="email"
                    id="studentsEmail"
                    name="studentsEmail"
                    value={formData.studentsEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="transport" className="block text-sm font-medium text-gray-700">Transport Required</label>
                  <select
                    id="transport"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">Additional Information</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label htmlFor="strengths" className="block text-sm font-medium text-gray-700">Strengths</label>
                  <textarea
                    id="strengths"
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-700">Areas for Improvement</label>
                  <textarea
                    id="weaknesses"
                    name="weaknesses"
                    value={formData.weaknesses}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Additional Comments</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentForm;