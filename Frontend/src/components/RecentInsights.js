import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecentInsights = ({ searchQuery = "" }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/blogs/approved`);
        const sortedBlogs = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching approved blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [baseUrl]);

  const handleSeeMore = () => {
    navigate("/allblogs");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy"></div>
      </div>
    );
  }

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (blog.heading && blog.heading.toLowerCase().includes(q)) ||
      (blog.shortBio && blog.shortBio.toLowerCase().includes(q)) ||
      (blog.category && blog.category.toLowerCase().includes(q)) ||
      (blog.name && blog.name.toLowerCase().includes(q))
    );
  });

  // Slice top 6 blogs for display
  const displayBlogs = filteredBlogs.slice(0, 6);

  if (displayBlogs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-sans mx-8 border border-dashed border-gray-200 rounded-xl">
        No articles found matching "{searchQuery}". Try searching other keywords or view all articles.
      </div>
    );
  }

  // Destructure available blogs
  const firstBlog = displayBlogs[0];
  const secondBlog = displayBlogs[1];
  const thirdBlog = displayBlogs[2];
  const remainingBlogs = displayBlogs.slice(3);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-8xl mx-auto px-6 md:px-12 py-12">
      {/* Section Header */}
      <div className="flex justify-between mx-8 items-end pb-4 mb-8 font-sans">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
            Journal
          </span>
          <div onClick={handleSeeMore}>
            <h2 className="font-serif text-3xl font-bold text-gray-900 leading-none">
              Recent Insights
            </h2>
          </div>
        </div>
        <button
          onClick={handleSeeMore}
          className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-navy-light transition-colors tracking-widest uppercase pb-1"
        >
          View All Articles <span className="text-sm font-semibold">→</span>
        </button>
      </div>

      {/* Asymmetric Assembled Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-8">
        {/* Left Column: Big Featured Card */}
        {firstBlog && (
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-between h-full min-h-[420px]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded tracking-wider uppercase">
                    {firstBlog.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium font-sans">
                    {formatDate(firstBlog.createdAt)}
                  </span>
                </div>
                <h3
                  className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-navy cursor-pointer transition-colors leading-tight"
                  onClick={() => navigate(`/blog/${firstBlog._id}`)}
                >
                  {firstBlog.heading}
                </h3>
                <p className="text-gray-600 font-sans text-sm leading-relaxed mb-6">
                  {firstBlog.shortBio}
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto font-sans">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                    {firstBlog.name ? firstBlog.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <span className="text-sm font-semibold text-gray-850 capitalize">
                    {firstBlog.name || "lasya"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/blog/${firstBlog._id}`)}
                  className="text-xs font-bold text-gray-400 hover:text-navy transition-colors flex items-center gap-1"
                >
                  Start reading <span className="text-sm">↗</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Stack of Two Small Cards */}
        <div className="lg:col-span-1 flex flex-col justify-between gap-6">
          {/* Card 2 */}
          {secondBlog ? (
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[220px]">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-400 font-medium font-sans">
                    {formatDate(secondBlog.createdAt)}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
                    {secondBlog.category}
                  </span>
                </div>
                <h3
                  className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-navy cursor-pointer transition-colors"
                  onClick={() => navigate(`/blog/${secondBlog._id}`)}
                >
                  {secondBlog.heading}
                </h3>
                <p className="text-gray-600 font-sans text-xs leading-relaxed line-clamp-2">
                  {secondBlog.shortBio}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs">
                    {secondBlog.name ? secondBlog.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <span className="text-xs font-semibold text-gray-850 capitalize">
                    {secondBlog.name || "lasya"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/blog/${secondBlog._id}`)}
                  className="text-[10px] font-bold text-gray-400 hover:text-navy transition-colors flex items-center gap-0.5"
                >
                  Start reading <span className="text-xs">↗</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl h-[220px]"></div>
          )}

          {/* Card 3 */}
          {thirdBlog ? (
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[220px]">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-400 font-medium font-sans">
                    {formatDate(thirdBlog.createdAt)}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
                    {thirdBlog.category}
                  </span>
                </div>
                <h3
                  className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-navy cursor-pointer transition-colors"
                  onClick={() => navigate(`/blog/${thirdBlog._id}`)}
                >
                  {thirdBlog.heading}
                </h3>
                <p className="text-gray-600 font-sans text-xs leading-relaxed line-clamp-2">
                  {thirdBlog.shortBio}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs">
                    {thirdBlog.name ? thirdBlog.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <span className="text-xs font-semibold text-gray-850 capitalize">
                    {thirdBlog.name || "lasya"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/blog/${thirdBlog._id}`)}
                  className="text-[10px] font-bold text-gray-400 hover:text-navy transition-colors flex items-center gap-0.5"
                >
                  Start reading <span className="text-xs">↗</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl h-[220px]"></div>
          )}
        </div>
      </div>

      {/* Bottom Row: Three Cards Side-by-Side */}
      {remainingBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-8">
          {remainingBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[220px]"
            >
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 font-sans">
                  {formatDate(blog.createdAt)} <span className="mx-1.5">•</span> {blog.category}
                </div>
                <h3
                  className="font-serif text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-navy cursor-pointer transition-colors"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {blog.heading}
                </h3>
                <p className="text-gray-600 font-sans text-xs leading-relaxed line-clamp-2">
                  {blog.shortBio}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs">
                    {blog.name ? blog.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <span className="text-xs font-semibold text-gray-855 capitalize">
                    {blog.name || "lasya"}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="text-xs font-bold text-gray-400 hover:text-navy transition-colors flex items-center gap-1"
                >
                  Start reading <span className="text-sm">↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentInsights;
