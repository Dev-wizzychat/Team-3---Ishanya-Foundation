import React, { useState, useEffect } from "react";
import { Component } from "react";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import bg from "../assets/20.jpg";
import image5 from "../assets/Swathi.jpg";
import image6 from "../assets/Raghu.jpg";
import image7 from "../assets/Reddy.jpg";
import SocialSidebar from "./SocialSidebar";
import comm from "../assets/comm.jpg";
import FAQs from "./FAQs";
import Footer from "./Footer";
// Typewriter Animation Component
class TypewriterAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      i: 0,
      messageIndex: 0,
    };
    this.messages = [
      "Welcome to Ishanya India Foundation!",
      "hi",
      "Empowering stakeholders through capacity-building.",
      "hi",
      "Creating inclusive spaces for learning and growth.",
      "hi",
      "Advocating policy changes for inclusion.",
      "hi",
      "Focus on Diversity, Equity & Inclusion for PWDs.",
      "hi",
    ]; // Array of messages
    this.speed = 50; // Typing speed in milliseconds
  }

  componentDidMount() {
    this.typeWriter(); // Start animation when component mounts
  }

  typeWriter = () => {
    const currentMessage = this.messages[this.state.messageIndex];

    if (this.state.i < currentMessage.length) {
      this.setState(
        (prevState) => ({
          text: prevState.text + currentMessage.charAt(prevState.i),
          i: prevState.i + 1,
        }),
        () => {
          setTimeout(this.typeWriter, this.speed);
        }
      );
    } else {
      // Wait 1 second, then reset and switch to the next message
      setTimeout(() => {
        this.setState(
          (prevState) => ({
            text: "",
            i: 0,
            messageIndex: (prevState.messageIndex + 1) % this.messages.length, // Loop through messages
          }),
          this.typeWriter
        );
      }, 1000);
    }
  };

  render() {
    return <div className={this.props.className}>{this.state.text}</div>;
  }
}

export default function LandingPage() {
  // State for animated counters
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  // Fetch data from API and animate counters
  useEffect(() => {
    // Function to animate count from start to end
    const animateCount = (start, end, setter) => {
      const duration = 2000; // 2 seconds
      const frameDuration = 20; // 20ms per frame
      const totalFrames = duration / frameDuration;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        setter(Math.floor(start + progress * (end - start)));

        if (frame === totalFrames) {
          clearInterval(timer);
        }
      }, frameDuration);

      return timer;
    };

    // Simulate API call with fallback values
    setTimeout(() => {
      animateCount(0, 50, setTeacherCount);
      animateCount(0, 1200, setStudentCount);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SocialSidebar />
      <nav className="fixed top-0 left-0 right-0 bg-[#001f3f] shadow-md z-10 h-20 flex items-center">
        <div className="max-w-1xl mx-auto px-6 py-2 flex justify-between items-center w-full">
          {/* Left section with logo */}
          <div className="flex items-center space-x-2">
            <span
              className="text-3xl font-bold text-gray-800 shadow-lg"
              style={{
                fontFamily: "Arial",
                color: "white",
                textShadow: "2px 2px 5px rgba(219, 219, 219, 0.5)",
              }}
            >
              ISHANAYA INDIA FOUNDATION
            </span>
          </div>

          {/* Right section with About, Contact, and Employee button */}
          <div className="flex space-x-8 text-white font-semibold py-8 ml-auto mt-5">
            <a href="#" className="hover:text-yellow-400">
              HOME
            </a>
            <a
              onClick={() =>
                document
                  .getElementById("about-programs")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-yellow-400"
            >
              ABOUT
            </a>
            <a
              onClick={() =>
                document
                  .getElementById("foot")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-yellow-400"
            >
              CONTACT
            </a>
            <a
              href="/login"
              className="px-4 py-2 text-sm bg-red-700 text-white rounded-md hover:bg-gray-800 transition duration-300 flex items-center"
              style={{ height: "auto" }} // Adjust the button height
            >
              <b>For Employees</b>
            </a>
          </div>
        </div>
      </nav>
      <section className="py-10 flex justify-center items-center bg-white">
        <div
          className="w-full max-w-8xl shadow-lg border border-gray-300 rounded-lg overflow-hidden"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={false}
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="w-full h-screen"
          >
            <SwiperSlide>
              <div className="relative h-full flex items-center p-6">
                {/* Left Side - Text & Animation */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center px-6 md:px-12">
                  <div className="min-h-[120px] mb-6">
                    {" "}
                    {/* Set a minimum height here */}
                    <TypewriterAnimation className="text-3xl md:text-5xl font-bold text-black" />
                  </div>
                  <div className="mt-12 flex space-x-4">
                    {/* Explore Courses Button */}
                    <a
                      onClick={() =>
                        document
                          .getElementById("explore-programs")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-8 py-3 text-blue text-lg font-semibold rounded-md border border-blue-500 shadow-md transition duration-300 hover:scale-90 hover:bg-white hover:text-gray-700"
                    >
                      Explore Courses
                    </a>
                    {/* Enroll Now Button */}
                    <a
                      href="/enroll"
                      className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md border border-transparent transition duration-300 hover:scale-90 hover:bg-white hover:text-blue-600 hover:border-blue-600"
                    >
                      Enroll Now
                    </a>
                  </div>
                </div>

                <div className="px-50 w-full md:w-1/2 h-full flex items-center justify-center">
                  <Swiper
                    spaceBetween={10} // Space between slides
                    slidesPerView={1} // Number of slides to show at a time
                    navigation // Add navigation buttons (previous/next)
                    pagination={{ clickable: true }} // Add pagination dots
                    loop // Make the slider loop infinitely
                  >
                    {/* Slide 1 */}
                    <SwiperSlide>
                      <img
                        src="https://ishanyaindia.org/wp-content/uploads/2020/02/Ishanya_logo.png"
                        alt="Image 1"
                        className="w-[400px] h-[350px] object-cover rounded-md"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section id="about-programs" className="py-16 md:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
          <div className="grid md:grid-cols-[58%_42%] gap-8 items-center">
            <div className="text-left">
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 text-red font-sans text-center mx-auto"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: "#8B0000",
                }}
              >
                About Us
              </h2>
              <hr className="border-t-2 border-yellow-400 mb-6 mx-auto w-1/2" />
              <p className="text-gray-700 mb-4 text-center">
                Founded in 2020, Ishanya has been at the forefront of providing
                quality education to students of all ages. Our mission is to
                make learning accessible, engaging, and effective.
              </p>
              <p className="text-gray-700 mb-4 text-center">
                With a team of expert educators and innovative teaching methods,
                we help our students achieve their academic goals and prepare
                for a successful future.
              </p>
              <p className="text-gray-700 mb-4 text-center">
                We believe that every student has the potential to excel, and
                our personalized approach ensures that each learner receives the
                attention and resources they need.
              </p>
              <p className="text-gray-700 text-center">
                Join our community of learners and experience the difference
                that quality education can make in your life.
              </p>
            </div>
            <div className="flex justify-center mt-6 md:mt-0">
              <Swiper
                spaceBetween={10} // Space between slides
                slidesPerView={1} // Number of slides to show at a time
                navigation // Add navigation buttons (previous/next)
                pagination={{ clickable: true }} // Add pagination dots
                loop // Make the slider loop infinitely
                autoplay={{
                  delay: 2000, // Change slides every 1 second
                  disableOnInteraction: false, // Keep autoplay going even after user interaction
                }}
                modules={[Autoplay]}
              >
                {/* Slide 1 */}
                <SwiperSlide>
                  <div className="flex justify-end pr-15">
                    <img
                      src={image5}
                      alt="Image 1"
                      className="w-[250px] h-[350px] object-cover rounded-md mt-7"
                    />
                  </div>
                  <div className="px-25 text-center pr-4 ">
                    <div
                      className="font-bold"
                      style={{ fontFamily: "Times New Roman, serif" }}
                    >
                      SWATHI VELLAL RAGHUNANDAN
                    </div>
                    <div>FOUNDER, DIRECTOR</div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex justify-end pr-15">
                    <img
                      src={image6}
                      alt="Image 1"
                      className="w-[250px] h-[350px] object-cover rounded-md mt-7"
                    />
                  </div>
                  <div className="px-25 text-center pr-4 ">
                    <div
                      className="font-bold"
                      style={{ fontFamily: "Times New Roman, serif" }}
                    >
                      RAGHUNANDAN RANGANATH
                    </div>
                    <div>Co-FOUNDER, TRUSTEE</div>
                  </div>
                </SwiperSlide>

                {/* Slide 4 */}
                <SwiperSlide>
                  <SwiperSlide>
                    <div className="flex justify-end pr-15">
                      <img
                        src={image7}
                        alt="Image 1"
                        className="w-[250px] h-[350px] object-cover rounded-md mt-7"
                      />
                    </div>
                    <div className="px-25 text-center pr-4 ">
                      <div
                        className="font-bold"
                        style={{ fontFamily: "Times New Roman, serif" }}
                      >
                        ASHWATHANARAYANA REDDY
                      </div>
                      <div>CHIEF MENTOR, TRUSTEE</div>
                    </div>
                  </SwiperSlide>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Now with improved responsiveness */}
      <section
        className="py-16 md:py-20 px-4 bg-gray-50"
        style={{ backgroundImage: `url(${comm})` }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16"
            style={{ fontFamily: "Times New Roman, serif" }}
          >
            Our Growing Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Teachers */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center transform transition duration-500 hover:scale-105">
              <div className="flex justify-center mb-4 md:mb-6">
                <svg
                  className="w-24 md:w-32 h-24 md:h-32"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="45" fill="#EBF4FF" />
                  <circle cx="50" cy="50" r="35" fill="#BFDBFE" />
                  <g transform="translate(42, 42)">
                    <GraduationCap className="text-blue-600 w-16 h-16" />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                Expert Teachers
              </h3>
              <div className="text-4xl md:text-6xl font-bold text-blue-600 mb-3 md:mb-4">
                {teacherCount}+
              </div>
              <p className="text-gray-600">
                Dedicated educators committed to excellence in teaching
              </p>
            </div>

            {/* Right side - Students */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center transform transition duration-500 hover:scale-105">
              <div className="flex justify-center mb-4 md:mb-6">
                <svg
                  className="w-24 md:w-32 h-24 md:h-32"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="45" fill="#FEF3F2" />
                  <circle cx="50" cy="50" r="35" fill="#FECACA" />
                  <g transform="translate(42, 42)">
                    <Users className="text-red-500 w-16 h-16" />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                Enrolled Students
              </h3>
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-3 md:mb-4">
                {studentCount}+
              </div>
              <p className="text-gray-600">
                Learning and growing with our innovative programs
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="explore-programs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">
            Explore Programs
          </h2>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Program 1 */}
            <div className="bg-[#001f3f] shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <h3
                className="text-xl font-semibold mt-4"
                style={{ fontFamily: "Roboto", color: "white" }}
              >
                SAMETI
              </h3>
              <p className="text-white text-sm mt-2">
                A Pre-Academic Skills Program. It has been designed to cater to
                learning in a group setting, in order to improve and enhance the
                process of socialization in children with varied special needs
              </p>
            </div>

            {/* Program 2 */}
            <div className="bg-[#001f3f] shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <h3
                className="text-xl font-semibold mt-4"
                style={{ fontFamily: "Roboto", color: "white" }}
              >
                SATTVA
              </h3>
              <p className="text-white text-sm mt-2">
                A program that looks beyond the conventional idea of academics.
                It is a bridge between academics & functional skills with more
                focus on developing soft skills for transition to adulthood
              </p>
            </div>

            {/* Program 3 */}
            <div className="bg-[#001f3f] shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <h3
                className="text-xl font-semibold mt-4"
                style={{ fontFamily: "Roboto", color: "white" }}
              >
                SIDDHI
              </h3>
              <p className="text-white text-sm mt-2">
                1-2-1 Remedial program. Guided sessions with individual goals &
                IEP’s. We use an eclectic approach and curriculum tailored to
                the specific needs and abilities of each individual
              </p>
            </div>

            {/* Program 4 */}
            <div className="bg-[#001f3f] shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <h3
                className="text-xl font-semibold mt-4"
                style={{ fontFamily: "Roboto", color: "white" }}
              >
                VOCATIONAL
              </h3>
              <p className="text-white text-sm mt-2">
                This program was created to train individuals on specific
                skills, with employment being the end goal. Currently, we offer
                training for a host of job roles considering ongoing market
                trend & requirements
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="/enroll"
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md transition duration-300 hover:scale-90 hover:bg-white hover:text-blue-600"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </section>
      <FAQs />

      <Footer />
    </div>
  );
}
