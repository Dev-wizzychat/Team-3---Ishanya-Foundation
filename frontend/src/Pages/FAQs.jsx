import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Import icons
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const StudentFAQSection = ({ bg2, faq2 }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [studentId, setStudentId] = useState(""); // State to store the entered Student ID
  const navigate = useNavigate(); // Hook for navigation
  const [educatorId, setEducatorId] = useState("");
  const handleQuestionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubmit = () => {
    if (studentId.trim() !== "") {
      navigate(`/student-dashboard/${studentId}`); // Navigate to student-dashboard with the Student ID
    } else {
      alert("Please enter a valid Student ID."); // Alert if the input is empty
    }
  };
  const handleSubmitEducator = () => {
    if (educatorId.trim() !== "") {
      navigate(`/educator-dashboard/${educatorId}`); // Navigate to student-dashboard with the Student ID
    } else {
      alert("Please enter a valid Educator ID."); // Alert if the input is empty
    }
  };
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Info Box */}
        <div className="bg-[#001f3f] p-6 border-4 border-gray-300 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">
            Are You A Student?
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2 border border-white rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">
            Are You An Educator?
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your Student ID"
              value={educatorId}
              onChange={(e) => setEducatorId(e.target.value)}
              className="w-full px-4 py-2 border border-white rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSubmitEducator}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 border-4 border-gray-300 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-red-800">
            FREQUENTLY ASKED QUESTIONS (FAQs)
          </h2>
          <ul className="space-y-4">
            {[
              {
                question: "What is Ishanya India Foundation?",
                answer:
                  "Ishanya India Foundation is a nonprofit organization focused on empowering individuals through education and capacity-building programs.",
              },
              {
                question: "How can I enroll in your programs?",
                answer:
                  "You can enroll in our programs by visiting our website and filling out the enrollment form or contacting us directly.",
              },
              {
                question: "Are the programs free?",
                answer:
                  "Some programs are free, while others may require a nominal fee to cover the cost of materials and resources. Please check the program details for more information.",
              },
              {
                question: "Can I volunteer with the foundation?",
                answer:
                  "Yes! We welcome volunteers who are passionate about education and social impact. You can apply through our volunteer page.",
              },
              {
                question: "How can I support the foundation?",
                answer:
                  "You can support us by donating, volunteering, or spreading the word about our programs. Every contribution makes a difference.",
              },
            ].map((item, index) => (
              <li key={index} className="border-b border-gray-300 pb-2">
                <div
                  className="flex items-center justify-between text-lg font-semibold cursor-pointer"
                  onClick={() => handleQuestionClick(index)}
                >
                  <span className="flex items-center">
                    {activeIndex === index ? (
                      <AiOutlineMinus className="mr-2" />
                    ) : (
                      <AiOutlinePlus className="mr-2" />
                    )}
                    {item.question}
                  </span>
                </div>
                <div
                  className={`transition-all overflow-hidden ${activeIndex === index
                    ? "max-h-40 opacity-100 py-2"
                    : "max-h-0 opacity-0 py-0"
                    }`}
                >
                  <p className="text-sm mt-2 text-gray-700">{item.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StudentFAQSection;