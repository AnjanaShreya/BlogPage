import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLoader, FiCheckCircle, FiAlertCircle, FiBookOpen, FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { FaBuilding, FaCalendar, FaCheckCircle, FaUser, FaQuoteLeft } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Footer from '../Navbar/Footer';

const ReviewSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    degree: '',
    year: '',
    shortBio: '',
    category: '',
    blogContent: '',
    heading: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/blogs/${id}`);
        const data = await response.json();

        if (data.success) {
          setBlog(data.data);
          setFormData({
            name: data.data.name || '',
            university: data.data.university || '',
            degree: data.data.degree || '',
            year: data.data.year || '',
            shortBio: data.data.shortBio || '',
            category: data.data.category || '',
            blogContent: data.data.blogContent || '',
            heading: data.data.heading || ''
          });
        } else {
          setError(data.message || 'Blog not found');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/api/blogs/resubmit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center justify-center py-32">
          <FiLoader className="animate-spin text-5xl text-[#002a32]" />
          <span className="ml-3 text-lg font-bold text-gray-500 mt-4 font-sans">Loading manuscript details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center justify-center py-32 max-w-md mx-auto px-6 text-center">
          <FiAlertCircle className="text-6xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">Failed to load manuscript</h2>
          <span className="text-sm text-gray-500 leading-relaxed font-sans">{error}</span>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2.5 bg-[#002a32] text-white hover:bg-[#003d49] font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center justify-center py-32 max-w-lg mx-auto px-6 text-center">
          <FiCheckCircle className="text-6xl text-green-500 mb-5 animate-bounce" />
          <h2 className="text-2xl font-extrabold text-[#002a32] font-serif mb-3">Submitted for Editorial Review</h2>
          <p className="text-gray-650 font-sans text-sm leading-relaxed mb-8">
            Your manuscript changes have been successfully resubmitted. The editorial board has been notified and will review your updates. You will receive an email confirmation shortly.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#002a32] text-white hover:bg-[#003d49] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
          >
            Go to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfb] flex flex-col justify-between font-sans antialiased text-[#0f172a]">

      {/* Hero Banner Header Section */}
      <section className="relative bg-gradient-to-br from-[#002a32] via-[#0d3b45] to-[#121e21] py-16 text-white text-left shadow-lg overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(236,194,96,0.08),transparent_60%)]"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#002a32] rounded-full blur-3xl opacity-20 translate-x-12 -translate-y-12"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#ecc260] mb-3">
            <FiBookOpen className="animate-pulse" />
            <span>Manuscript Editorial Board</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Revise Your Blog Submission
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mt-3 leading-relaxed font-light">
            Refine your manuscript content, update categorization, expand your biography details, and carefully address the comments provided by the editorial review board.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        
        {/* Editor Feedback Section */}
        {blog?.reviewComments && (
          <div className="bg-gradient-to-r from-[#faf7ee] to-[#fff] border-l-4 border-[#ecc260] rounded-r-2xl p-6 md:p-8 mb-10 text-left shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 text-[#ecc260]/10 pointer-events-none select-none translate-x-6 -translate-y-6">
              <FaQuoteLeft className="text-7xl" />
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ecc260]/20 text-[#8C6D23]"><FiEdit3 className="text-xs" /></span>
              <h3 className="text-xs font-black text-[#002a32] uppercase tracking-wider">Editorial Board Review Desk Feedback</h3>
            </div>
            <div className="text-gray-700 leading-relaxed font-serif text-base italic pl-2 py-1 whitespace-pre-wrap">
              "{blog.reviewComments}"
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-md space-y-10 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ecc260] via-[#002a32] to-[#ecc260] rounded-t-3xl"></div>
          
          {/* A. AUTHOR PROFILE (READ-ONLY) */}
          <div className="text-left">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <span className="w-1.5 h-3.5 bg-[#ecc260] rounded-full"></span>
              <h3 className="text-xs font-black text-[#002a32] uppercase tracking-widest">Author Profile Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-100 rounded-2xl p-4 bg-slate-50/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3.5">
                <div className="p-3 bg-white rounded-xl text-gray-400 border border-gray-50 shadow-sm"><FaUser className="text-sm text-[#002a32]" /></div>
                <div>
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Full Name</span>
                  <span className="font-bold text-[#002a32] text-sm leading-none mt-1.5 block">{formData.name || 'N/A'}</span>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-2xl p-4 bg-slate-50/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3.5">
                <div className="p-3 bg-white rounded-xl text-gray-400 border border-gray-50 shadow-sm"><FaBuilding className="text-sm text-[#002a32]" /></div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">University</span>
                  <span className="font-bold text-[#002a32] text-sm leading-none mt-1.5 block truncate" title={formData.university}>{formData.university || 'N/A'}</span>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-2xl p-4 bg-slate-50/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3.5">
                <div className="p-3 bg-white rounded-xl text-gray-400 border border-gray-50 shadow-sm"><FaCheckCircle className="text-sm text-[#002a32]" /></div>
                <div>
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Degree</span>
                  <span className="font-bold text-[#002a32] text-sm leading-none mt-1.5 block">{formData.degree || 'N/A'}</span>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-2xl p-4 bg-slate-50/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3.5">
                <div className="p-3 bg-white rounded-xl text-gray-400 border border-gray-50 shadow-sm"><FaCalendar className="text-sm text-[#002a32]" /></div>
                <div>
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Academic Year</span>
                  <span className="font-bold text-[#002a32] text-sm leading-none mt-1.5 block">{formData.year || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* B. MANUSCRIPT DETAILS */}
          <div className="text-left space-y-8">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-1.5 h-3.5 bg-[#002a32] rounded-full"></span>
              <h3 className="text-xs font-black text-[#002a32] uppercase tracking-widest">Manuscript Information</h3>
            </div>
            
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-2.5">Category <span className="text-red-500">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 text-gray-800 px-4 py-3.5 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#002a32]/10 focus:border-[#002a32] text-sm cursor-pointer transition-all duration-300"
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

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-2.5">Author Biography Short Bio <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="shortBio"
                value={formData.shortBio}
                onChange={handleChange}
                required
                placeholder="Rahul is a final year LL.B. candidate specializing in Tech regulation..."
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002a32]/10 focus:border-[#002a32] transition-all duration-300 placeholder-gray-450"
              />
            </div>

            {/* Blog Heading */}
            <div>
              <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-2.5">Manuscript Title / Heading <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                required
                placeholder="e.g. Constitutional Dimensions of Privacy in Digital Era"
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002a32]/10 focus:border-[#002a32] transition-all duration-300 placeholder-gray-450 font-bold"
              />
            </div>

            {/* Blog Content */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Manuscript Text Content*</label>
              <div className="bg-white rounded-lg border border-gray-250/60 overflow-hidden focus-within:ring-1 focus-within:ring-[#002a32] transition-all custom-quill-editor">
                <style>{`
                  .custom-quill-editor .ql-container {
                    height: 450px !important;
                  }
                  .custom-quill-editor .ql-editor {
                    min-height: 450px !important;
                    max-height: 450px !important;
                    overflow-y: auto !important;
                  }
                `}</style>
                <ReactQuill
                  theme="snow"
                  value={formData.blogContent}
                  onChange={(value) => setFormData({ ...formData, blogContent: value })}
                  className="bg-white text-gray-800"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link', 'clean']
                    ]
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-100 text-left">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-400 hover:text-[#002a32] transition-all duration-200 cursor-pointer uppercase tracking-wider"
            >
              <FiArrowLeft className="text-[10px]" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-[#002a32] to-[#0d3b45] hover:from-[#003d49] hover:to-[#114a57] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>Submitting Revisions...</span>
                </>
              ) : (
                <span>Resubmit Manuscript</span>
              )}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewSubmission;
