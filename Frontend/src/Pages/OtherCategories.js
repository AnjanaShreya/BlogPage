import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';

const OtherCategories = () => {
  const [blogData, setBlogData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();
  const maxLength = 90;

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blogs`); // Adjust API URL if needed
        
        // Categories to exclude
        const excludedCategories = [
            "Constitution Law",
            "Constitution of India",
            "Civil Procedure 1908",
            "Administrative Law",
            "The Law of Contracts",
            "Evidence Act",
            "BNSS 2023",
            "Law of Torts",
            "Election laws",
            "Human Rights",
            "The Law of Evidence"
        ];
        
        // Filter out the excluded categories
        const filteredBlogs = response.data.filter(blog => 
            !excludedCategories.includes(blog.category)
        );
        
        // Sort blogs by latest createdAt date
        const sortedBlogs = filteredBlogs.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setBlogData(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data", error);
    }
          
    };
    fetchBlogs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  return (
    <div>
      <div className="relative z-20">
        <Navbar />
      </div>
      <CategoryHeading title="Other Categories" />

      <div className="flex flex-wrap justify-center min-h-20 py-5">
        {blogData.length > 0 ? (
          blogData.map((blog) => {
            const isExpanded = expandedCards[blog._id] || false; 
            return (
              <div key={blog._id} className="bg-gradient-to-br from-amber-50 to-gray-200 rounded-lg p-6 w-80 shadow-lg font-sans text-gray-800 m-5 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-700">{blog.heading}</h4>
                  <p className="text-sm text-gray-500 mt-1">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                  <p className="text-sm text-gray-500 mt-1">Written By: {blog.name}</p>
                </div>

                {/* Short Bio with Expand/Collapse Option */}
                <div>
                  <span className="text-sm font-bold my-3 text-gray-800">
                    {isExpanded ? blog.shortBio : blog.shortBio.slice(0, maxLength) + (blog.shortBio.length > maxLength ? "..." : "")}
                    {"  "}
                  </span>
                  {blog.shortBio.length > maxLength && (
                    <span
                      className="text-blue-600 font-medium text-sm hover:underline mt-2 cursor-pointer hover:text-teal-800"
                      onClick={() => toggleExpand(blog._id)} 
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </span>
                  )}
                </div>

                {/* Start Reading Link */}
                <p 
                  className="text-blue-500 font-semibold underline cursor-pointer hover:text-teal-800"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  Start reading
                </p>
              </div>
            );
          })
        ) : (
          <div className="w-full text-center text-gray-500">No blogs found related to the Other Categories</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OtherCategories;
