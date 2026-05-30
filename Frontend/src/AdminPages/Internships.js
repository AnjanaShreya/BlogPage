import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminComponents/AdminLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiLoader, FiPlus } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const Internships = () => {
  const [programs, setPrograms] = useState([]);
  const [viewingEnrollmentsEvent, setViewingEnrollmentsEvent] = useState(null);
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [currentProgram, setCurrentProgram] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    programType: 'internship',
    status: 'Active',
    enrollmentType: 'Individual',
    capacityType: 'Unlimited',
    seatsAvailable: '',
    stipend: '',
    duration: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading, verifySession } = useAuth();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetch = async () => {
      try {
        const isAuthenticated = await verifySession();

        const allowedRoles = ['admin', 'Chief Editor', 'Academic Coordinator', 'Events Coordinator', 'Internships Coordinator'];
        if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
          if (isMounted) {
            navigate("/admin/login");
          }
          return;
        }

        if (isMounted) {
          setIsLoading(true);
        }

        await fetchPrograms();
      } catch (err) {
        if (isMounted) {
          toast.error(err.message);
          console.error('Error in checkAuthAndFetch:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
      checkAuthAndFetch();
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.role, navigate]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/internships`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch internships');
      }

      const data = await response.json();
      setPrograms(data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProgram(prev => ({ ...prev, [name]: value }));
  };

  const saveProgram = async () => {
    try {
      const programData = {
        ...currentProgram,
        programType: 'internship', // Force internship
        startDate: new Date(currentProgram.startDate).toISOString(),
        endDate: new Date(currentProgram.endDate).toISOString()
      };

      let response;
      let url = `${baseUrl}/api/internships`;
      let method = 'POST';

      if (!isAdding) {
        url += `/${currentProgram._id}`;
        method = 'PUT';
      }

      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(programData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isAdding ? 'add' : 'update'} internship`);
      }

      await fetchPrograms(); // Refresh the list
      toast.success(isAdding ? 'Internship added successfully' : 'Internship updated successfully');

      resetForm();
    } catch (error) {
      console.error('Error saving internship:', error);
      toast.error(error.message);
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/internships/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete internship');
      }

      setPrograms(programs.filter(prog => prog._id !== id));
      toast.success('Internship deleted successfully');
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error(error.message);
    }
  };

  const startAddingProgram = () => {
    setCurrentProgram({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      programType: 'internship',
      status: 'Active',
      enrollmentType: 'Individual',
      capacityType: 'Unlimited',
      seatsAvailable: '',
      stipend: '',
      duration: ''
    });
    setIsAdding(true);
    setIsEditing(true);
  };

  const startEditingProgram = (program) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    setCurrentProgram({
      _id: program._id,
      title: program.title || '',
      description: program.description || '',
      startDate: formatDate(program.startDate),
      endDate: formatDate(program.endDate),
      programType: 'internship',
      status: program.status || 'Active',
      enrollmentType: program.enrollmentType || 'Individual',
      capacityType: program.capacityType || 'Unlimited',
      seatsAvailable: program.seatsAvailable || '',
      stipend: program.stipend || '',
      duration: program.duration || ''
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const resetForm = () => {
    setCurrentProgram({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      programType: 'internship',
      status: 'Active',
      enrollmentType: 'Individual',
      capacityType: 'Unlimited',
      seatsAvailable: '',
      stipend: '',
      duration: ''
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleUpdateStatus = async (programId, appId, newStatus) => {
    try {
      const response = await fetch(`${baseUrl}/api/internships/${programId}/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to update application status');
      }

      // Update the program in local programs state
      const updatedPrograms = programs.map(p => {
        if (p._id === programId) {
          return resData.data; // Return updated program with applications
        }
        return p;
      });

      setPrograms(updatedPrograms);

      // Update modal view immediate state
      setViewingEnrollmentsEvent(resData.data);

      toast.success(`Application status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating candidate status:', err);
      toast.error(err.message);
    }
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FiLoader className="animate-spin text-4xl text-[#002a32]" />
          <span className="ml-3 text-xl font-bold text-gray-500">Loading internships...</span>
        </div>
      </AdminLayout>
    );
  }

  if (isEditing || isAdding) {
    return (
      <AdminLayout>
        <main className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">
              <span>Internships</span>
              <span>/</span>
              <span className="text-[#002a32]">{isAdding ? 'Create Details' : 'Edit Details'}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex justify-between items-start text-left">
              <div>
                <h1 className="text-3xl font-bold text-[#002a32] font-serif tracking-tight">Update Internship Details</h1>
                <p className="text-gray-500 font-medium text-xs mt-1.5 leading-relaxed">
                  Modify the core description, stipend, and duration for this legal internship.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
                {currentProgram.status === 'Draft' ? 'DRAFT MODE' : 'LIVE MODE'}
              </span>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-8 shadow-sm space-y-6 text-left">

              {/* Internship Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Internship Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentProgram.title}
                  onChange={handleChange}
                  placeholder="e.g. Constitutional Law Research Internship"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Status</label>
                <select
                  name="status"
                  value={currentProgram.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                <div className="bg-white rounded-md">
                  <ReactQuill
                    value={currentProgram.description}
                    onChange={(content) => setCurrentProgram(prev => ({ ...prev, description: content }))}
                    placeholder="This intensive internship covers..."
                    className="text-gray-800"
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={currentProgram.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={currentProgram.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                    required
                  />
                </div>
              </div>

              {/* Stipend, Duration, and Openings */}
              <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Stipend Amount</label>
                    <input
                      type="text"
                      name="stipend"
                      value={currentProgram.stipend}
                      onChange={handleChange}
                      placeholder="Unpaid / ₹ 5,000"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Internship Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={currentProgram.duration}
                      onChange={handleChange}
                      placeholder="e.g. 6 Weeks"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Openings Available</label>
                    <input
                      type="text"
                      name="seatsAvailable"
                      value={currentProgram.seatsAvailable}
                      onChange={handleChange}
                      placeholder="e.g. 15 / Unlimited"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProgram}
                  className="px-6 py-2.5 bg-[#002a32] text-white rounded-lg hover:bg-[#003d49] transition text-xs font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 bg-[#F9FAFB]">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Careers</span>
              <span className="text-xs font-semibold text-gray-500">LexScripta Board</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002a32] font-serif tracking-tight">Internship Openings</h1>
            <p className="text-gray-500 font-medium max-w-4xl mt-3 leading-relaxed text-sm">
              Manage platform legal internships, stipend details, durations, and review applicant queues.
            </p>
          </div>
        </div>

        {/* Separate Active and Expired Events */}
        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const activeInternships = programs.filter(program => program.status !== 'Completed' && new Date(program.endDate || program.startDate) >= today);
          const expiredInternships = programs.filter(program => program.status === 'Completed' || new Date(program.endDate || program.startDate) < today);

          const renderCard = (program, isActive) => {
            const year = program.startDate ? new Date(program.startDate).getFullYear() : 2024;
            const statusLabel = program.status || 'Active';
            const statusDotColor =
              statusLabel === 'Active' ? 'bg-green-500' :
                statusLabel === 'Draft' ? 'bg-gray-400' :
                  'bg-gray-400';

            return (
              <motion.div
                key={program._id}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 transition-all flex flex-col h-full text-left"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-green-50 text-green-700">
                        INTERNSHIP {year}
                      </span>
                      {program.status === 'Draft' && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-100 text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 select-none">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? statusDotColor : 'bg-red-500'}`}></span>
                      {isActive ? statusLabel : 'Completed / Expired'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-[#002a32] tracking-tight leading-snug mt-3 mb-2">
                    {program.title}
                  </h3>
                  <div
                    className="text-xs text-gray-500 leading-relaxed font-sans mb-4 line-clamp-3 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: program.description ? program.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '' }}
                  />

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60">
                      Stipend: {program.stipend || 'Unpaid'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60">
                      Duration: {program.duration || 'N/A'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60">
                      Openings: {program.seatsAvailable || 'Unlimited'}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-3 mb-4 text-[11px] font-bold text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-150">
                    <span>Applicants: <strong className="text-[#002a32]">{program.applications ? program.applications.length : 0}</strong></span>
                    <span className="text-gray-300">|</span>
                    <span>Confirmed: <strong className="text-green-700">{program.applications ? program.applications.filter(a => a.status === 'Confirmed').length : 0}</strong></span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto flex gap-2">
                  <button
                    onClick={() => setViewingEnrollmentsEvent(program)}
                    className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => startEditingProgram(program)}
                    className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => deleteProgram(program._id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-md border border-red-100 hover:bg-red-50 transition duration-200 cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </motion.div>
            );
          };

          return (
            <div className="space-y-10 w-full col-span-full">
              {/* Active Section */}
              <div>
                <h2 className="text-xl font-bold font-serif text-[#002a32] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  🟢 Active & Upcoming Internships
                  <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">{activeInternships.length} Active</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeInternships.map(p => renderCard(p, true))}

                  {/* New Internship dashed card */}
                  <div
                    onClick={startAddingProgram}
                    className="border-2 border-dashed border-gray-200 bg-gray-50/20 rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer min-h-[280px] hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                      <FiPlus className="text-xl" />
                    </div>
                    <h3 className="text-sm font-bold text-[#002a32] font-serif mb-1">New Internship</h3>
                    <p className="text-[10px] text-gray-400 font-medium max-w-[160px]">
                      Post a new research or writing internship.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expired Section */}
              {expiredInternships.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#002a32] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                    🔴 Completed & Expired Internships
                    <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full">{expiredInternships.length} Expired</span>
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                    {expiredInternships.map(p => renderCard(p, false))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </main>

      {/* ENROLLMENT DETAILS MODAL VIEW */}
      {viewingEnrollmentsEvent && (() => {
        const internsList = viewingEnrollmentsEvent.applications || [];

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
                <div>
                  <span className="text-[9px] font-extrabold uppercase bg-[#002a32] text-white px-2 py-0.5 rounded tracking-wider mb-1.5 inline-block">
                    Internship Program
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#002a32]">{viewingEnrollmentsEvent.title}</h3>
                </div>
                <button
                  onClick={() => setViewingEnrollmentsEvent(null)}
                  className="text-gray-400 hover:text-[#002a32] transition font-bold text-lg cursor-pointer"
                >
                  ✖
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-left flex-grow">
                {/* Internship details */}
                <div className="bg-gray-50 border border-gray-250 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-[#002a32] uppercase tracking-wider border-b border-gray-200 pb-1.5 font-serif">
                    Internship Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Duration</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.duration || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Stipend</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.stipend || 'Unpaid'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Start Date</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.startDate ? new Date(viewingEnrollmentsEvent.startDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">End Date</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.endDate ? new Date(viewingEnrollmentsEvent.endDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Openings</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.seatsAvailable || 'Unlimited'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-150">
                      <span className="block text-gray-400 font-bold uppercase text-[9px] mb-1">About Internship</span>
                      <div
                        className="text-gray-700 font-sans leading-relaxed font-normal"
                        dangerouslySetInnerHTML={{ __html: viewingEnrollmentsEvent.description || 'No description provided.' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metric stats cards */}
                <div className="bg-[#E0F2F1]/30 border border-[#B2DFDB]/30 rounded-xl p-5 text-center">
                  <span className="block text-3xl font-extrabold text-[#004D40]">
                    {internsList.length} Enrolled Attendees
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1.5 block">Live Analytics</span>
                </div>

                {/* Enrolled lists block */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Individual Attendees (Click to view full application details)
                  </h4>
                  <div className="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {internsList.map((candidate, idx) => {
                      const candidateUniqueId = candidate._id || candidate.email || idx;
                      const isExpanded = expandedCandidateId === candidateUniqueId;
                      return (
                        <div key={idx} className="bg-white hover:bg-gray-50/40 transition flex flex-col">
                          {/* Header Row */}
                          <div
                            onClick={() => setExpandedCandidateId(isExpanded ? null : candidateUniqueId)}
                            className="p-4 flex justify-between items-center text-xs cursor-pointer select-none"
                          >
                            <div>
                              <span className="font-bold text-gray-900 text-sm hover:text-[#002a32] flex items-center gap-1.5">
                                {candidate.name}
                                <span className="text-[10px] text-gray-500 font-normal">
                                  {isExpanded ? "▲ Hide Details" : "▼ Show Details"}
                                </span>
                              </span>
                              <p className="text-[10px] text-gray-700 mt-0.5">{candidate.email} • {candidate.college}</p>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {candidate.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(viewingEnrollmentsEvent._id, candidate._id, 'Confirmed')}
                                    className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded text-[10px] border border-green-200 transition cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(viewingEnrollmentsEvent._id, candidate._id, 'Rejected')}
                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded text-[10px] border border-red-200 transition cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${candidate.status === 'Confirmed'
                                  ? 'bg-green-50 text-green-700'
                                  : candidate.status === 'Rejected'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-amber-50 text-amber-700'
                                  }`}>
                                  {candidate.status}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expanded Details Accordion Body */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 bg-gray-50/30 border-t border-gray-100 space-y-3.5 text-xs text-left">
                              {/* Skills */}
                              <div>
                                <span className="block text-[9px] text-gray-600 font-extrabold uppercase tracking-wider mb-1.5">Expertise & Skills</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {candidate.skills ? (
                                    candidate.skills.split(',').map((skill, sIdx) => (
                                      <span key={sIdx} className="bg-[#E0F2F1] text-[#004D40] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#B2DFDB]/40">
                                        {skill.trim()}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-600 italic">No legal skills listed</span>
                                  )}
                                </div>
                              </div>

                              {/* Cover Letter / Statement of Purpose */}
                              <div>
                                <span className="block text-[9px] text-gray-600 font-extrabold uppercase tracking-wider mb-1.5">Statement of Motivation</span>
                                <div className="border-l-2 border-[#002a32] pl-3 py-1.5 text-gray-800 leading-relaxed font-serif italic text-xs bg-white p-2.5 rounded-r-lg border border-gray-200/50">
                                  "{candidate.whyInterested || "No motivation statement provided by applicant."}"
                                </div>
                              </div>

                              {/* Contact Information */}
                              <div>
                                <span className="block text-[9px] text-gray-600 font-extrabold uppercase tracking-wider mb-1.5">Contact Email</span>
                                <span className="text-xs font-semibold text-gray-800 bg-white border border-gray-200/60 px-3 py-1.5 rounded-lg inline-block">
                                  {candidate.email}
                                </span>
                              </div>

                              {/* Resume Link */}
                              <div>
                                <span className="block text-[9px] text-gray-600 font-extrabold uppercase tracking-wider mb-1.5">Professional Resume & Credentials</span>
                                {candidate.resumeLink ? (
                                  <a
                                    href={candidate.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition hover:underline bg-white border border-gray-200/60 px-3 py-1.5 rounded-lg"
                                  >
                                    📁 Open Submitted Resume Link →
                                  </a>
                                ) : (
                                  <span className="text-gray-500 italic">No resume link provided</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-150 flex justify-end gap-3 bg-gray-50/50">
                <button
                  onClick={() => setViewingEnrollmentsEvent(null)}
                  className="px-5 py-2 bg-[#002a32] hover:bg-[#003d49] text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </AdminLayout>
  );
};

export default Internships;
