import React from 'react';
import BlogActionButtons from './BlogActionButtons';

const BlogCard = ({
  blog,
  onView,
  onApprove,
  onReject,
  onRequestRevision,
  isProcessing,
  actionType,
  showReviewComments = false,
  showApproveOptions = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.heading}</h3>
        <p className="text-gray-600 mb-1">Author: {blog.name}</p>
        <p className="text-gray-600 mb-1">University: {blog.university}</p>
        <p className="text-gray-600 mb-1">Category: {blog.category}</p>

        {showReviewComments && blog.reviewComments && (
          <div>
            <h4 className="text-gray-600 mb-2">Revision Count: {blog.revisionCount}</h4>
            <div className="bg-yellow-50 p-3 rounded mb-3">
              <h4 className="font-medium text-yellow-800">Review Comments:</h4>
              <p className="text-yellow-700 text-sm">{blog.reviewComments}</p>
            </div>
          </div>
        )}

        <BlogActionButtons
          blog={blog}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          onRequestRevision={onRequestRevision}
          isProcessing={isProcessing}
          actionType={actionType}
          showReviewButton={showReviewComments}
          showApproveOptions={showApproveOptions}
        />
      </div>
    </div>
  );
};

export default BlogCard;