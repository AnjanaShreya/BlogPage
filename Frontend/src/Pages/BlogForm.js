import React, { useState } from "react";
import img2 from "../assets/img2.jpg";
import Preview from "../components/Preview";
import { useNavigate } from "react-router-dom"; 

const BlogForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    degree: "",
    year: "",
    shortBio: "",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const navigate = useNavigate(); 

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle the category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle the blog content change
  const handleBlogChange = (e) => {
    setBlogContent(e.target.value);
  };

  // Handle preview
  const handlePreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  // Close preview
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = {
      name: formData.name,
      university: formData.university,
      degree: formData.degree,
      year: formData.year,
      shortBio: formData.shortBio,
      category: selectedCategory === "Other Category" ? otherCategory : selectedCategory,
      blogContent: blogContent,
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your blog has been submitted successfully!");
        console.log("Blog submitted:", data);
        
        // Reset the form
        setFormData({
          name: "",
          university: "",
          degree: "",
          year: "",
          shortBio: "",
        });
        setSelectedCategory("");
        setOtherCategory("");
        setBlogContent("");
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error submitting the blog:", error);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/"); 
  };

  return (
    <div className="w-full">
      <div className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${img2})` }}>
        <div className="bg-black bg-opacity-70 p-6 rounded-lg m-5 w-7/12">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-white text-2xl font-bold mb-4 text-center underline">
              Submit Your Blog
            </h2>

            {/* more changes to make */}
            <button
              onClick={handleGoToDashboard}
              className="bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600"
            >
            Go to Dashboard
            </button>

            <h3 className="text-white text-xl font-bold">Guidelines:</h3>
            <h3 className="text-white">
              To display an input field for "Other Category" when "Other Category" is selected, we can use React's useState to track the selected value and conditionally render the additional input field. Here's the updated code:
            </h3>

            <div>
              <label htmlFor="name" className="block text-white font-medium mb-1">
                Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="university" className="block text-white font-medium mb-1">
                University: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="university"
                placeholder="Enter your university"
                value={formData.university}
                onChange={handleInputChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-white font-medium mb-1">
                Degree: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="degree"
                placeholder="Enter your degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-white font-medium mb-1">
                Year: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="year"
                placeholder="Enter your year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="shortBio" className="block text-white font-medium mb-1">
                Short Bio: <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shortBio"
                placeholder="Write a short bio..."
                value={formData.shortBio}
                onChange={handleInputChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300 h-20 resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="category" className="block text-white font-medium mb-1">
                Select Category of Blog: <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
              >
                <option value="" disabled>
                  Select category...
                </option>
                <option value="Constitution law">Constitution law</option>
                <option value="Constitution of India">Constitution of India</option>
                <option value="The Code of Civil Procedure 1908">
                  The Code of Civil Procedure 1908
                </option>
                <option value="Administrative Law">Administrative Law</option>
                <option value="The Law of Contracts">The Law of Contracts</option>
                <option value="BNSS 2023">BNSS 2023</option>
                <option value="The Law of Evidence">The Law of Evidence</option>
                <option value="Law of Torts">Law of Torts</option>
                <option value="Election Laws">Election Laws</option>
                <option value="Human Rights">Human Rights</option>
                <option value="Other Category">Other Category</option>
              </select>
            </div>

            {selectedCategory === "Other Category" && (
              <div>
                <label
                  htmlFor="otherCategory"
                  className="block text-white font-medium mb-1"
                >
                  Specify Category Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="otherCategory"
                  placeholder="Enter category name"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  required
                  className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="blog"
                className="block text-white font-medium mb-1"
              >
                Write Your Blog: <span className="text-red-500">*</span>
              </label>
              <textarea
                id="blog"
                placeholder="Write your blog here..."
                value={blogContent}
                onChange={handleBlogChange}
                required
                className="w-full bg-white bg-opacity-90 text-black p-3 rounded-md border border-gray-300 h-52 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePreview}
                className="bg-teal-500 text-white font-bold py-2 px-4 mx-4 rounded-md hover:bg-teal-600"
              >
                Preview the Blog Display
              </button>
              <button
                type="submit"
                className="bg-teal-500 text-white font-bold w-52 py-2 px-4 rounded-md hover:bg-teal-600"
              >
                Submit the Blog
              </button>
            </div>
          </form>

          {isPreviewOpen && (
            <Preview
              formData={formData}
              selectedCategory={selectedCategory}
              otherCategory={otherCategory}
              blogContent={blogContent}
              onClose={handleClosePreview}
            />
          )}
        </div>
      </div>      
    </div>
  );
};

export default BlogForm;
