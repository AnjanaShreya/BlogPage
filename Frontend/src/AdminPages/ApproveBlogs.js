import React, { useState, useEffect } from "react";
import AdminTopbar from "./AdminTopbar";
import { useNavigate } from "react-router-dom";
import { FiEye, FiCheck, FiX, FiLoader, FiAlertCircle } from "react-icons/fi";

const ApproveBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/blogs/pending", {          
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          credentials: 'include'
        });
        
        if (response.status === 200) {
          const result = await response.json();
          setBlogs(Array.isArray(result.data) ? result.data : result);
        } else if (response.status === 401) {
          navigate("/admin/login");
        } else {
          throw new Error("Failed to fetch pending blogs");
        }
      } catch (err) {
        console.error("Error fetching pending blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBlogs();
  }, [navigate]);

  const sendEmailNotification = async (email, subject, message) => {
    try {
      const response = await fetch("http://localhost:5000/api/email/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          to: email,
          subject,
          text: message
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        console.error("Failed to send email notification");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleApprove = async (blogId) => {
    if (!blogId || blogId.length !== 24) {
      alert("Invalid blog ID");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`http://localhost:5000/api/blogs/approve/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ adminId: localStorage.getItem("userId") }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve blog");
      }

      // Get the blog data before filtering
      const approvedBlog = blogs.find(blog => blog._id === blogId);
      
      // Send approval email
      if (approvedBlog && approvedBlog.author && approvedBlog.author.email) {
        const subject = "Your Blog Has Been Approved";
        const message = `Dear ${approvedBlog.name},\n\n` +
          `We're pleased to inform you that your blog titled "${approvedBlog.heading}" has been approved.\n\n` +
          `You can now view it on our website.\n\n` +
          `Thank you for your contribution!\n\n` +
          `Best regards,\nThe Blog Team`;
        
        await sendEmailNotification(approvedBlog.author.email, subject, message);
      }

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      alert("Blog approved successfully!");
    } catch (error) {
      console.error("Error approving blog:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (blogId) => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      alert("Please provide a valid reason for rejection (minimum 10 characters)");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`http://localhost:5000/api/blogs/reject/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          adminId: localStorage.getItem("userId"),
          rejectionReason: rejectionReason.trim() 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject blog");
      }

      // Get the blog data before filtering
      const rejectedBlog = blogs.find(blog => blog._id === blogId);
      
      // Send rejection email
      if (rejectedBlog && rejectedBlog.author && rejectedBlog.author.email) {
        const subject = "Update on Your Blog Submission";
        const message = `Dear ${rejectedBlog.name},\n\n` +
          `We regret to inform you that your blog titled "${rejectedBlog.heading}" could not be approved.\n\n` +
          `Reason for rejection: ${rejectionReason.trim()}\n\n` +
          `You may revise and resubmit your blog for consideration.\n\n` +
          `Thank you for your understanding.\n\n` +
          `Best regards,\nThe Blog Team`;
        
        await sendEmailNotification(rejectedBlog.author.email, subject, message);
      }

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setSelectedBlog(null);
      setRejectionReason("");
      alert("Blog rejected successfully!");
    } catch (error) {
      console.error("Error rejecting blog:", error);
      alert(error.message || "An error occurred while rejecting the blog");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
          <span className="ml-3 text-xl">Loading pending blogs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="flex items-center justify-center h-64">
          <FiAlertCircle className="text-4xl text-red-500" />
          <span className="ml-3 text-xl text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pending Blogs for Approval</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {blogs.length} pending
          </span>
        </div>
        
        {blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiCheck className="mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No pending blogs</h2>
            <p className="text-gray-500">All blogs have been reviewed and approved</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{blog.heading}</h2>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">{blog.name}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.category}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.shortBio}</p>
                  
                  <div className="flex justify-between space-x-2">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                    >
                      <FiEye className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(blog._id)}
                      disabled={isProcessing}
                      className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <FiLoader className="animate-spin mr-2" />
                      ) : (
                        <FiCheck className="mr-2" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                    >
                      <FiX className="mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Detail Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBlog.heading}</h2>
                  <button
                    onClick={() => {
                      setSelectedBlog(null);
                      setRejectionReason("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Author Information</h3>
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedBlog.name}</p>
                    <p className="text-gray-600"><span className="font-medium">University:</span> {selectedBlog.university}</p>
                    <p className="text-gray-600"><span className="font-medium">Degree:</span> {selectedBlog.degree}</p>
                    <p className="text-gray-600"><span className="font-medium">Year:</span> {selectedBlog.year}</p>
                    <p className="text-gray-600"><span className="font-medium">Email:</span> {selectedBlog.author?.email || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Blog Details</h3>
                    <p className="text-gray-600"><span className="font-medium">Category:</span> {selectedBlog.category}</p>
                    <p className="text-gray-600"><span className="font-medium">Status:</span> <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span></p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Short Bio</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedBlog.shortBio}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Blog Content</h3>
                  <div 
                    className="prose max-w-none bg-gray-50 p-4 rounded-lg" 
                    dangerouslySetInnerHTML={{ __html: selectedBlog.blogContent }} 
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block font-semibold text-gray-700 mb-2">Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Please provide a detailed reason for rejection (minimum 10 characters)..."
                  />
                  {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                    <p className="mt-1 text-sm text-red-500">Reason must be at least 10 characters</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedBlog(null);
                      setRejectionReason("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApprove(selectedBlog._id)}
                    disabled={isProcessing}
                    className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <FiLoader className="animate-spin mr-2" />
                    ) : (
                      <FiCheck className="mr-2" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedBlog._id)}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveBlogs;