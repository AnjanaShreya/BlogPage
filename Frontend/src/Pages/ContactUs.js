import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";
import CategoryHeading from "../components/CategoryHeading";
import { FaEdit, FaUsers, FaUserEdit, FaFileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ContactUs = () => {
  // State to track which FAQ item is expanded
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  const faqData = [
    {
      question: "How do I publish an article?",
      answer: "To publish an article, you can click on 'Write a Journal' in the dashboard, write your post in our interactive rich text editor, and submit it for review by our editorial board."
    },
    {
      question: "Who can contribute?",
      answer: "We welcome contributions from law students, legal practitioners, scholars, researchers, and anyone passionate about modern legal insights and academic discourse."
    },
    {
      question: "Are submissions reviewed?",
      answer: "Yes, all submitted articles go through a rigorous peer-review and editorial check by our senior board to ensure standard, fact-checked, high-quality legal writing."
    },
    {
      question: "Can students collaborate on events?",
      answer: "Absolutely! We actively partner with campus representatives to host moot courts, legal aid workshops, seminars, and other professional legal training events."
    },
    {
      question: "How long does approval take?",
      answer: "The review and feedback process typically takes between 3 to 7 business days, during which our editors collaborate with you to refine your piece."
    }
  ];

  return (
    <div className="relative font-sans bg-gray-50/50 min-h-screen">
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      <CategoryHeading title="Connect With Our Community" description="Have questions, feedback, or collaboration ideas? Drop us a message and we'll get back to you soon." />

      {/* Main Content Form */}
      <div className="mx-auto max-w-7xl px-6 py-16 flex justify-center">
        {/* Contact Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] w-full max-w-2xl">
          <h2 className="text-2xl font-bold font-serif text-[#002a32] mb-6">Send Us a Message</h2>
          <form>
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-gray-200 rounded-md p-3 focus:ring-1 focus:ring-navy focus:outline-none placeholder-gray-400 text-sm font-sans"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-200 rounded-md p-3 focus:ring-1 focus:ring-navy focus:outline-none placeholder-gray-400 text-sm font-sans"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            {/* University/College Row */}
            <div className="mb-4">
              <input
                type="text"
                id="university"
                className="w-full border border-gray-200 rounded-md p-3 focus:ring-1 focus:ring-navy focus:outline-none placeholder-gray-400 text-sm font-sans"
                placeholder="University/College"
                required
              />
            </div>

            {/* Subject Dropdown Row */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-[#002a32] uppercase tracking-wider mb-1.5" htmlFor="subject">
                Subject
              </label>
              <select
                id="subject"
                className="w-full border border-gray-200 rounded-md p-3 focus:ring-1 focus:ring-navy focus:outline-none text-sm text-gray-500 font-sans bg-white cursor-pointer"
                required
              >
                <option value="">Select Subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Collaboration Opportunity">Collaboration Opportunity</option>
                <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                <option value="Article Submission Query">Article Submission Query</option>
                <option value="Article Submission Query">Become a Member</option>
              </select>
            </div>

            {/* Message Row */}
            <div className="mb-6">
              <textarea
                id="message"
                className="w-full border border-gray-200 rounded-md p-3 focus:ring-1 focus:ring-navy focus:outline-none placeholder-gray-400 text-sm font-sans"
                rows="5"
                placeholder="Message"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#002a32] text-white px-8 py-3 rounded-md hover:bg-[#003844] transition-colors text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg duration-300"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>

      {/* Collaboration Opportunities */}
      <section className="bg-gray-50 py-12 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-wide mb-2">
              Collaboration Opportunities
            </h2>
            <p className="text-gray-500 font-sans text-sm">
              Shape the future of legal scholarship with us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="bg-[#f1f5f9] p-3 rounded-xl text-gray-600 text-xl mb-4">
                  <FaEdit />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-base mb-2 leading-snug">
                  Become a Student Writer
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-4">
                  Share your academic insights with a global legal audience.
                </p>
              </div>
              <a href="/signup" className="text-xs font-bold text-navy hover:text-navy-light tracking-widest uppercase flex items-center gap-1">
                Learn More <span className="text-xs font-bold">→</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="bg-[#f1f5f9] p-3 rounded-xl text-gray-600 text-xl mb-4">
                  <FaUsers />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-base mb-2 leading-snug">
                  Organize Campus Events
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-4">
                  Lead discussions and workshops at your university.
                </p>
              </div>
              <a href="/contactus" className="text-xs font-bold text-navy hover:text-navy-light tracking-widest uppercase flex items-center gap-1">
                Apply Now <span className="text-xs font-bold">→</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="bg-[#f1f5f9] p-3 rounded-xl text-gray-600 text-xl mb-4">
                  <FaUserEdit />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-base mb-2 leading-snug">
                  Join Editorial Team
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-4">
                  Review and curate the highest quality legal content.
                </p>
              </div>
              <a href="/contactus" className="text-xs font-bold text-navy hover:text-navy-light tracking-widest uppercase flex items-center gap-1">
                View Roles <span className="text-xs font-bold">→</span>
              </a>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="bg-[#f1f5f9] p-3 rounded-xl text-gray-600 text-xl mb-4">
                  <FaFileAlt />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-base mb-2 leading-snug">
                  Publish Research Articles
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-4">
                  Contribute your rigorous legal research to our repository.
                </p>
              </div>
              <a href="/signup" className="text-xs font-bold text-navy hover:text-navy-light tracking-widest uppercase flex items-center gap-1">
                Guidelines <span className="text-xs font-bold">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-wide mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5 font-serif">
            {faqData.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded
                      ? "border-[#002a32]/35 shadow-[0_4px_20px_rgba(0,42,50,0.05)] bg-[#fdfeff]"
                      : "border-gray-200/70 hover:border-gray-300 shadow-sm bg-white"
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left font-serif text-[#0f172a] font-semibold text-base transition-colors focus:outline-none group"
                  >
                    <span className={`transition-colors duration-300 ${isExpanded ? "text-[#002a32]" : "group-hover:text-[#002a32]"}`}>
                      {faq.question}
                    </span>
                    <span className={`text-xs transition-transform duration-300 ${isExpanded ? "text-[#002a32] rotate-180" : "text-gray-400"}`}>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-4.5 py-1 text-gray-500 font-serif text-md border-t border-gray-100 bg-[#fbfcfd]">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;
