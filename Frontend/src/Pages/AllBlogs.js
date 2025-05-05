import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';
import SearchBar from '../components/SearchFilter';

const AllBlogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Stores search results
  const [expandedCards, setExpandedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const maxLength = 90;

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogData(sortedBlogs);
        setFilteredBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data", error);
      }
    };
    fetchBlogs();
  }, []);

  // Handle Expand/Collapse
  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = blogData.filter((blog) =>
      blog.heading.toLowerCase().includes(query) || blog.shortBio.toLowerCase().includes(query) || blog.name.toLowerCase().includes(query)
    );

    setFilteredBlogs(filtered);
  };

  return (
    <div>
      <div className="relative z-20">
        <Navbar />
      </div>
      <CategoryHeading title="All Blogs" />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

      {/* Blog Cards */}
      <div className="flex flex-wrap justify-center min-h-20 py-5 mx-28">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => {
            const isExpanded = expandedCards[blog._id] || false; 
            return (
              <div key={blog._id} className="bg-gradient-to-br from-amber-50 to-gray-200 rounded-lg p-6 w-96 shadow-lg font-sans text-gray-800 m-5 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
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
          <div className="w-full text-center text-gray-500">No blogs found</div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AllBlogs;
