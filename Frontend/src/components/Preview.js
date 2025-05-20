import React from "react";
import DOMPurify from "dompurify";

const Preview = ({ formData, selectedCategory, otherCategory, blogContent, onClose }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(blogContent);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Blog Preview</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-600 text-lg"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 pl-1">Author Information</h3>
            <div className="border bg-gray-100 p-2 rounded-lg">
              <p className="text-gray-800">
                <span className="font-medium">Name:</span> {formData.name}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">University:</span> {formData.university}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Degree:</span> {formData.degree}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Year:</span> {formData.year}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 pl-1 mb-2">Blog Details</h3>
            <div className="border  bg-gray-100 p-2 rounded-lg">
              <p className="text-gray-800">
                <span className="font-medium">Short Bio:</span> {formData.shortBio}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Category:</span>{" "}
                {selectedCategory === "Other Category" ? otherCategory : selectedCategory}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Heading:</span> {formData.heading}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Blog Content</h3>
          <div 
            className="prose max-w-none p-4 bg-gray-50 rounded-lg border border-gray-200"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;