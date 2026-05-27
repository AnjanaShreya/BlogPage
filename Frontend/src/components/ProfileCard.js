import React from 'react';
import anjana from '../assets/anjana.png';
import vishal from '../assets/vishal.png';
import mandeep from "../assets/Mandeep.png";

const ProfileCard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-2">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-wide mb-1">
            Voices of Authority
          </h2>
          <p className="text-gray-500 font-sans text-sm">
            Meet the creators driving legal discourse on our platform.
          </p>
        </div>
        <button className="bg-[#002a32] text-white px-6 py-2.5 rounded-md hover:bg-[#003844] transition-colors text-xs font-bold tracking-wider uppercase self-start md:self-auto shadow-md hover:shadow-lg duration-300">
          Become a Contributor
        </button>
      </div>

      {/* Grid of Creators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creator 1: Mandeep Kaur */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[270px]">
          <div className="flex flex-col items-center">
            {/* Avatar with Gold Circle ring */}
            <div className="w-16 h-16 rounded-full p-1 border-2 border-gold/70 overflow-hidden mb-4 flex justify-center items-center bg-gray-50 shadow-sm">
              <img className="w-full h-full object-cover rounded-full" src={mandeep} alt="Mandeep Kaur" />
            </div>
            
            <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1 leading-snug">
              Mandeep Kaur
            </h3>
            <span className="text-[10px] font-sans font-extrabold text-gold tracking-widest uppercase block mb-2">
              Founder & Law Professor
            </span>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs my-4">
              Specializing in Constitutional Law and Jurisprudence with 15+ years of academic research.
            </p>
          </div>
          
          <div className="w-full border-t border-gray-100 pt-3 text-[10px] font-sans font-bold text-navy uppercase tracking-widest">
            42 Articles <span className="text-gray-300 mx-2">•</span> 1.2K Citations
          </div>
        </div>

        {/* Creator 2: Vishal Chintala */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[320px]">
          <div className="flex flex-col items-center">
            {/* Avatar with Gold Circle ring */}
            <div className="w-16 h-16 rounded-full p-1 border-2 border-gold/70 overflow-hidden mb-4 flex justify-center items-center bg-gray-50 shadow-sm">
              <img className="w-full h-full object-cover rounded-full" src={vishal} alt="Vishal Chintala" />
            </div>
            
            <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1 leading-snug">
              Vishal Chintala
            </h3>
            <span className="text-[10px] font-sans font-extrabold text-gold tracking-widest uppercase block mb-2">
              Student Researcher
            </span>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs my-4">
              Exploring the intersection of emerging technologies and traditional legal frameworks.
            </p>
          </div>
          
          <div className="w-full border-t border-gray-100 pt-3 text-[10px] font-sans font-bold text-navy uppercase tracking-widest">
            18 Articles <span className="text-gray-300 mx-2">•</span> 450 Reads
          </div>
        </div>

        {/* Creator 3: Anjana Shreya */}
        <div className="bg-white border border-gray-150/80 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[320px]">
          <div className="flex flex-col items-center">
            {/* Avatar with Gold Circle ring */}
            <div className="w-16 h-16 rounded-full p-1 border-2 border-gold/70 overflow-hidden mb-4 flex justify-center items-center bg-gray-50 shadow-sm">
              <img className="w-full h-full object-cover rounded-full" src={anjana} alt="Anjana Shreya" />
            </div>
            
            <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1 leading-snug">
              Anjana Shreya
            </h3>
            <span className="text-[10px] font-sans font-extrabold text-gold tracking-widest uppercase block mb-2">
              Legal Developer
            </span>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs my-4">
              Bridging the gap between software engineering and legal compliance through technical writing.
            </p>
          </div>
          
          <div className="w-full border-t border-gray-100 pt-3 text-[10px] font-sans font-bold text-navy uppercase tracking-widest">
            12 Articles <span className="text-gray-300 mx-2">•</span> 890 Reads
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
