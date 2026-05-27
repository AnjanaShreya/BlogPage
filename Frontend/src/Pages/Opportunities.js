import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Navbar/Footer';
import CategoryHeading from '../components/CategoryHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaUser, 
  FaClock, 
  FaChevronDown, 
  FaArrowRight,
  FaTicketAlt
} from 'react-icons/fa';
import img0 from '../assets/img0.jpg';

const Opportunities = () => {
  const [dbMootCourts, setDbMootCourts] = useState([]);
  const [dbPrograms, setDbPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Latest Arrivals');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Moot Courts
        const mootRes = await fetch(`${baseUrl}/api/moot-courts`);
        const mootData = await mootRes.json();
        
        // Fetch Programs
        const progRes = await fetch(`${baseUrl}/api/programs`);
        const progData = await progRes.json();

        setDbMootCourts(mootData.data || []);
        setDbPrograms(progData.data || []);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast.error('Failed to load live opportunities. Showing curated events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  // Convert database items to a unified Event structure
  const dbEvents = [
    ...dbMootCourts.map(item => ({
      id: item._id,
      title: item.title,
      description: item.description || 'Discover key details and register for this premier moot court competition.',
      type: 'Moot Court',
      status: item.status || 'Upcoming',
      statusType: 'upcoming',
      dateText: item.date ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBD',
      date: item.date ? new Date(item.date) : new Date(),
      venue: item.venue || 'TBD',
      extraInfo: item.prizes ? `Prizes: ${item.prizes}` : 'Exciting Rewards',
      extraIcon: 'trophy',
      buttonText: 'Register Now',
      buttonStyle: 'gold',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
    })),
    ...dbPrograms.map(item => ({
      id: item._id,
      title: item.title,
      description: item.description || 'Elevate your learning through our dedicated summer and winter legal academic programs.',
      type: item.programType === 'winter' ? 'Winter Program' : 'Summer Program',
      status: 'Upcoming',
      statusType: 'upcoming',
      dateText: item.startDate ? `${new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'TBD',
      date: item.startDate ? new Date(item.startDate) : new Date(),
      venue: 'Hybrid Mode',
      extraInfo: 'Limited Seats Available',
      extraIcon: 'user',
      buttonText: 'Learn More',
      buttonStyle: 'teal',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
    }))
  ];

  // Apply filters
  const filteredEvents = dbEvents.filter(event => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Moot Courts') return event.type === 'Moot Court';
    if (activeFilter === 'Workshops') return event.type === 'Workshop' || event.type === 'Panel Discussion';
    if (activeFilter === 'Internships') return event.type === 'Internship';
    return true;
  });

  // Apply Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption === 'Latest Arrivals') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans antialiased text-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Navigation */}
      <div className="relative z-20 shadow-sm bg-white">
        <Navbar />
      </div>

      {/* Hero Banner Section */}
      <CategoryHeading 
        title="Explore Opportunities" 
        description="Elevate your legal career by discovering curated moot courts, international internships, panel discussions, and academic programs designed for the modern practitioner." 
      />

      {/* Main Content & Filter Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-10">
        
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6 mb-10">
          
          {/* Left: Filter By Event Type */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">
              Filter by Event Type
            </span>
            {['All', 'Moot Courts', 'Workshops', 'Internships'].map((filterName) => {
              const isActive = activeFilter === filterName;
              return (
                <button
                  key={filterName}
                  onClick={() => {
                    setActiveFilter(filterName);
                    setVisibleCount(6); // reset page
                  }}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#002a32] text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filterName === 'All' ? 'All Programs' : filterName}
                </button>
              );
            })}
          </div>

          {/* Right: Sort Dropdown */}
          <div className="relative self-end md:self-auto">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center justify-between min-w-[160px] bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>{sortOption}</span>
              <FaChevronDown className={`ml-2 text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-40 py-1 overflow-hidden"
                  >
                    {['Latest Arrivals', 'Oldest Opportunities'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs md:text-sm transition-colors ${
                          sortOption === option 
                            ? 'bg-[#002a32]/5 text-[#002a32] font-bold' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#002a32]"></div>
          </div>
        ) : (
          <>
            {/* Opportunities Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              <AnimatePresence>
                {sortedEvents.slice(0, visibleCount).map((event) => (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Card Content Wrapper */}
                    <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Upper Badge & Status */}
                        <div className="flex justify-between items-center mb-5">
                          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                            event.type === 'Moot Court'
                              ? 'bg-[#E0F2F1] text-[#00796B]'
                              : event.type.includes('Program')
                              ? 'bg-[#FFF3E0] text-[#E65100]'
                              : 'bg-[#F3E5F5] text-[#7B1FA2]'
                          }`}>
                            {event.type}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-gray-500">
                            {event.statusType === 'upcoming' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse inline-block"></span>
                            )}
                            {event.statusType === 'livesoon' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                            )}
                            {event.statusType === 'countdown' && (
                              <FaClock className="text-orange-500" />
                            )}
                            <span className="text-[#8D6E63] font-semibold">{event.status}</span>
                          </div>
                        </div>

                        {/* Event Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-[#002a32] mb-3 leading-snug font-serif hover:text-gold transition-colors duration-300">
                          {event.title}
                        </h3>

                        {/* Event Description */}
                        <p className="text-xs md:text-sm text-gray-500 mb-6 font-normal leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        {/* Quick Specs List */}
                        <div className="space-y-3.5 mb-8">
                          {/* Row 1: Date */}
                          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                              <FaCalendarAlt />
                            </div>
                            <span className="font-medium text-gray-600">{event.dateText}</span>
                          </div>
                          
                          {/* Row 2: Location */}
                          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                              <FaMapMarkerAlt />
                            </div>
                            <span className="font-medium text-gray-600">{event.venue}</span>
                          </div>

                          {/* Row 3: Special Attribute */}
                          <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                              {event.extraIcon === 'trophy' ? <FaTrophy className="text-yellow-600" /> : event.extraIcon === 'user' ? <FaUser className="text-blue-500" /> : <FaTicketAlt className="text-purple-500" />}
                            </div>
                            <span className="font-semibold text-gray-700">{event.extraInfo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {event.buttonStyle === 'gold' && (
                          <button className="w-full py-3 px-4 bg-[#8C6D23] hover:bg-[#a17e2b] text-white font-bold text-xs md:text-sm rounded-xl transition-all duration-300 shadow-sm">
                            {event.buttonText}
                          </button>
                        )}
                        {event.buttonStyle === 'teal' && (
                          <button className="w-full py-3 px-4 bg-[#002a32] hover:bg-[#003d49] text-white font-bold text-xs md:text-sm rounded-xl transition-all duration-300 shadow-sm">
                            {event.buttonText}
                          </button>
                        )}
                        {event.buttonStyle === 'outline' && (
                          <button className="w-full py-3 px-4 bg-white border border-[#002a32] text-[#002a32] hover:bg-[#002a32]/5 font-bold text-xs md:text-sm rounded-xl transition-all duration-300 shadow-sm">
                            {event.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Show More Opportunities Button */}
            {sortedEvents.length > visibleCount && (
              <div className="flex justify-center items-center mt-12 mb-16">
                <button
                  onClick={() => setVisibleCount(visibleCount + 3)}
                  className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#002a32] hover:text-[#8C6D23] uppercase tracking-wider transition-colors duration-300"
                >
                  <span>Show More Opportunities</span>
                  <FaArrowRight />
                </button>
              </div>
            )}

            {/* No Events State */}
            {sortedEvents.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl max-w-2xl mx-auto my-12 px-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Opportunities Found</h3>
                <p className="text-gray-500 text-sm">There are currently no legal opportunities available under the "{activeFilter}" tab. Please check back later.</p>
              </div>
            )}
          </>
        )}

        {/* Bottom Banner Section */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl mt-12 bg-[#002a32]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
            
            {/* Left: Text & CTA */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-serif leading-tight">
                Want to list your own legal event?
              </h2>
              <p className="text-gray-200 text-sm md:text-base font-normal leading-relaxed mb-8 max-w-xl">
                Connect with thousands of law students and professionals globally. Submit your opportunity to be featured on our platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="py-3 px-6 bg-[#8C6D23] hover:bg-[#a17e2b] text-white font-bold text-xs md:text-sm rounded-xl transition-all duration-300 shadow-md">
                  Submit Event
                </button>
                <button className="py-3 px-6 bg-transparent border border-white/40 text-white hover:bg-white/10 font-bold text-xs md:text-sm rounded-xl transition-all duration-300">
                  Partner with Us
                </button>
              </div>
            </div>

            {/* Right: Gavel Image (using current img0 with beautiful zoom cover style) */}
            <div 
              className="lg:col-span-5 min-h-[250px] lg:min-h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${img0})` }}
            >
              {/* Optional warm overlay matching the right side of the mock design */}
              <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-black/25 via-transparent to-[#002a32] lg:to-transparent"></div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Opportunities;
