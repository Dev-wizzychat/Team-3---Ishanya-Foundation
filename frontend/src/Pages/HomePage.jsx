import React, { useState, useEffect } from "react";
import { Component } from "react";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import image1 from "../assets/1.webp";
import image3 from "../assets/3.jpg";
import image4 from "../assets/4.jpg";
import image5 from "../assets/Swathi.jpg";
import image6 from "../assets/Raghu.jpg";
import image7 from "../assets/Reddy.jpg";
import SocialSidebar from "./SocialSidebar";
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
      "Transforming beneficiaries into contributors.",
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
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center w-full">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-semibold text-gray-800">Ishanya</span>
            </div>
            <div className="flex items-center">
              <a href="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>
      <section className="py-10 flex justify-center items-center py-10">
        <div className="w-full max-w-8xl bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
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
                    autoplay={{
                      delay: 2000, // Change slides every 1 second
                      disableOnInteraction: false, // Keep autoplay going even after user interaction
                    }}
                    modules={[Autoplay]}
                  >
                    {/* Slide 1 */}
                    <SwiperSlide>
                      <img
                        src={image1}
                        alt="Image 1"
                        className="w-[400px] h-[400px] object-cover rounded-md"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        src={image3}
                        alt="Image 3"
                        className="w-[500px] h-[350px] object-cover rounded-md mt-10"
                      />
                    </SwiperSlide>

                    {/* Slide 4 */}
                    <SwiperSlide>
                      <img
                        src={image4}
                        alt="Image 4"
                        className="w-[300px] h-[400px] object-cover rounded-md"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 bg-white">
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
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">
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

          <div className="text-center mt-10 md:mt-16">
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Join our thriving community of learners and educators to
              experience personalized education that transforms lives.
            </p>
            <a
              href="/join-community"
              className="mt-4 md:mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Become Part of Our Community
            </a>
          </div>
        </div>
      </section>

      <section id="explore-programs" className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">
            Explore Programs
          </h2>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Program 1 */}
            <div className="bg-pink-100 shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <img
                src="/assets/program1.jpg"
                alt="Program 1"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-4">
                Science & Technology
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Explore cutting-edge advancements in science.
              </p>
            </div>

            {/* Program 2 */}
            <div className="bg-pink-100 shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <img
                src="/assets/program2.jpg"
                alt="Program 2"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-4">
                Business & Management
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Learn essential business skills and leadership.
              </p>
            </div>

            {/* Program 3 */}
            <div className="bg-pink-100 shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <img
                src="/assets/program3.jpg"
                alt="Program 3"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-4">Arts & Humanities</h3>
              <p className="text-gray-600 text-sm mt-2">
                Discover creativity through arts and literature.
              </p>
            </div>

            {/* Program 4 */}
            <div className="bg-pink-100 shadow-lg rounded-lg overflow-hidden text-center p-4 hover:scale-105 transition">
              <img
                src="/assets/program4.jpg"
                alt="Program 4"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-4">Health & Wellness</h3>
              <p className="text-gray-600 text-sm mt-2">
                Improve well-being with fitness and health courses.
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

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ishanya</h3>
              <p className="text-gray-400">
                Empowering futures through quality education since 2020.
              </p>
            </div>
            <div className="mt-6 sm:mt-0">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">
                123 Education Street
                <br />
                Learning City, LC 12345
                <br />
                info@gmail.com.com
                <br />
                (555) 123-4567
              </address>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-300"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-300"
                  >
                    Faculty
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-300"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            &copy; {new Date().getFullYear()} Ishanya. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}