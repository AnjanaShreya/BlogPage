const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
    shortBio: { type: String, required: true },
    category: { type: String, required: true },
    blogContent: { type: String, required: true },
    heading: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
