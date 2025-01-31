import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Card = ({ searchQuery }) => {
  const [blogData, setBlogData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogData(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data", error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogData.filter((blog) =>
    blog.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-wrap justify-center">
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => (
          <div key={blog._id} className="bg-gradient-to-br from-blue-50 to-gray-200 rounded-lg p-6 w-80 shadow-lg font-sans text-gray-800 m-5 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-gray-700">{blog.heading}</h4>
              <p className="text-sm text-gray-500 mt-1">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
              <p className="text-sm text-gray-500 mt-1">Written By: {blog.name}</p>
            </div>
            <h2 className="text-xl font-bold my-3 text-gray-800">{blog.shortBio}</h2>
            <p 
              className="text-blue-500 font-semibold underline cursor-pointer hover:text-teal-800"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              Start reading
            </p>
          </div>
        ))
      ) : (
        <div className="w-full text-center text-gray-500">No blogs found matching your search</div>
      )}
    </div>
  );
};

export default Card;
