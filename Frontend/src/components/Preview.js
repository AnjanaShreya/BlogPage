import React from "react";

const Preview = ({ formData, selectedCategory, otherCategory, blogContent, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 overflow-y-scroll h-[90vh]">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Blog Preview</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600"
          >
            x
          </button>
        </div>
        <p>
          <strong>Name:</strong> {formData.name}
        </p>
        <p>
          <strong>University:</strong> {formData.university}
        </p>
        <p>
          <strong>Degree:</strong> {formData.degree}
        </p>
        <p>
          <strong>Year:</strong> {formData.year}
        </p>
        <p>
          <strong>Short Bio:</strong> {formData.shortBio}
        </p>
        <p>
          <strong>Category:</strong>{" "}
          {selectedCategory === "Other Category" ? otherCategory : selectedCategory}
        </p>
        <p>
          <strong>Blog Content:</strong>
        </p>
        <div className="bg-gray-100 p-4 rounded-md whitespace-pre-line">
          {blogContent}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
