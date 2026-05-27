import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaUsers, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#eaeeef] text-[#002a32] relative z-20 font-sans border-t border-gray-200/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row justify-between gap-12 lg:gap-6">
        
        {/* Column 1: Brand & Bio */}
        <div className="flex flex-col items-start gap-6 max-w-md">
          <Link to="/" className="no-underline">
            <span className="font-serif text-2xl font-bold tracking-wide text-[#002a32]">
              LEGAL WRITINGS
            </span>
          </Link>
          <p className="text-sm text-gray-600 font-sans leading-relaxed">
            A premier digital publication dedicated to deep legal analysis, scholarly debate, and the advancement of legal philosophy in a globalized world.
          </p>
          
          {/* Action Social Icons wrapped in soft-gray container badges */}
          <div className="flex items-center gap-3 mt-1">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#002a32] hover:bg-[#d8dfe1] transition-colors p-3 bg-[#e0e6e8] rounded-xl flex items-center justify-center shadow-sm"
            >
              <FaGlobe size={15} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#002a32] hover:bg-[#d8dfe1] transition-colors p-3 bg-[#e0e6e8] rounded-xl flex items-center justify-center shadow-sm"
            >
              <FaUsers size={15} />
            </a>
            <a
              href="#"
              className="text-[#002a32] hover:bg-[#d8dfe1] transition-colors p-3 bg-[#e0e6e8] rounded-xl flex items-center justify-center shadow-sm"
            >
              <FaEnvelope size={15} />
            </a>
          </div>
        </div>

        {/* Navigation Blocks */}
        <div className="flex flex-col sm:flex-row gap-16 lg:gap-24">
          
          {/* Column 2: Platform Links */}
          <div className="flex flex-col items-start gap-4">
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-[#002a32] mb-1">
              Platform
            </h4>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Editorial Guidelines
            </a>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              About Us
            </a>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Newsletter
            </a>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Submit a Thesis
            </a>
          </div>

          {/* Column 3: Legal Links */}
          <div className="flex flex-col items-start gap-4">
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-[#002a32] mb-1">
              Legal
            </h4>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Privacy Policy
            </a>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Terms of Service
            </a>
            <a href="/contactus" className="text-xs font-semibold text-gray-600 hover:text-[#002a32] transition-colors no-underline">
              Cookie Policy
            </a>
          </div>

        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="border-t border-[#d1d9db]/60 py-6 text-left">
          <span className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-widest block">
            © 2024 LEGAL WRITINGS. SCHOLARLY PERSPECTIVES FOR THE MODERN PRACTITIONER.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
