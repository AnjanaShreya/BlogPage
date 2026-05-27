import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";
import NavBottom from "../components/NavBottom";
import { FaShareAlt, FaBookmark, FaGlobe, FaArrowLeft } from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blogs/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching blog details", error);
      }
    };
    fetchBlog();
  }, [id, baseUrl]);

  if (!blog) {
    return (
      <div className="text-center text-gray-500 mt-20 text-lg animate-pulse font-serif">
        Loading Article...
      </div>
    );
  }

  return (
    <div className="bg-[#fafbfb] min-h-screen flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <div className="relative z-20">
          <Navbar />
        </div>

        {/* Top banner image with heading overlay */}
        <NavBottom title={blog.heading} category={blog.category} date={new Date(blog.createdAt).toLocaleDateString()} />

        {/* Premium Article Page Container */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          {/* Back Button Link */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#002a32] transition-colors uppercase tracking-widest mb-10 font-sans focus:outline-none"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Articles
          </button>

          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start mt-4">
            
            {/* Sidebar Column: Author Card & Navigation */}
            <div className="lg:col-span-1 border-t lg:border-t-0 border-gray-100 pt-8 lg:pt-0">
              <div className="sticky top-28 flex flex-col">
                
                {/* Author Card Info */}
                <div className="flex flex-col mb-6">
                  {/* Author Avatar Capsule */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg mb-4 shadow-sm border border-gray-100">
                    {blog.name ? blog.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  
                  {/* Author Name */}
                  <h4 className="font-sans font-bold text-[#0f172a] text-sm mb-1">
                    {blog.name || "Alexander Thorne"}
                  </h4>
                  
                  {/* Academic Context Bio */}
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-4 font-sans max-w-[200px]">
                    {blog.degree || "LL.B. Candidate"}, {blog.university || "Faculty of Law"} (Class of {blog.year || "2026"}).
                  </p>
                  
                  {/* Action Icons */}
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <button className="hover:text-[#002a32] transition-colors focus:outline-none" title="Share Article">
                      <FaShareAlt />
                    </button>
                    <button className="hover:text-[#002a32] transition-colors focus:outline-none" title="Author Website">
                      <FaGlobe />
                    </button>
                    <button className="hover:text-[#002a32] transition-colors focus:outline-none" title="Bookmark">
                      <FaBookmark />
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200/80 my-6"></div>

                {/* Table of Contents Navigation (ToC) */}
                <div className="hidden lg:block font-sans">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-3.5">
                    In this article
                  </span>
                  <ul className="space-y-3 text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    <li className="hover:text-[#002a32] cursor-pointer transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#002a32]"></span>
                      Introduction
                    </li>
                    <li className="hover:text-[#002a32] cursor-pointer transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      Key Discussion Points
                    </li>
                    <li className="hover:text-[#002a32] cursor-pointer transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      Analytical Precedents
                    </li>
                    <li className="hover:text-[#002a32] cursor-pointer transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      Concluding Thought
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Main Content Column: Rich Text Content */}
            <div className="lg:col-span-3">
              {/* Short Bio Blockquote or Summary Callout if available */}
              {blog.shortBio && (
                <div className="border-l-4 border-[#002a32] pl-6 py-1 my-6 italic text-lg text-gray-700 font-serif leading-relaxed mb-8">
                  "{blog.shortBio}"
                </div>
              )}

              {/* Full Blog Body Content formatted with typography classes */}
              <div
                className="text-gray-800 text-base md:text-lg leading-relaxed font-serif prose prose-slate max-w-none prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:italic prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:text-lg prose-blockquote:text-gray-700 prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight prose-a:text-[#002a32] prose-a:underline hover:prose-a:text-[#003d4a]"
                dangerouslySetInnerHTML={{ __html: blog.blogContent }}
              ></div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetails;
