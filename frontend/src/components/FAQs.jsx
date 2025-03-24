import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Import icons
import faq2 from "../assets/faq2.png"; // Image path

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleQuestionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center bg-orange-200">
        <div className="w-full max-w-20xl px-4 mx-auto p-4 border-4 border-white rounded-xl bg-orange-200">
          <div className="flex flex-col md:flex-row items-center p-10">
            {/* Left Side - Image */}
            <div className="md:w-1/3">
              <img
                src={faq2}
                alt="FAQ Illustration"
                className="w-full h-auto"
              />
            </div>

            {/* Right Side - FAQ Section */}
            <div className="md:w-2/3 mt-8 md:mt-0 md:pl-12 text-black">
              <h2
                className="text-3xl font-semibold mb-6 text-center"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: "#8B0000",
                }}
              >
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
                      className={`transition-all overflow-hidden ${
                        activeIndex === index
                          ? "max-h-40 opacity-100 py-2"
                          : "max-h-0 opacity-0 py-0"
                      }`}
                    >
                      <p className="text-sm mt-2">{item.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
