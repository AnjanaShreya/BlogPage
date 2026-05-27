import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';
import BlogCard from '../components/BlogCard';

const SubjectPage = ({ title, categories }) => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/blogs`); // Fetch all blogs
        // Filter by the relevant categories passed via props
        const filteredBlogs = response.data.filter(blog =>
          categories.includes(blog.category)
        );
        const sortedBlogs = filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogData(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [categories, baseUrl]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div>
        <div className="relative z-20">
          <Navbar />
        </div>
        <CategoryHeading title={title} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002a32]"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center min-h-[30vh] py-8 px-4 md:px-12">
            {blogData.length > 0 ? (
              blogData.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            ) : (
              <div className="w-full text-center text-gray-500 font-sans mt-12 py-10 border border-dashed border-gray-200 rounded-2xl max-w-2xl mx-auto">
                No articles found related to {title}.
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubjectPage;
