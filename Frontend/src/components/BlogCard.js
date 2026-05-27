import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[230px] w-[360px] m-4"
    >
      <div>
        <div className="flex justify-between items-center mb-3 text-xs text-gray-400 font-semibold uppercase tracking-wider font-sans">
          <span>{formatDate(blog.createdAt)}</span>
          <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
            {blog.category}
          </span>
        </div>
        <h3
          className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-navy cursor-pointer transition-colors"
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
          <div className="w-6 h-6 rounded-full bg-[#002a32] text-white flex items-center justify-center font-bold text-xs">
            {blog.name ? blog.name.charAt(0).toUpperCase() : "L"}
          </div>
          <span className="text-xs font-semibold text-gray-800 capitalize">
            {blog.name || "lasya"}
          </span>
        </div>
        <button
          onClick={() => navigate(`/blog/${blog._id}`)}
          className="text-xs font-bold text-gray-400 hover:text-[#002a32] transition-colors flex items-center gap-0.5"
        >
          Start reading <span className="text-sm">↗</span>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
