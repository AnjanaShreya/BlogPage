// This page is for user to edit and resubmit their blog after review.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaBuilding, FaCalendar, FaCheckCircle, FaUser } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReviewSubmission = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    degree: '',
    year: '',
    shortBio: '',
    category: '',
    blogContent: '',
    heading: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/blogs/${id}`);
        const data = await response.json();

        if (data.success) {
          setBlog(data.data);
          setFormData({
            name: data.data.name || '',
            university: data.data.university || '',
            degree: data.data.degree || '',
            year: data.data.year || '',
            shortBio: data.data.shortBio || '',
            category: data.data.category || '',
            blogContent: data.data.blogContent || '',
            heading: data.data.heading || ''
          });
        } else {
          setError(data.message || 'Blog not found');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${baseUrl}/api/blogs/resubmit/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to update blog');
			}

			setSuccess(true);
		} catch (err) {
			setError(err.message || 'Submission failed');
		} finally {
			setSubmitting(false);
		}
	};

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
          <span className="ml-3 text-xl">Loading blog...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="flex items-center justify-center h-64">
          <FiAlertCircle className="text-4xl text-red-500" />
          <span className="ml-3 text-xl text-red-600">{error}</span>
        </div>
      </div>
    );
  }

	if (success) {
		return (
			<div className="min-h-screen bg-amber-50 flex items-center justify-center">
				<div className="flex flex-col items-center justify-center text-center px-4">
					<FiCheckCircle className="text-5xl text-green-500 mb-4" />
					<h2 className="text-2xl font-semibold text-green-700">Submitted for Review</h2>
					<p className="mt-2 text-gray-700">
						Your blog has been successfully resubmitted and is now under review.
						You will receive an email with further updates.
					</p>
				</div>
			</div>
		);
	}

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Revise Your Blog Submission</h1>

        {blog?.reviewComments && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-bold text-yellow-800">Review Comments:</h3>
            <p className="whitespace-pre-wrap text-yellow-700">{blog.reviewComments}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
					<div className="mb-8">
						{/* Section Header */}
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0 h-5 w-5 text-blue-500">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
								</svg>
							</div>
							<h3 className="ml-2 text-lg font-semibold text-gray-800">Author Information</h3>
						</div>

						{/* Information Grid */}
						<div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
								{/* Name Field */}
								<div className="space-y-1">
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
									<div className="text-gray-900 font-medium flex items-center">
										<FaUser className="h-4 w-4 text-gray-400 mr-2" />
										{formData.name}
									</div>
								</div>

								{/* University Field */}
								<div className="space-y-1">
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">University</label>
									<div className="text-gray-900 font-medium flex items-center">
										<FaBuilding className="h-4 w-4 text-gray-400 mr-2" />
										{formData.university}
									</div>
								</div>

								{/* Degree Field */}
								<div className="space-y-1">
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</label>
									<div className="text-gray-900 font-medium flex items-center">
										<FaCheckCircle className="h-4 w-4 text-gray-400 mr-2" />
										{formData.degree}
									</div>
								</div>

								{/* Year Field */}
								<div className="space-y-1">
									<label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Year</label>
									<div className="text-gray-900 font-medium flex items-center">
										<FaCalendar className="h-4 w-4 text-gray-400 mr-2" />
										{formData.year}
									</div>
								</div>
							</div>
						</div>
					</div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Short Bio</label>
            <input
              type="text"
              name="shortBio"
              value={formData.shortBio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-white text-black p-3 rounded-md border border-gray-300"
            >
              <option value="" disabled>Select category...</option>
              <option value="Constitution of India">Constitution of India</option>
              <option value="The Code of Civil Procedure 1908">The Code of Civil Procedure 1908</option>
              <option value="Administrative Law">Administrative Law</option>
              <option value="The Law of Contracts">The Law of Contracts</option>
              <option value="BNSS 2023">BNSS 2023</option>
              <option value="The Law of Evidence">Evidence Act</option>
              <option value="Law of Torts">Law of Torts</option>
              <option value="Election Laws">Election Laws</option>
              <option value="Human Rights">Human Rights</option>
              <option value="Other Category">Other Category</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Blog Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

					<div className="mb-6">
						<label className="block text-gray-700 mb-2">Blog Content</label>
						<ReactQuill
							theme="snow"
							value={formData.blogContent}
							onChange={(value) => setFormData({ ...formData, blogContent: value })}
							className="bg-white rounded-lg h-[380px] overflow-auto"
						/>
					</div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Resubmit Blog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmission;
