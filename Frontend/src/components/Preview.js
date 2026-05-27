import React from "react";
import DOMPurify from "dompurify";

const Preview = ({ formData, selectedCategory, otherCategory, blogContent, onClose }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(blogContent);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-md max-w-4xl w-full overflow-y-auto max-h-[92vh] shadow-2xl border border-gray-100 flex flex-col justify-between font-sans">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-150">
          <h2 className="font-serif text-2xl text-[#002a32] font-semibold">
            Preview: Your Scholarly Insight
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 md:p-10 overflow-y-auto space-y-6 flex-grow">
          
          {/* Author Meta Grid (2x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="border border-gray-150 p-3 rounded-md bg-gray-50/50">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">AUTHOR</span>
              <p className="font-serif text-base font-semibold text-[#002a32] capitalize">
                {formData.name || "N/A"}
              </p>
            </div>

            <div className="border border-gray-150 p-3 rounded-md bg-gray-50/50">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">UNIVERSITY</span>
              <p className="font-serif text-base font-semibold text-[#002a32] capitalize">
                {formData.university || "N/A"}
              </p>
            </div>

            <div className="border border-gray-150 p-3 rounded-md bg-gray-50/50">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">DEGREE PROGRAM</span>
              <p className="font-serif text-base font-semibold text-[#002a32] capitalize">
                {formData.degree || "N/A"}
              </p>
            </div>

            <div className="border border-gray-150 p-3 rounded-md bg-gray-50/50">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ACADEMIC YEAR</span>
              <p className="font-serif text-base font-semibold text-[#002a32] capitalize">
                {formData.year || "N/A"}
              </p>
            </div>
          </div>

          {/* Thin separator */}
          <div className="border-t border-gray-150"></div>

          {/* Blog Details / Content Preview */}
          <div className="text-left space-y-5">
            {/* Category badge */}
            <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-3 py-1 rounded tracking-wider uppercase inline-block">
              {selectedCategory === "Other Category" ? otherCategory : selectedCategory || "UNSPECIFIED CATEGORY"}
            </span>

            {/* Title */}
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#002a32] leading-tight">
              {formData.heading || "Untitled Draft"}
            </h3>

            {/* Author Bio */}
            {formData.shortBio && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">AUTHOR BIO</span>
                <div className="border-l-2 border-[#b48e35] pl-4 italic text-sm text-gray-600 leading-relaxed font-sans">
                  {formData.shortBio}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-4 rounded-lg justify-center bg-gray-100">
            <span className="font-serif italic text-gray-600 text-lg">Draft Content for Editorial Review</span>
          </div>

          {/* Rich Blog content */}
          <div className="text-left font-serif text-gray-800 leading-relaxed text-base border-t border-gray-100 pt-6">
            <div 
              className="prose max-w-none font-serif text-gray-850"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

        </div>

        {/* Modal Action Footer Bar */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-150 flex justify-end gap-4 rounded-b-md">
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-6 rounded text-xs tracking-wider uppercase transition-colors"
          >
            Close Preview
          </button>
          <button
            onClick={onClose}
            className="bg-[#002a32] hover:bg-[#001a1f] text-white font-bold py-2 px-8 rounded text-xs tracking-wider uppercase transition-colors shadow-sm"
          >
            Submit for Review
          </button>
        </div>

      </div>
    </div>
  );
};

export default Preview;