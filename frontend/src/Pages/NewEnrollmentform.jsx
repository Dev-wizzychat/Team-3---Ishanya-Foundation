import React, { useState } from "react";
import axios from "axios";
const daysOfWeek = [
  "All",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function EnrollForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    gender: "",
    father_name: "",
    mother_name: "",
    student_email: "",
    parent_email: "",
    contact_number: "",
    alt_contact_number: "",
    address: "",
    pincode: "",
    dob: "",
    blood_group: "",
    comorbidity: "",
    udid: "",
    diagnosis: "",
    allergies: "",
    days_attending: [],
    available_from: "",
    available_until: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleDaysChange = (e) => {
    const { value, checked } = e.target;

    if (value === "All") {
      // If "All" is checked, select all days
      setFormData((prev) => ({
        ...prev,
        days_attending: checked ? ["All", ...daysOfWeek] : [],
      }));
    } else {
      // If a specific day is checked/unchecked
      setFormData((prev) => {
        const updatedDays = checked
          ? [...prev.days_attending, value]
          : prev.days_attending.filter((day) => day !== value);

        // If all days are selected, include "All"
        if (updatedDays.length === daysOfWeek.length) {
          updatedDays.push("All");
        }

        // If "All" is unchecked, remove it
        if (
          updatedDays.includes("All") &&
          updatedDays.length !== daysOfWeek.length + 1
        ) {
          updatedDays.splice(updatedDays.indexOf("All"), 1);
        }

        return { ...prev, days_attending: updatedDays };
      });
    }
  };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (name === "photo" && files[0]) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
        setPhotoPreview(URL.createObjectURL(files[0]));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation rules matching original implementation
    if (!formData.name || !/^[A-Za-z ]+$/i.test(formData.name)) {
      newErrors.name = "Invalid name";
    }
    if (!formData.father_name || !/^[A-Za-z ]+$/i.test(formData.father_name)) {
      newErrors.father_name = "Invalid name";
    }
    if (!formData.mother_name || !/^[A-Za-z ]+$/i.test(formData.mother_name)) {
      newErrors.mother_name = "Invalid name";
    }
    if (
      !formData.student_email ||
      !/\S+@\S+\.\S+/.test(formData.student_email)
    ) {
      newErrors.student_email = "Invalid email";
    }
    if (!formData.parent_email || !/\S+@\S+\.\S+/.test(formData.parent_email)) {
      newErrors.parent_email = "Invalid email";
    }
    if (
      !formData.contact_number ||
      !/^[0-9]{10}$/.test(formData.contact_number)
    ) {
      newErrors.contact_number = "Invalid number";
    }
    if (
      !formData.alt_contact_number ||
      !/^[0-9]{10}$/.test(formData.alt_contact_number)
    ) {
      newErrors.alt_contact_number = "Invalid number";
    }
    if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pin";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!formData.blood_group) {
      newErrors.blood_group = "Blood Group is required";
    }
    if (!formData.comorbidity) {
      newErrors.comorbidity = "Selection is required";
    }
    if (!formData.udid) {
      newErrors.udid = "Selection is required";
    }
    if (!formData.diagnosis) {
      newErrors.diagnosis = "Diagnosis is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    console.log(formData);
    try {
      const API = import.meta.env.VITE_API_BASE_URL;
      console.log(API);
      const response = await axios.post(`${API}/add-student/`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const response = await fetch(
      //   `${import.meta.env.VITE_BACKEND_URL}/add-student/`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(formData),
      //   }
      // );

      if (!response.ok) throw new Error("Submission failed");

      setSubmissionMessage("Successfully submitted");
    } catch (error) {
      setSubmissionMessage("Try again");
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="max-w-4xl mx-auto p-4"
      style={{
        backgroundImage: "url('your-image-url.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="bg-white border border-blue-300 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Enrollment Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Photo Upload with Preview */}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student_ID
            </label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.gender ? "border-red-500" : "border-blue-300"
              }`}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Father's Name
            </label>
            <input
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.father_name ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.father_name && (
              <p className="text-red-500 text-xs mt-1">{errors.father_name}</p>
            )}
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mother's Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.mother_name ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.mother_name && (
              <p className="text-red-500 text-xs mt-1">{errors.mother_name}</p>
            )}
          </div>

          {/* Student Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email ID
            </label>
            <input
              type="email"
              name="student_email"
              value={formData.student_email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.student_email ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.student_email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.student_email}
              </p>
            )}
          </div>

          {/* Parent Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Email ID
            </label>
            <input
              type="email"
              name="parent_email"
              value={formData.parent_email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.parent_email ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.parent_email && (
              <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.contact_number ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.contact_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          {/* Alternate Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternate Contact Number
            </label>
            <input
              type="tel"
              name="alt_contact_number"
              value={formData.alt_contact_number}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.alt_contact_number ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.alt_contact_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.alt_contact_number}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.address ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Pin Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Code
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.pincode ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.dob ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.blood_group ? "border-red-500" : "border-blue-300"
              }`}
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.blood_group && (
              <p className="text-red-500 text-xs mt-1">{errors.blood_group}</p>
            )}
          </div>

          {/* Comorbidity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comorbidity
            </label>
            <select
              name="comorbidity"
              value={formData.comorbidity}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.comorbidity ? "border-red-500" : "border-blue-300"
              }`}
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.comorbidity && (
              <p className="text-red-500 text-xs mt-1">{errors.comorbidity}</p>
            )}
          </div>

          {/* UDID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UDID
            </label>
            <select
              name="udid"
              value={formData.udid}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.udid ? "border-red-500" : "border-blue-300"
              }`}
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.udid && (
              <p className="text-red-500 text-xs mt-1">{errors.udid}</p>
            )}
          </div>

          {/* Primary Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.diagnosis ? "border-red-500" : "border-blue-300"
              }`}
              required
            />
            {errors.diagnosis && (
              <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>
            )}
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded"
              placeholder="Optional"
            />
          </div>

          {/* Available Timings */}
          <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From
              </label>
              <input
                type="time"
                name="available_from"
                value={formData.available_from}
                onChange={handleChange}
                className="w-full p-2 border border-blue-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Until
              </label>
              <input
                type="time"
                name="available_until"
                value={formData.available_until}
                onChange={handleChange}
                className="w-full p-2 border border-blue-300 rounded"
                required
              />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Attending
            </label>
            <div className="grid grid-cols-4 gap-2">
              {/* "All" Checkbox */}

              {/* Days of the Week Checkboxes */}
              {daysOfWeek.map((day) => (
                <div key={day}>
                  <input
                    type="checkbox"
                    id={day}
                    value={day}
                    checked={formData.days_attending.includes(day)}
                    onChange={handleDaysChange}
                  />
                  <label htmlFor={day} className="ml-2">
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Health Report Upload */}

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div
              className={`col-span-1 md:col-span-2 text-center p-3 rounded-lg ${
                submissionMessage.includes("Successfully")
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submissionMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EnrollForm;
