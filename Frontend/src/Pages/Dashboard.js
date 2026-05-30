import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Signup from "../components/Signup";
import Footer from "../Navbar/Footer";
import ProfileCard from "../components/ProfileCard";
import RecentInsights from "../components/RecentInsights";
import img0 from '../assets/img0.jpg';
import { FaLaptop, FaSearch, FaUsers, FaBrain, FaPenNib, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const mootRes = await fetch(`${baseUrl}/api/moot-courts`);
        const mootData = await mootRes.json();
        const rawMoots = mootData.data || [];

        const progRes = await fetch(`${baseUrl}/api/programs`);
        const progData = await progRes.json();
        const rawProgs = progData.data || [];

        const internshipRes = await fetch(`${baseUrl}/api/internships`);
        const internshipData = await internshipRes.json();
        const rawInternships = internshipData.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const combined = [
          ...rawMoots.map(m => ({
            _id: m._id,
            title: m.title,
            date: new Date(m.date),
            venue: m.venue || 'TBD',
            description: m.description ? m.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '',
            link: '/opportunities'
          })),
          ...rawProgs
            .filter(p => p.status !== 'Draft' && p.status !== 'Completed')
            .map(p => ({
              _id: p._id,
              title: p.title,
              date: new Date(p.startDate),
              venue: 'Hybrid Mode',
              description: p.description ? p.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '',
              link: '/opportunities'
            })),
          ...rawInternships
            .filter(i => i.status !== 'Draft' && i.status !== 'Completed')
            .map(i => ({
              _id: i._id,
              title: i.title,
              date: new Date(i.startDate),
              venue: 'Hybrid Mode',
              description: i.description ? i.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '',
              link: '/opportunities'
            }))
        ];

        // Filter out old/expired events
        const filtered = combined
          .filter(e => e.date >= today)
          .sort((a, b) => a.date - b.date)
          .slice(0, 2);

        setUpcomingEvents(filtered);
      } catch (err) {
        console.error("Error fetching upcoming events for homepage:", err);
      }
    };
    fetchUpcomingEvents();
  }, [baseUrl]);

  // Debounce Search query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/blogform");
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowPopup(false);
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
  };

  return (
    <div className="font-sans bg-white min-h-screen flex flex-col justify-between">
      <div>
        {/* White Solid Navbar */}
        <Navbar />

        {/* Hero Section with Books Backdrop and premium overlay */}
        <section className="min-h-[90vh] relative bg-Hero bg-cover md:bg-top bg-center flex flex-col justify-center items-center px-6 md:px-24 py-16 text-center">
          {/* Original Navy translucent overlay restored */}
          <div className="absolute inset-0 bg-navy bg-opacity-65"></div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl flex flex-col items-center">

            {/* Capsule badge */}
            <span className="bg-white/10 text-gold font-sans font-bold tracking-widest text-[10px] uppercase px-4 py-1 rounded-full mb-4 border border-white/20 shadow-sm">
              A Community of Thinkers
            </span>

            {/* Premium Headline */}
            <h1 className="font-serif md:text-6xl text-4xl text-white font-semibold leading-tight mb-6">
              Scholarly Perspectives for <br />
              the <span className="font-serif italic text-gold">Modern Practitioner</span>
            </h1>

            {/* Subdescription */}
            <p className="text-gray-300 font-sans text-base max-w-2xl leading-relaxed mb-6">
              Legal Writings is the premier destination for simplified legal insights, academic research, and professional discourse. Join thousands of contributors shaping the future of law.
            </p>

            {/* Action link buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 font-sans">
              <button
                className="bg-gold hover:bg-gold-dark text-navy px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={handleButtonClick}
              >
                Write a Journal
              </button>
              <a
                href="/contactus"
                className="text-xs font-bold text-white hover:text-gold transition-colors tracking-widest uppercase flex items-center gap-1.5"
              >
                Our Editorial Standards <span className="text-sm font-semibold">→</span>
              </a>
            </div>

            {/* Premium Rounded Search Bar - Button removed, searching debounced */}
            <div className="w-full max-w-2xl relative shadow-lg rounded-full group focus-within:shadow-xl transition-shadow bg-white">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <ion-icon name="search-outline" style={{ fontSize: 20 }}></ion-icon>
              </div>
              <input
                type="text"
                placeholder="Search articles, topics, creators..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 font-sans text-sm focus:outline-none border-none transition-colors"
              />
            </div>

            {/* Trending tags - Translucent borders and white/gold hover styles */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-left">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider mr-1">TRENDING:</span>
              <button
                onClick={() => handleTagClick("Constitution")}
                className="bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-[9px] px-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all shadow-sm"
              >
                #ConstitutionalLaw
              </button>
              <button
                onClick={() => handleTagClick("Digital")}
                className="bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-[9px] px-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all shadow-sm"
              >
                #DigitalRights
              </button>
              <button
                onClick={() => handleTagClick("Administrative")}
                className="bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-[9px] px-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all shadow-sm"
              >
                #AdministrativeLaw
              </button>
              <button
                onClick={() => handleTagClick("Moot")}
                className="bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-[9px] px-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all shadow-sm"
              >
                #MootCourts
              </button>
            </div>

          </div>
        </section>

        {/* Show Signup Popup */}
        {showPopup && <Signup onClose={handleClosePopup} onLogin={handleLogin} />}

        {/* Dynamic 6-Card Recent Insights Layout */}
        <div className="bg-white">
          <RecentInsights searchQuery={searchQuery} />
        </div>

        {/* Explore by Subject Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-wide mb-3">
                Explore by Subject
              </h2>
              <p className="text-gray-500 font-sans text-sm md:text-base">
                Dive deep into specialized legal domains.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Technology */}
              <div
                onClick={() => handleTagClick("Technology")}
                className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-[#0f172a] text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaLaptop />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1">
                  Technology
                </h3>
                <span className="text-[11px] font-sans font-semibold text-gray-400 uppercase tracking-wider">
                  124 Articles
                </span>
              </div>

              {/* Card 2: Research */}
              <div
                onClick={() => handleTagClick("Research")}
                className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-[#0f172a] text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaSearch />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1">
                  Research
                </h3>
                <span className="text-[11px] font-sans font-semibold text-gray-400 uppercase tracking-wider">
                  89 Articles
                </span>
              </div>

              {/* Card 3: Human Rights */}
              <div
                onClick={() => handleTagClick("Human Rights")}
                className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-[#0f172a] text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaUsers />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1">
                  Human Rights
                </h3>
                <span className="text-[11px] font-sans font-semibold text-gray-400 uppercase tracking-wider">
                  156 Articles
                </span>
              </div>

              {/* Card 4: AI & Ethics */}
              <div
                onClick={() => handleTagClick("AI")}
                className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
              >
                <div className="text-[#0f172a] text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaBrain />
                </div>
                <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-1">
                  AI & Ethics
                </h3>
                <span className="text-[11px] font-sans font-semibold text-gray-400 uppercase tracking-wider">
                  67 Articles
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Remodeled About Us Section (Empowering Legal Minds) with Parallax Card Effect */}
        <section className="bg-white pb-12">
          <div className="max-w-[1500px] mx-auto px-4 md:px-8">
            <div
              style={parallax}
              className="relative rounded-[2.5rem] overflow-hidden py-16 px-6 md:px-12 text-center text-white shadow-2xl"
            >
              {/* Premium Deep Teal/Green overlay overlaying the parallax background */}
              <div className="absolute inset-0 bg-[#002a25] bg-opacity-95 z-0"></div>

              <div className="relative z-10 max-w-6xl mx-auto">
                {/* Title & Subtitle */}
                <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-wide mb-2 text-white">
                  Empowering Legal Minds
                </h2>
                <p className="text-gray-300 font-sans text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
                  More than just a blog—a platform to build your professional authority.
                </p>

                {/* 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {/* Col 1 */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 p-4.5 rounded-2xl inline-flex justify-center items-center mb-3 text-white hover:bg-white/20 transition-all duration-300">
                      <FaPenNib className="text-2xl" />
                    </div>
                    <h3 className="font-sans font-bold text-white text-lg mb-1.5">
                      Publish Ideas
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs">
                      Easy-to-use editor with professional formatting tools designed for academic writing.
                    </p>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 p-4.5 rounded-2xl inline-flex justify-center items-center mb-3 text-white hover:bg-white/20 transition-all duration-300">
                      <FaChartLine className="text-2xl" />
                    </div>
                    <h3 className="font-sans font-bold text-white text-lg mb-1.5">
                      Build Portfolio
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs">
                      Every article contributes to a permanent, shareable digital portfolio of your legal expertise.
                    </p>
                  </div>

                  {/* Col 3 */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 p-4.5 rounded-2xl inline-flex justify-center items-center mb-3 text-white hover:bg-white/20 transition-all duration-300">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                    <h3 className="font-sans font-bold text-white text-lg mb-1.5">
                      Editorial Feedback
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs">
                      Collaborate with experienced legal scholars to refine and polish your work before publication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profiles Section (Meet the Team) in light gray bg */}
        <div className="bg-gray-50 pt-16 pb-20">
          <ProfileCard />
        </div>

        {/* Upcoming Events Section */}
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">

            {/* Events Header */}
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-wide text-left">
                  Upcoming Events
                </h2>
              </div>
              <button
                onClick={() => navigate('/opportunities')}
                className="text-xs font-bold text-navy hover:text-navy-light tracking-widest uppercase transition-colors cursor-pointer"
              >
                View Opportunities
              </button>
            </div>

            {/* Dynamic Events Cards */}
            {upcomingEvents.length === 0 ? (
              <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl p-10 text-center font-sans">
                <p className="text-gray-500 font-bold text-sm">New opportunities and moot cohorts are being curated by our academic board.</p>
                <p className="text-gray-400 text-xs mt-1">Check back shortly or visit our Opportunities page to view details.</p>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="mt-4 px-6 py-2 bg-[#002a32] text-white hover:bg-[#003c47] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {upcomingEvents.map((event, idx) => {
                  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  const evDate = new Date(event.date);
                  const monthName = months[evDate.getMonth()];
                  const dayNum = evDate.getDate();

                  // Alternate colors slightly for premium layout feel
                  const dateBg = idx === 0 ? 'bg-[#002a32] text-white' : 'bg-[#ecc260] text-navy';

                  return (
                    <div key={event._id} className="bg-white border border-gray-150 rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[180px] text-left">
                      {/* Left Date Block */}
                      <div className={`${dateBg} flex flex-col justify-center items-center w-full sm:w-40 py-6 sm:py-0 px-4 text-center select-none`}>
                        <span className="text-[10px] font-sans font-extrabold tracking-widest uppercase opacity-75 mb-1">
                          {monthName}
                        </span>
                        <span className="font-serif text-5xl font-bold leading-none">
                          {dayNum}
                        </span>
                      </div>

                      {/* Right Content Block */}
                      <div className="p-6.5 flex-grow flex flex-col justify-between gap-4 font-sans pl-6 pr-6 py-5">
                        <div>
                          <h3 className="font-sans font-bold text-[#0f172a] text-lg mb-2 line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed max-w-sm line-clamp-2">
                            {event.description || "Discover tournament parameters, schedule layouts, host details, and participate in our upcoming cycle."}
                          </p>
                        </div>

                        {/* Footer Row */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                          <span className="text-[10px] font-bold text-[#002a32] tracking-wider uppercase flex items-center gap-1">
                            📍 {event.venue}
                          </span>
                          <button
                            onClick={() => navigate(event.link)}
                            className="bg-[#002a32] hover:bg-[#003c47] text-white text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Learn & Register
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

const parallax = {
  backgroundImage: `url(${img0})`,
  backgroundAttachment: "fixed",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

export default Dashboard;
