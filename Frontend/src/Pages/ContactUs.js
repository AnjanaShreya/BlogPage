import React from "react";
import img2 from "../assets/img2.jpg";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";

const ContactUs = () => {
  return (
    <div className="relative">
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Image Section */}
      <div className="relative">
        <img src={img2} alt="Contact Us" className="w-full h-72 object-cover" />

        {/* Overlay with Title */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center p-28 z-10">
          <h1 className="text-white text-3xl font-bold">Contact Us</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-6 px-4 py-12"> 
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
                  rows="5"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#002a32d5] text-white px-6 py-2 rounded-full hover:bg-[#002a32ed]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4 text-gray-700">
              Have questions or need help? Feel free to reach out to us using the contact
              details below.
            </p>
            <ul>
              <li className="mb-4">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@blogpage.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@blogpage.com
                </a>
              </li>
              <li className="mb-4">
                <strong>Phone:</strong>{" "}
                <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                  +1 234 567 890
                </a>
              </li>
              <li className="mb-4">
                <strong>Address:</strong> 123 Blog Street, Content City, Blogland
              </li>
              <li>
                <strong>Location:</strong> 
                <a href="https://location.com" className="hover:text-blue-800 underline"> Click Here for Location </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;
