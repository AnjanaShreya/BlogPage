import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import CategoryHeading from '../components/CategoryHeading';
import Footer from '../Navbar/Footer';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaInfoCircle, FaSnowflake, FaSun } from 'react-icons/fa';

const ProgramsSW = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/programs`);
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        const data = await response.json();
        setPrograms(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(program => 
    filter === 'all' || program.programType === filter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="relative z-20">
          <Navbar />
        </div>
        <CategoryHeading title="Summer and Winter Programs" />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      <CategoryHeading title="Summer and Winter Programs" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setFilter('summer')}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex ${
                filter === 'summer' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaSun className='mr-2 mt-1' />
              Summer Programs
            </button>
            <button
              onClick={() => setFilter('winter')}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex ${
                filter === 'winter' 
                  ? 'bg-blue-400 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaSnowflake className="mr-2 mt-1" />
              Winter Programs
            </button>
          </div>

          {filteredPrograms.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPrograms.map((program) => (
                <motion.div
                  key={program._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        program.programType === 'summer' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {program.programType === 'summer' ? 'Summer' : 'Winter'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Duration</p>
                          <p className="text-gray-800">
                            {new Date(program.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {' '}
                            {new Date(program.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaInfoCircle className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Type</p>
                          <p className="text-gray-800 capitalize">{program.programType} Program</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        Learn More
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No {filter === 'all' ? '' : filter} Programs Available
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'There are currently no programs scheduled.' 
                  : `There are currently no ${filter} programs scheduled.`}
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgramsSW;