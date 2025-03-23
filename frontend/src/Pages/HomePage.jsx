import React, { useState, useEffect } from "react";
import { Component } from "react";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import imgs1 from "../assets/imgs1.jpg";


// Typewriter Animation Component
class TypewriterAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      i: 0,
      messageIndex: 0,
    };
    this.messages = this.props.messages;
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
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.text}
      </div>
    );
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

  // Messages for each slide
  const slide1Messages = [
    "Welcome to Ishanya Foundation!",
    "Empowering stakeholders through capacity-building initiatives for sustainable impact.",
    "Creating inclusive spaces that foster learning, growth, and accessibility.",
  ];

  const slide2Messages = [
    "Learn from Industry Experts",
    "Gain hands-on knowledge from professionals",
    "Build skills for tomorrow's challenges",
  ];

  const slide3Messages = [
    "Shape Your Career with Us",
    "Get ready for a brighter future with our programs",
    "Join a community of successful learners",
  ];

  return (
    <div className="min-h-screen flex flex-col">
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

      <section className="pt-0 pb-0">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="w-full h-screen md:h-screen sm:h-screen"
        >
          <SwiperSlide>
            <div className="relative h-full">
              <img 
                src="/api/placeholder/1920/1080" 
                alt="Education" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
                <div className="min-h-16 mb-4">
                  <TypewriterAnimation 
                    messages={["Transform Your Future with Education"]} 
                    className="text-3xl md:text-5xl font-bold text-white"
                  />
                </div>
                <div className="min-h-12 mb-6">
                  <TypewriterAnimation 
                    messages={slide1Messages} 
                    className="text-xl md:text-2xl text-white"
                  />
                </div>
               
                <a href="/enroll" className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md transition duration-300 hover:scale-90 hover:bg-white hover:text-blue-600">
                  Enroll Now
                </a>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full">
              <img 
                src="/api/placeholder/1920/1080" 
                alt="Learning" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
                <div className="min-h-16 mb-4">
                  <TypewriterAnimation 
                    messages={[slide2Messages[0]]} 
                    className="text-3xl md:text-5xl font-bold text-white"
                  />
                </div>
                <div className="min-h-12 mb-6">
                  <TypewriterAnimation 
                    messages={slide2Messages.slice(1)} 
                    className="text-xl md:text-2xl text-white"
                  />
                </div>
              
                <a href="/courses" className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md transition duration-300 hover:scale-90 hover:bg-white hover:text-blue-600">
                  Explore Courses
                </a>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-full">
              <img 
                src="/api/placeholder/1920/1080" 
                alt="Future" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
                <div className="min-h-16 mb-4">
                  <TypewriterAnimation 
                    messages={[slide3Messages[0]]} 
                    className="text-3xl md:text-5xl font-bold text-white"
                  />
                </div>
                <div className="min-h-12 mb-6">
                  <TypewriterAnimation 
                    messages={slide3Messages.slice(1)} 
                    className="text-xl md:text-2xl text-white"
                  />
                </div>
                
                <a href="/join" className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md transition duration-300 hover:scale-90 hover:bg-white hover:text-blue-600">
                  Join Now
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="py-16 md:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[58%_42%] gap-8 items-center">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
            <p className="text-gray-700 mb-4">Founded in 2020, Ishanya has been at the forefront of providing quality education to students of all ages. Our mission is to make learning accessible, engaging, and effective.</p>
            <p className="text-gray-700 mb-4">With a team of expert educators and innovative teaching methods, we help our students achieve their academic goals and prepare for a successful future.</p>
            <p className="text-gray-700 mb-4">We believe that every student has the potential to excel, and our personalized approach ensures that each learner receives the attention and resources they need.</p>
            <p className="text-gray-700">Join our community of learners and experience the difference that quality education can make in your life.</p>
          </div>
          <div className="flex justify-center mt-6 md:mt-0">
            <img src="/images/about.jpg" alt="Education" className="w-full md:w-[90%] h-auto rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      {/* Stats Section - Now with improved responsiveness */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">Our Growing Community</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Teachers */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center transform transition duration-500 hover:scale-105">
              <div className="flex justify-center mb-4 md:mb-6">
                <svg className="w-24 md:w-32 h-24 md:h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#EBF4FF" />
                  <circle cx="50" cy="50" r="35" fill="#BFDBFE" />
                  <g transform="translate(42, 42)">
                    <GraduationCap className="text-blue-600 w-16 h-16" />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Expert Teachers</h3>
              <div className="text-4xl md:text-6xl font-bold text-blue-600 mb-3 md:mb-4">{teacherCount}+</div>
              <p className="text-gray-600">Dedicated educators committed to excellence in teaching</p>
            </div>
            
            {/* Right side - Students */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center transform transition duration-500 hover:scale-105">
              <div className="flex justify-center mb-4 md:mb-6">
                <svg className="w-24 md:w-32 h-24 md:h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="#FEF3F2" />
                  <circle cx="50" cy="50" r="35" fill="#FECACA" />
                  <g transform="translate(42, 42)">
                    <Users className="text-red-500 w-16 h-16" />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Enrolled Students</h3>
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-3 md:mb-4">{studentCount}+</div>
              <p className="text-gray-600">Learning and growing with our innovative programs</p>
            </div>
          </div>
          
          <div className="text-center mt-10 md:mt-16">
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">Join our thriving community of learners and educators to experience personalized education that transforms lives.</p>
            <a href="/join-community" className="mt-4 md:mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">Become Part of Our Community</a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ishanya</h3>
              <p className="text-gray-400">Empowering futures through quality education since 2020.</p>
            </div>
            <div className="mt-6 sm:mt-0">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">123 Education Street<br />Learning City, LC 12345<br />info@gmail.com.com<br />(555) 123-4567</address>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-300">Courses</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Faculty</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">&copy; {new Date().getFullYear()} Ishanya. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}