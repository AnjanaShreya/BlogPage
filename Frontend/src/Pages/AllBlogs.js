import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';
import SearchBar from '../components/SearchFilter';
import BlogCard from '../components/BlogCard';

const AllBlogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Stores search results
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blogs/approved`);
        const sortedBlogs = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogData(sortedBlogs);
        setFilteredBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data", error);
      }
    };
    fetchBlogs();
  }, []);

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
      <CategoryHeading title="All Articles" />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />

      {/* Blog Cards */}
      <div className="flex flex-wrap justify-center min-h-20 py-8 px-4 md:px-12">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        ) : (
          <div className="w-full text-center text-gray-500 font-sans mt-8">No blogs found</div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AllBlogs;
