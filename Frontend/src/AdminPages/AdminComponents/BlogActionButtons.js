import React from 'react';
import { FiCheck, FiX, FiEdit, FiEye } from 'react-icons/fi';

const BlogActionButtons = ({
  blog,
  onView,
  onApprove,
  onReject,
  onRequestRevision,
  isProcessing,
  actionType,
  showReviewButton = true,
  showApproveOptions = true
}) => {
  return (
    <div className="flex flex-wrap gap-1 mt-4">
      <button
        onClick={onView}
        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
      >
        <FiEye className="mr-1" /> View
      </button>

      {showApproveOptions && (
        <>
          <button
            onClick={onApprove}
            disabled={isProcessing && actionType === 'approve'}
            className={`flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors ${isProcessing && actionType === 'approve' ? 'opacity-50' : ''}`}
          >
            {isProcessing && actionType === 'approve' ? (
              'Approving...'
            ) : (
              <>
                <FiCheck className="mr-1" /> Approve
              </>
            )}
          </button>

          <button
            onClick={onReject}
            disabled={isProcessing && actionType === 'reject'}
            className={`flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors ${isProcessing && actionType === 'reject' ? 'opacity-50' : ''}`}
          >
            {isProcessing && actionType === 'reject' ? (
              'Rejecting...'
            ) : (
              <>
                <FiX className="mr-1" /> Reject
              </>
            )}
          </button>
        </>
      )}

      {showReviewButton && (
        <button
          onClick={onRequestRevision}
          disabled={isProcessing && actionType === 'request-revision'}
          className={`flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors ${isProcessing && actionType === 'request-revision' ? 'opacity-50' : ''}`}
        >
          {isProcessing && actionType === 'request-revision' ? (
            'Requesting...'
          ) : (
            <>
              <FiEdit className="mr-1" /> Request Review
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default BlogActionButtons;