import React, { useState } from "react";
import img2 from "../assets/img2.jpg";
import Preview from "../components/Preview";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";
import { FaUser, FaBookOpen, FaArrowLeft } from "react-icons/fa";

const BlogForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    degree: "",
    year: "",
    shortBio: "",
    heading: "",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBlogChange = (content) => {
    setBlogContent(content);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = {
      ...formData,
      category: selectedCategory === "Other Category" ? otherCategory : selectedCategory,
      blogContent: blogContent,
    };
  
    try {
      const response = await fetch(`${baseUrl}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formPayload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Your blog has been submitted for approval! You'll receive a confirmation email shortly.");
        // Reset form
        setFormData({
          name: "",
          university: "",
          degree: "",
          year: "",
          shortBio: "",
          heading: "",
        });
        setSelectedCategory("");
        setOtherCategory("");
        setBlogContent("");
      } else {
        throw new Error(data.message || "Failed to submit blog");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  const handleGoToDashboard = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/signout`, {
        method: "POST",
        credentials: 'include',
      });

      if (response.ok) {
        // Clear all storage items
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('adminRole');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        navigate("/");
      } else {
        console.error("Sign out failed");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  // Quill editor formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation bar at top */}
        <Navbar />

        {/* Hero Header with dark teal and book image backdrop */}
        <div 
          className="relative bg-cover bg-center py-24 text-center px-6"
          style={{ backgroundImage: `url(${img2})`, backgroundAttachment: 'fixed' }}
        >
          {/* Transparent Dark overlay */}
          <div className="absolute inset-0 bg-[#002a32]/85"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-white">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-wide leading-tight text-white">
              Contribute to the Archive
            </h1>
            <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Share your legal scholarship with an audience of practitioners, scholars, and students.
            </p>
          </div>
        </div>

        {/* Main Content Area - overlapping white card and guidelines sidebar */}
        <div className="max-w-7xl mx-auto px-4 pb-16 relative z-20 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-3 bg-white shadow-xl rounded-md p-6 md:p-10 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Author Information */}
                <div>
                  <h3 className="flex items-center gap-2.5 font-serif text-xl font-bold text-[#002a32] pb-3 border-b border-gray-100 mb-6">
                    <FaUser className="text-[#002a32]" size={16} />
                    <span>Author Information</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="university" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        University / Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="university"
                        placeholder="Harvard Law School"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="degree" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Degree <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="degree"
                        placeholder="LL.M. in International Law"
                        value={formData.degree}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Year of Study / Graduation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="year"
                        placeholder="2024"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="shortBio" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Short Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="shortBio"
                      placeholder="Briefly describe your legal interests and background..."
                      value={formData.shortBio}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm h-24 resize-none transition-colors"
                  ></textarea>
                  </div>
                </div>

                {/* Section 2: Blog Content */}
                <div>
                  <h3 className="flex items-center gap-2.5 font-serif text-xl font-bold text-[#002a32] pb-3 border-b border-gray-100 mb-6">
                    <FaBookOpen className="text-[#002a32]" size={16} />
                    <span>Blog Content</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-1">
                      <label htmlFor="category" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      >
                        <option value="" disabled>Select category...</option>
                        <option value="Constitution of India">Constitution of India</option>
                        <option value="The Code of Civil Procedure 1908">The Code of Civil Procedure 1908</option>
                        <option value="Administrative Law">Administrative Law</option>
                        <option value="The Law of Contracts">The Law of Contracts</option>
                        <option value="BNSS 2023">BNSS 2023</option>
                        <option value="The Law of Evidence">Evidence Act</option>
                        <option value="Law of Torts">Law of Torts</option>
                        <option value="Election Laws">Election Laws</option>
                        <option value="Human Rights">Human Rights</option>
                        <option value="Other Category">Other Category</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="heading" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Blog Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="heading"
                        placeholder="The Evolution of Digital Privacy Statutes"
                        value={formData.heading}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {selectedCategory === "Other Category" && (
                    <div className="mb-6">
                      <label htmlFor="otherCategory" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Specify Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="otherCategory"
                        placeholder="Enter category name"
                        value={otherCategory}
                        onChange={(e) => setOtherCategory(e.target.value)}
                        required
                        className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-800 p-3 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm transition-colors"
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="blog" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Write Your Blog <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-white rounded border border-gray-200 h-[500px] overflow-hidden focus-within:ring-1 focus-within:ring-[#002a32] focus-within:border-[#002a32]">
                      <ReactQuill
                        value={blogContent}
                        onChange={handleBlogChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Begin typing your legal insights here..."
                        className="text-gray-800 h-[440px] border-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer Bar */}
                <div className="bg-gray-50 -mx-6 -mb-6 md:-mx-10 md:-mb-10 px-6 py-5 md:px-10 flex justify-between items-center rounded-b-md border-t border-gray-150">
                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#002a32] transition-colors uppercase tracking-wider bg-transparent border-none outline-none focus:outline-none"
                  >
                    <FaArrowLeft size={10} />
                    <span>Go to Dashboard</span>
                  </button>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-750 font-bold py-2 px-5 rounded text-xs tracking-wider uppercase transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      type="submit"
                      className="bg-[#002a32] hover:bg-[#001a1f] text-white font-bold py-2 px-7 rounded text-xs tracking-wider uppercase transition-colors shadow-sm hover:shadow"
                    >
                      Submit
                    </button>
                  </div>
                </div>

              </form>
            </div>

            {/* Sidebar Column (Guidelines) */}
            <div className="lg:col-span-1 space-y-6 self-start">
              <div className="bg-white shadow-lg rounded-md p-6 border border-gray-100 text-left">
                <h4 className="font-serif text-lg font-bold text-[#002a32] mb-4 pb-2 border-b border-gray-150">
                  Submission Rules
                </h4>
                <ul className="space-y-3.5 text-xs text-gray-600 font-sans leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#b48e35] font-bold">1.</span>
                    <span><strong>Originality:</strong> Submissions must be original. Plagiarism leads to immediate rejection.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#b48e35] font-bold">2.</span>
                    <span><strong>Formatting:</strong> Keep paragraphs clear and structured. Utilize standard legal citations.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#b48e35] font-bold">3.</span>
                    <span><strong>Word Count:</strong> Recommended lengths for articles are between 800 and 1,500 words.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#b48e35] font-bold">4.</span>
                    <span><strong>Anonymity:</strong> Double-blind reviews are conducted. Do not include credentials within drafts.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#002a32] shadow-lg rounded-md p-6 text-left text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <FaBookOpen size={120} />
                </div>
                <h4 className="font-serif text-base font-bold text-white mb-2">
                  Need Editorial Help?
                </h4>
                <p className="text-xs text-gray-300 font-sans leading-relaxed mb-4">
                  Have inquiries regarding topics, drafts, or editing guidelines? Reach out. Our team will respond within 24 hours.
                </p>
                <a 
                  href="/contactus"
                  className="inline-block bg-[#8a6d1c] hover:bg-gold-dark text-white font-bold px-4 py-2 rounded text-[10px] tracking-wider uppercase transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Overlap Banner: "Joining a Legacy" */}
        <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-gray-200/50 pt-16">
          <div className="w-full">
            <img 
              src={img2} 
              alt="Legacy Library" 
              className="rounded-lg shadow-md h-52 w-full object-cover brightness-75 border border-gray-100" 
            />
          </div>
          <div className="text-left font-sans space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#002a32]">
              Joining a Legacy
            </h3>
            <p className="text-sm text-gray-650 leading-relaxed font-sans">
              Every submission goes through a rigorous peer-review process by our editorial board. We value clarity, original legal thinking, and contemporary relevance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-3 py-1 rounded tracking-wider uppercase">
                Peer Reviewed
              </span>
              <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-3 py-1 rounded tracking-wider uppercase">
                Double-Blind
              </span>
              <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-3 py-1 rounded tracking-wider uppercase">
                Global Readership
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Footer at bottom */}
      <Footer />

      {/* Preview Dialog */}
      {isPreviewOpen && (
        <Preview
          formData={formData}
          selectedCategory={selectedCategory}
          otherCategory={otherCategory}
          blogContent={blogContent}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default BlogForm;