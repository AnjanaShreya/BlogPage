import React from "react";
import { FiX, FiCheck, FiEdit2, FiLoader, FiClock } from "react-icons/fi";

const BlogDetailModal = ({
  blog,
  onClose,
  actionType,
  rejectionReason,
  reviewComments,
  onRejectionReasonChange,
  onReviewCommentsChange,
  onApprove,
  onRequestRevision,
  onReject,
  isProcessing
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[100] animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Modal Header & Scrollable Content Wrapper */}
        <div className="overflow-y-auto flex-grow">
          <div className="p-6 md:p-8">
            
            {/* Header Area */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="bg-[#002a32] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase">
                  Review Mode
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <FiClock />
                  Submitted on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-800 transition hover:bg-gray-100 rounded-full"
                title="Close"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002a32] font-serif leading-tight mb-8">
              {blog.heading}
            </h2>

            {/* AUTHOR INFORMATION */}
            <div className="mb-6">
              <h3 className="text-[10px] font-extrabold text-[#8C6D23] uppercase tracking-widest mb-3">Author Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 shadow-sm">
                  <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Full Name</span>
                  <span className="font-semibold text-gray-800 text-sm">{blog.name || "N/A"}</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 shadow-sm">
                  <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">University</span>
                  <span className="font-semibold text-gray-800 text-sm truncate block" title={blog.university || "N/A"}>{blog.university || "N/A"}</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 shadow-sm">
                  <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Degree</span>
                  <span className="font-semibold text-gray-800 text-sm">{blog.degree || "LLM"}</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 shadow-sm">
                  <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wide">Year</span>
                  <span className="font-semibold text-gray-800 text-sm">{blog.year || "Final Year"}</span>
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100 mb-8"></div>

            {/* PREVIOUS REVIEW COMMENTS */}
            {blog.reviewComments && (
              <div className="mb-8 p-6 bg-amber-50/50 border border-amber-200 rounded-xl text-left shadow-sm animate-in fade-in duration-200">
                <h3 className="text-xs font-extrabold text-[#8C6D23] uppercase tracking-wider mb-2">Previous Review Feedback</h3>
                <p className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap font-medium">{blog.reviewComments}</p>
              </div>
            )}

            {/* SUBMISSION METADATA */}
            <div className="mb-8">
              <h3 className="text-xs font-extrabold text-[#8C6D23] uppercase tracking-widest mb-4">Submission Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 mb-6">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-2">Category</span>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 font-bold text-[10px] px-3 py-1.5 rounded uppercase tracking-wider">
                      {blog.category || "General"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-2">Current Status</span>
                  <span className="text-[#8C6D23] font-bold text-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full border-2 border-[#8C6D23]"></div>
                    Pending Editorial Review
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 mb-2">Reviews Count</span>
                  <span className="bg-[#E0F2F1] text-[#004D40] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-[#B2DFDB]/40 inline-block font-sans select-none">
                    {blog.revisionCount || 0} Rounds
                  </span>
                </div>
              </div>
              
              <div>
                <span className="block text-[11px] font-bold text-gray-400 mb-2">Short Bio</span>
                <blockquote className="border-l-4 border-gray-200 pl-4 py-1 text-gray-600 italic text-sm">
                  {blog.shortBio || "No bio provided by the author."}
                </blockquote>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-8"></div>

            {/* MANUSCRIPT CONTENT */}
            <div>
              <h3 className="text-xs font-extrabold text-[#8C6D23] uppercase tracking-widest mb-4">Manuscript Content</h3>
              <div 
                className="prose prose-sm md:prose-base max-w-none text-gray-700 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 leading-relaxed font-serif" 
                dangerouslySetInnerHTML={{ __html: blog.blogContent }} 
              />
            </div>

            {/* DEDICATED REVIEW EDITOR SECTION (Always Visible) */}
            <div className="mt-8 p-6 bg-[#8C6D23]/5 border border-[#8C6D23]/20 rounded-xl text-left space-y-4 shadow-inner">
              <h3 className="text-xs font-extrabold text-[#002a32] uppercase tracking-wider flex items-center gap-2">
                <FiEdit2 className="text-[#8C6D23]" />
                <span>Write Editorial Review & Feedback</span>
              </h3>
              <textarea
                value={reviewComments}
                onChange={onReviewCommentsChange}
                className="w-full border border-gray-200 rounded-lg p-4 bg-white focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] outline-none transition text-sm font-sans text-gray-700"
                rows="4"
                placeholder="Enter detailed editorial corrections, annotations, and constructive feedback for the author (minimum 10 characters)..."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onRequestRevision}
                  disabled={!reviewComments || reviewComments.trim().length < 10 || isProcessing}
                  className="px-6 py-2.5 bg-[#002a32] hover:bg-[#003d49] text-[#ecc260] font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm font-sans"
                >
                  {isProcessing && actionType === 'request-revision' ? (
                    <FiLoader className="animate-spin text-sm" />
                  ) : (
                    <FiEdit2 className="text-sm" />
                  )}
                  <span>Send Review & Request Revision</span>
                </button>
              </div>
            </div>

            {actionType === 'reject' && (
              <div className="mt-8 p-6 bg-red-50/50 border border-red-100 rounded-xl">
                <label className="block font-bold text-red-800 mb-2 text-sm">Reason for Rejection</label>
                <textarea
                  value={rejectionReason}
                  onChange={onRejectionReasonChange}
                  className="w-full border border-red-200 rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm"
                  rows="4"
                  placeholder="Please provide a detailed reason for rejection (minimum 10 characters)..."
                />
              </div>
            )}
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 md:p-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-10">
          
          {actionType === 'reject' ? (
            <div className="flex justify-end gap-4">
              <button onClick={onClose} className="px-6 py-2.5 font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition" disabled={isProcessing}>Cancel</button>
              <button
                onClick={onReject}
                disabled={!rejectionReason || rejectionReason.trim().length < 10 || isProcessing}
                className="flex items-center justify-center px-8 py-2.5 bg-[#d93025] hover:bg-[#b0261d] text-white font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <FiLoader className="animate-spin mr-2" /> : <FiX className="mr-2" />}
                Confirm Rejection
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Left Actions */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Reject */}
                <button
                  onClick={onReject}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-[#d93025] hover:bg-[#b0261d] text-white font-bold rounded-lg transition shadow-sm text-sm cursor-pointer"
                >
                  <FiX className="mr-2 text-lg" />
                  Reject Submission
                </button>
              </div>
              
              {/* Right Actions */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Approve */}
                <button
                  onClick={onApprove}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none flex items-center justify-center px-8 py-3 bg-[#002a32] hover:bg-[#003d49] text-white font-bold rounded-lg transition shadow-sm text-sm cursor-pointer"
                >
                  <FiCheck className="mr-2 text-lg" />
                  Approve & Publish
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BlogDetailModal;