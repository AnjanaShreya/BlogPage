import React from 'react';
import { FiClock, FiX } from "react-icons/fi";

const BlogCard = ({
  blog,
  onView,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  // Dummy word count based on length
  const wordCount = blog.blogContent ? Math.round(blog.blogContent.length / 5) : 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 hover:-translate-y-1 transform transition-all duration-200 flex flex-col h-full text-left">

      {/* Top Row: Category and Time */}
      <div className="flex justify-between items-center mb-3">
        <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-50 text-amber-700 tracking-wider">
          {blog.category || "General Law"}
        </span>
        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
          <FiClock />
          2h ago
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold font-serif text-[#002a32] tracking-tight leading-snug mt-3 mb-2.5 flex-grow pr-2">
        {blog.heading}
      </h3>

      {/* Author Info */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#002a32] text-white flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
          {getInitials(blog.name)}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-xs leading-tight">{blog.name || "Unknown"}</span>
          <span className="text-[11px] font-semibold text-gray-500 leading-tight truncate max-w-[180px]">{blog.university || "No university"}</span>
        </div>
      </div>

      {/* Meta (Word count, references) */}
      <div className="flex items-center gap-x-4 mb-4">
        <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60">
          Words: {wordCount.toLocaleString()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 pt-3 mt-auto flex gap-2">
        {/* Review */}
        <button
          onClick={onView}
          className="flex-grow border border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center"
        >
          Review
        </button>

        {/* Approve */}
        <button
          onClick={onApprove}
          disabled={isProcessing}
          className="flex-grow border border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700 font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center disabled:opacity-50"
        >
          Approve
        </button>


        {/* Reject */}
        <button
          onClick={onReject}
          disabled={isProcessing}
          className="p-2 text-red-500 hover:text-red-700 rounded-md border border-red-100 hover:bg-red-50 transition duration-200 cursor-pointer flex items-center justify-center disabled:opacity-50"
          title="Reject Submission"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default BlogCard;