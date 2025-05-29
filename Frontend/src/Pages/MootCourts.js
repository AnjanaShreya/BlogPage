import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaTrophy, FaFileAlt, FaEnvelope } from 'react-icons/fa';

const MootCourts = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/moot-courts`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load moot court competitions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="relative z-20">
          <Navbar />
        </div>
        <CategoryHeading title="Moot Courts" />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative z-20">
        <Navbar />
      </div>
      <CategoryHeading title="Moot Courts" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {events.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {event.status || 'Upcoming'}
                      </span>
                    </div>
                    
                    <div className="space-y-4 text-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-800">
														<span className="font-semibold text-gray-600">Date: </span>
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaMapMarkerAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-800"><span className="font-semibold text-gray-600">Venue: </span>{event.venue}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaClock className="text-blue-600" />
                        </div>
                        <div>
                          {/* <p className="font-semibold text-gray-600">Registration Deadline</p> */}
                          <p className="text-gray-800">
														<span className='font-semibold text-gray-600'>Deadline: </span>
                            {new Date(event.registrationDeadline).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-800"><span className="font-semibold text-gray-600">Max Teams: </span>{event.teams}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaTrophy className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-800"><span className="font-semibold text-gray-600">Prizes: </span>{event.prizes}</p>
                        </div>
                      </div>
                      
                      {event.rulesLink && (
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FaFileAlt className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Rules</p>
                            <a 
                              href={event.rulesLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                            >
                              View Rules Document
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {event.schedule && event.schedule.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
												<h4 className="font-medium text-gray-800 mb-2">Schedule</h4>
												<ul className="space-y-1">
													{event.schedule.map((item, index) => (
														<li key={index} className="flex gap-2">
														<span className="font-medium text-blue-600 min-w-[60px]">{item.day}:</span>
														<span>{item.events}</span>
														</li>
													))}
												</ul>
											</div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">Contact</h4>
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaEnvelope className="text-blue-600" />
                        </div>
                        <a 
                          href={`mailto:${event.contact}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          {event.contact}
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        Register Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-md text-center max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Moot Court Competitions</h3>
              <p className="text-gray-600">There are currently no scheduled moot court competitions. Please check back later.</p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MootCourts;