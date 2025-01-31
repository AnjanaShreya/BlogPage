import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import NavBottom from "../components/NavBottom";
import Footer from "../Navbar/Footer";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details", error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <NavBottom title={blog.heading} category={blog.category} date={new Date(blog.createdAt).toLocaleDateString()} />
  
      <div className="bg-gray-100 py-12 flex-grow">
        <div className="text-center flex justify-start ml-16">
          <button
            className="px-6 py-3 bg-[#002a32] text-white font-semibold rounded-full shadow-lg hover:bg-[#001a1f] transition duration-300"
            onClick={() => window.history.back()}
          >
            Back to Blogs
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto p-8 rounded-lg border">
          {/* Author Info */}
          <div className="mb-8">
            <p className="text-gray-900 font-semibold text-xl mb-4">
              About The Author
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-base"><strong>Written By:</strong> {blog.name}</p>
              <p className="text-gray-600 text-base"><strong>University:</strong> {blog.university}</p>
              <p className="text-gray-600 text-base"><strong>Degree:</strong> {blog.degree}</p>
              <p className="text-gray-600 text-base"><strong>Year:</strong> {blog.year}</p>
            </div>
            {/* Short Bio */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Short Bio</h2>
              <p className="text-gray-700 text-base leading-relaxed">{blog.shortBio}</p>
            </div>
          </div>

          {/* Full Blog Content */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Read the Blog</h2>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {blog.blogContent}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetails;
