import React from "react";
import { FiX, FiCheck, FiEdit2, FiLoader, FiDownload } from "react-icons/fi";
import { generateBlogPDF } from "./generateBlogPDF";

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
  const handleDownloadPDF = async () => {
    try {
      const pdf = await generateBlogPDF(blog);
      pdf.save(`${blog.heading.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadText = () => {
    try {
      const content = `
        ${blog.heading.toUpperCase()}
        ${"=".repeat(blog.heading.length)}
        
        Author: ${blog.name}
        University: ${blog.university}
        Degree: ${blog.degree}
        Year: ${blog.year}
        Category: ${blog.category}
        
        ${"-".repeat(40)}
        SHORT BIO
        ${"-".repeat(40)}
        ${blog.shortBio}
        
        ${"-".repeat(40)}
        BLOG CONTENT
        ${"-".repeat(40)}
        ${blog.blogContent.replace(/<[^>]*>/g, "").replace(/\n{3,}/g, '\n\n')}
      `;
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${blog.heading.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating text file:", error);
      alert("Failed to generate text file. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{blog.heading}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition group"
                title="Download as PDF"
              >
                <FiDownload className="mr-1 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={handleDownloadText}
                className="flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition group"
                title="Download as Text"
              >
                <FiDownload className="mr-1 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">TXT</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition hover:bg-gray-100 rounded"
                title="Close"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Author Information</h3>
              <p className="text-gray-600"><span className="font-medium">Name:</span> {blog.name}</p>
              <p className="text-gray-600"><span className="font-medium">University:</span> {blog.university}</p>
              <p className="text-gray-600"><span className="font-medium">Degree:</span> {blog.degree}</p>
              <p className="text-gray-600"><span className="font-medium">Year:</span> {blog.year}</p>
              <p className="text-gray-600"><span className="font-medium">Email:</span> {blog.author?.email || "Not provided"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Blog Details</h3>
              <p className="text-gray-600"><span className="font-medium">Category:</span> {blog.category}</p>
              <p className="text-gray-600"><span className="font-medium">Status:</span> <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span></p>
              {blog.revisionCount > 0 && (
                <p className="text-gray-600"><span className="font-medium">Revisions:</span> {blog.revisionCount}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Short Bio</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{blog.shortBio}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Blog Content</h3>
            <div 
              className="prose max-w-none bg-gray-50 p-4 rounded-lg" 
              dangerouslySetInnerHTML={{ __html: blog.blogContent }} 
            />
          </div>
          
          {actionType === 'request-revision' && (
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Review Comments</label>
              <textarea
                value={reviewComments}
                onChange={onReviewCommentsChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Please provide detailed comments for revision (minimum 10 characters)..."
              />
              {reviewComments.length > 0 && reviewComments.length < 10 && (
                <p className="mt-1 text-sm text-red-500">Comments must be at least 10 characters</p>
              )}
            </div>
          )}
          
          {actionType === 'reject' && (
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={onRejectionReasonChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Please provide a detailed reason for rejection (minimum 10 characters)..."
              />
              {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                <p className="mt-1 text-sm text-red-500">Reason must be at least 10 characters</p>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            
            {actionType === 'request-revision' ? (
              <button
                onClick={onRequestRevision}
                disabled={!reviewComments || reviewComments.trim().length < 10 || isProcessing}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  !reviewComments || reviewComments.trim().length < 10 || isProcessing
                    ? "bg-yellow-300 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin inline mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiEdit2 className="inline mr-2" />
                    Request Review
                  </>
                )}
              </button>
            ) : actionType === 'reject' ? (
              <button
                onClick={onReject}
                disabled={!rejectionReason || rejectionReason.trim().length < 10 || isProcessing}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  !rejectionReason || rejectionReason.trim().length < 10 || isProcessing
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin inline mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            ) : (
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <FiLoader className="animate-spin mr-2" />
                ) : (
                  <FiCheck className="mr-2" />
                )}
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;