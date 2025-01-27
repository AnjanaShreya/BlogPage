// Card.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Card = () => {
  const [blogData, setBlogData] = useState([]);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogData(response.data); // Set the fetched blogs in state
      } catch (error) {
        console.error("Error fetching blog data", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-wrap">
      {blogData.map((blog) => (
        <div key={blog._id} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-5 w-80 shadow-md font-sans text-gray-800 m-5">
          <div className="mb-3">
            <h4 className="text-lg font-semibold">{blog.heading}</h4>
            <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
          </div>
          <h2 className="text-xl font-bold my-4">{blog.shortBio}</h2>
          <p className="text-blue-500 font-semibold underline cursor-pointer">Start reading</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
