import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generateBlogPDF = async (blog) => {
  try {
    const content = document.createElement("div");
    content.style.width = "800px";
    content.style.padding = "40px";
    content.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    content.style.backgroundColor = "#ffffff";
    content.style.color = "#2d3748";
    content.style.lineHeight = "1.6";

    content.innerHTML = `
      <style>
        .pdf-header {
          border-bottom: 2px solid #cbd5e0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .pdf-title {
          font-size: 30px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 10px 0;
        }
        .pdf-author {
          font-size: 18px;
          font-weight: 500;
          color: #4a5568;
          margin: 0 0 10px 0;
        }
        .pdf-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 14px;
          margin-top: 10px;
        }
        .pdf-meta-item {
          color: #2d3748;
        }
        .pdf-meta-label {
          font-weight: 600;
          color: #718096;
        }
        .pdf-section {
          margin-bottom: 25px;
        }
        .pdf-section-title {
          font-size: 22px;
          font-weight: 600;
          color: #2b6cb0;
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5px;
        }
        .pdf-content {
          font-size: 16px;
          color: #2d3748;
          white-space: pre-wrap;
        }
        .pdf-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 30px 0;
        }
      </style>

      <div class="pdf-header">
        <h1 class="pdf-title">${blog.heading}</h1>
        <p class="pdf-author">By ${blog.name}</p>
        <div class="pdf-meta">
          <div class="pdf-meta-item">
            <span class="pdf-meta-label">University:</span> ${blog.university}
          </div>
          <div class="pdf-meta-item">
            <span class="pdf-meta-label">Degree:</span> ${blog.degree}
          </div>
          <div class="pdf-meta-item">
            <span class="pdf-meta-label">Year:</span> ${blog.year}
          </div>
          <div class="pdf-meta-item">
            <span class="pdf-meta-label">Category:</span> ${blog.category}
          </div>
        </div>
      </div>

      <div class="pdf-section">
        <h2 class="pdf-section-title">Short Bio</h2>
        <div class="pdf-content">${blog.shortBio}</div>
      </div>

      <div class="pdf-divider"></div>

      <div class="pdf-section">
        <h2 class="pdf-section-title">Blog Content</h2>
        <div class="pdf-content">${blog.blogContent}</div>
      </div>
    `;

    document.body.appendChild(content);

    const canvas = await html2canvas(content, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const usableWidth = pdfWidth - margin * 2;
    const pdfHeight = (imgProps.height * usableWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, pdfHeight);

    document.body.removeChild(content);

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};
