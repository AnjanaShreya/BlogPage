import React, { useState, useEffect } from 'react';
import AdminTopbar from './AdminTopbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const SWPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    programType: 'summer'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/programs', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      
      const data = await response.json();
      setPrograms(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProgram(prev => ({ ...prev, [name]: value }));
  };

  const saveProgram = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare the data with proper date formatting
      const programData = {
        ...currentProgram,
        startDate: new Date(currentProgram.startDate).toISOString(),
        endDate: new Date(currentProgram.endDate).toISOString()
      };

      let response;
      let url = 'http://localhost:5000/api/programs';
      let method = 'POST';
      
      if (!isAdding) {
        url += `/${currentProgram._id}`;
        method = 'PUT';
      }

      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(programData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isAdding ? 'add' : 'update'} program`);
      }

      if (isAdding) {
        setPrograms([...programs, responseData.data]);
        toast.success('Program added successfully');
      } else {
        setPrograms(programs.map(prog => 
          prog._id === responseData.data._id ? responseData.data : prog
        ));
        toast.success('Program updated successfully');
      }

      // Reset form
      setCurrentProgram({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        programType: 'summer'
      });
      setIsAdding(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error(error.message);
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/programs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete program');
      }

      setPrograms(programs.filter(prog => prog._id !== id));
      toast.success('Program deleted successfully');
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error(error.message);
    }
  };

  const startAddingProgram = () => {
    setCurrentProgram({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      programType: 'summer'
    });
    setIsAdding(true);
    setIsEditing(true);
  };

  const startEditingProgram = (program) => {
    setCurrentProgram({
      _id: program._id,
      title: program.title,
      description: program.description,
      startDate: program.startDate.split('T')[0],
      endDate: program.endDate.split('T')[0],
      programType: program.programType
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  return (
    <div className='bg-gradient-to-br from-amber-50 to-gray-200 min-h-screen'>
      <AdminTopbar />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Summer and Winter Programs</h1>
            <button 
              onClick={startAddingProgram}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add Program
            </button>
          </div>
          
          {/* Add/Edit Form */}
          {(isEditing || isAdding) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              <div className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isAdding ? 'Add New Program' : 'Edit Program'}
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={currentProgram.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                    <select
                      name="programType"
                      value={currentProgram.programType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="summer">Summer Program</option>
                      <option value="winter">Winter Program</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                      name="description"
                      value={currentProgram.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength="10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                      <input
                        type="date"
                        name="startDate"
                        value={currentProgram.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                      <input
                        type="date"
                        name="endDate"
                        value={currentProgram.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={currentProgram.startDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setIsAdding(false);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProgram}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {isAdding ? 'Add Program' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Programs List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : programs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-lg shadow text-center"
            >
              <p className="text-gray-600 text-lg">No programs available. Add a new program.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {programs.map((program) => (
                <motion.div
                  key={program._id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full hover:shadow-lg transition-shadow"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium text-gray-800">{program.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        program.programType === 'summer' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {program.programType === 'summer' ? 'Summer' : 'Winter'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><span className="font-medium">Start:</span> {new Date(program.startDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">End:</span> {new Date(program.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2 justify-end">
                    <button
                      onClick={() => startEditingProgram(program)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProgram(program._id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SWPrograms;