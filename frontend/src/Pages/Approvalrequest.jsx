import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ApprovalRequest = ({ formData = {} }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);

  // Default values to prevent undefined errors
  const {
    name = 'N/A',
    gender = 'N/A',
    father_name = 'N/A',
    mother_name = 'N/A',
    student_email = 'N/A',
    parent_email = 'N/A',
    contact_number = 'N/A',
    alt_contact_number = 'N/A',
    dob = 'N/A',
    blood_group = 'N/A',
    comorbidity = 'N/A',
    udid = 'N/A',
    address = 'N/A',
    pincode = 'N/A',
    diagnosis = 'N/A',
    allergies = 'None',
    days_attending = [],
    available_from = 'N/A',
    available_until = 'N/A',
    photo = null,
    document = null
  } = formData;

  const handleApprove = () => {
    setApprovalStatus('approved');
  };

  const handleReject = () => {
    setApprovalStatus('rejected');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-3xl font-extrabold text-center">
            <span className="text-white">Student</span> <span className="text-blue-200">Enrollment Approval</span>
          </h2>
        </div>

        {/* Approval Content */}
        <div className="p-8 space-y-6">
          {/* Preview Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Student Details Preview</h3>
            
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-blue-600">Full Name:</p>
                <p className="text-gray-800">{name}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Gender:</p>
                <p className="text-gray-800">{gender}</p>
              </div>
              
              <div>
                <p className="font-medium text-blue-600">Father's Name:</p>
                <p className="text-gray-800">{father_name}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Mother's Name:</p>
                <p className="text-gray-800">{mother_name}</p>
              </div>
              
              {/* Contact Information */}
              <div>
                <p className="font-medium text-blue-600">Student Email:</p>
                <p className="text-gray-800">{student_email}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Parent Email:</p>
                <p className="text-gray-800">{parent_email}</p>
              </div>
              
              <div>
                <p className="font-medium text-blue-600">Contact Number:</p>
                <p className="text-gray-800">{contact_number}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Alternate Contact:</p>
                <p className="text-gray-800">{alt_contact_number}</p>
              </div>
              
              {/* Medical Information */}
              <div>
                <p className="font-medium text-blue-600">Date of Birth:</p>
                <p className="text-gray-800">{dob}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Blood Group:</p>
                <p className="text-gray-800">{blood_group}</p>
              </div>
              
              <div>
                <p className="font-medium text-blue-600">Comorbidity:</p>
                <p className="text-gray-800">{comorbidity}</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">UDID:</p>
                <p className="text-gray-800">{udid}</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-6">
              <div className="mb-4">
                <p className="font-medium text-blue-600">Full Address:</p>
                <p className="text-gray-800">{address}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-blue-600">Pin Code:</p>
                  <p className="text-gray-800">{pincode}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600">Primary Diagnosis:</p>
                  <p className="text-gray-800">{diagnosis}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-medium text-blue-600">Allergies:</p>
                <p className="text-gray-800">{allergies}</p>
              </div>
              
              <div className="mt-4">
                <p className="font-medium text-blue-600">Days Attending:</p>
                <p className="text-gray-800">{days_attending.length > 0 ? days_attending.join(', ') : 'N/A'}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="font-medium text-blue-600">Available From:</p>
                  <p className="text-gray-800">{available_from}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600">Available Until:</p>
                  <p className="text-gray-800">{available_until}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          <div className="flex justify-between items-center bg-blue-50 border-l-4 border-blue-500 p-4">
            <div>
              <p className="font-medium text-blue-600">Uploaded Documents</p>
              <div className="flex space-x-4 mt-2">
                <div>
                  <p className="text-gray-700">Student Photo:</p>
                  <p className="text-sm text-gray-500">
                    {photo ? (photo instanceof File ? photo.name : 'Uploaded') : 'Not uploaded'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">Health Report:</p>
                  <p className="text-sm text-gray-500">
                    {document ? (document instanceof File ? document.name : 'Uploaded') : 'Not uploaded'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Buttons */}
          {!approvalStatus && (
            <div className="flex justify-center space-x-6 mt-6">
              <button 
                onClick={handleApprove}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <CheckCircle2 className="mr-2" /> Approve Enrollment
              </button>
              <button 
                onClick={handleReject}
                className="flex items-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <XCircle className="mr-2" /> Reject Enrollment
              </button>
            </div>
          )}

          {/* Approval Status */}
          {approvalStatus && (
            <div className={`text-center p-4 rounded-md ${
              approvalStatus === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {approvalStatus === 'approved' 
                ? 'Enrollment Approved Successfully' 
                : 'Enrollment Rejected'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default props to ensure component works even with no data
ApprovalRequest.defaultProps = {
  formData: {}
};

export default ApprovalRequest;