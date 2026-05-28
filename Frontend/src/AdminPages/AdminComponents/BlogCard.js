import React from 'react';
import { FiClock, FiEye, FiCheck, FiX } from "react-icons/fi";
import { FaAlignLeft } from "react-icons/fa";

const BlogCard = ({
  blog,
  onView,
  onApprove,
  onReject,
  onRequestRevision,
  isProcessing,
  actionType,
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
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all relative flex flex-col h-full border border-gray-100 border-l-4 border-l-[#002a32]">

      {/* Top Row: Category and Time */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="bg-yellow-50 text-yellow-600 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {blog.category || "General Law"}
        </span>
        <span className="flex items-center text-xs text-gray-400 font-bold gap-1">
          <FiClock />
          2h ago
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-bold font-serif text-[#002a32] leading-tight mb-2.5 flex-grow pr-2">
        {blog.heading}
      </h3>

      {/* Author Info */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-full bg-[#002a32] text-white flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
          {getInitials(blog.name)}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-xs leading-tight">{blog.name || "Unknown"}</span>
          <span className="text-[11px] font-semibold text-gray-500 leading-tight truncate max-w-[140px]">{blog.university || "No university"}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-2.5"></div>

      {/* Meta (Word count, references) */}
      <div className="flex gap-5 mb-3.5">
        <div>
          <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-0.5">Words</span>
          <span className="text-xs font-bold text-gray-800">{wordCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-1 mt-auto">
        {/* Review */}
        <button
          onClick={onView}
          className="flex flex-col items-center justify-center py-2 bg-blue-50/70 hover:bg-blue-100 text-blue-600 rounded-md transition-all border border-blue-100"
        >
          <FiEye className="text-base mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wide">Review</span>
        </button>

        {/* Approve */}
        <button
          onClick={onApprove}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center py-2 bg-green-50/70 hover:bg-green-100 text-green-600 rounded-md transition-all border border-green-100 disabled:opacity-50"
        >
          <FiCheck className="text-base mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wide">Approve</span>
        </button>

        {/* Revision */}
        <button
          onClick={onRequestRevision}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center py-2 bg-yellow-50/70 hover:bg-yellow-100 text-yellow-600 rounded-md transition-all border border-yellow-100 disabled:opacity-50"
        >
          <FaAlignLeft className="text-base mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wide">Revise</span>
        </button>

        {/* Reject */}
        <button
          onClick={onReject}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center py-2 bg-red-50/70 hover:bg-red-100 text-red-600 rounded-md transition-all border border-red-100 disabled:opacity-50"
        >
          <FiX className="text-base mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-wide">Reject</span>
        </button>
      </div>

    </div>
  );
};

export default BlogCard;