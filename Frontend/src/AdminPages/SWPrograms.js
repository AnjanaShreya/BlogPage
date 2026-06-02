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

const SWPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewingEnrollmentsEvent, setViewingEnrollmentsEvent] = useState(null);
  const [currentProgram, setCurrentProgram] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    programType: 'summer',
    status: 'Active',
    enrollmentType: 'Individual',
    capacityType: 'Unlimited',
    seatsAvailable: '',
    // Dynamic parameters
    speakerName: '',
    maxCapacity: '',
    liveSessionLink: '',
    prizePool: '',
    courtVenue: '',
    hostInstitution: '',
    programFee: '',
    stipend: '',
    duration: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading, verifySession } = useAuth();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const eventTabs = [
    { id: 'all', label: 'All Cycles' },
    { id: 'summer', label: 'Summer Cycle' },
    { id: 'winter', label: 'Winter Cycle' }
  ];

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetch = async () => {
      try {
        const isAuthenticated = await verifySession();

        const allowedRoles = ['admin', 'Chief Editor', 'Academic Coordinator', 'Events Coordinator'];
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
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.role, navigate]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/programs`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
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
        startDate: new Date(currentProgram.startDate).toISOString(),
        endDate: new Date(currentProgram.endDate).toISOString()
      };

      let response;
      let url = `${baseUrl}/api/programs`;
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
        throw new Error(responseData.message || `Failed to ${isAdding ? 'add' : 'update'} program`);
      }

      await fetchPrograms();
      toast.success(isAdding ? 'Program added successfully' : 'Program updated successfully');

      setCurrentProgram({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        programType: 'summer',
        status: 'Active',
        speakerName: '',
        maxCapacity: '',
        liveSessionLink: '',
        prizePool: '',
        courtVenue: '',
        hostInstitution: '',
        programFee: '',
        stipend: '',
        duration: ''
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
      const response = await fetch(`${baseUrl}/api/programs/${id}`, {
        method: 'DELETE',
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
      programType: activeTab === 'all' ? 'summer' : activeTab,
      status: 'Active',
      enrollmentType: 'Individual',
      capacityType: 'Unlimited',
      seatsAvailable: '',
      speakerName: '',
      maxCapacity: '',
      liveSessionLink: '',
      prizePool: '',
      courtVenue: '',
      hostInstitution: '',
      programFee: '',
      stipend: '',
      duration: ''
    });
    setIsAdding(true);
    setIsEditing(true);
  };

  const startEditingProgram = (program) => {
    const formatDateTime = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setCurrentProgram({
      _id: program._id,
      title: program.title || '',
      description: program.description || '',
      startDate: formatDateTime(program.startDate),
      endDate: formatDateTime(program.endDate),
      programType: program.programType || 'summer',
      status: program.status || 'Active',
      enrollmentType: program.enrollmentType || 'Individual',
      capacityType: program.capacityType || 'Unlimited',
      seatsAvailable: program.seatsAvailable || '',
      speakerName: program.speakerName || '',
      maxCapacity: program.maxCapacity || '',
      liveSessionLink: program.liveSessionLink || '',
      prizePool: program.prizePool || '',
      courtVenue: program.courtVenue || '',
      hostInstitution: program.hostInstitution || '',
      programFee: program.programFee || '',
      stipend: program.stipend || '',
      duration: program.duration || ''
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  // Filtered Programs computed based on selected event tab
  const filteredPrograms = React.useMemo(() => {
    if (activeTab === "all") return programs;
    return programs.filter(p => p.programType === activeTab);
  }, [programs, activeTab]);

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FiLoader className="animate-spin text-4xl text-[#002a32]" />
          <span className="ml-3 text-xl font-bold text-gray-500">Loading events...</span>
        </div>
      </AdminLayout>
    );
  }

  // 1. DEDICATED EDIT/CREATE DETAILS PAGE LAYOUT (IMAGE 2 MOCK)
  if (isEditing || isAdding) {
    return (
      <AdminLayout>
        <main className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Events</span>
              <span>/</span>
              <span className="text-[#002a32]">{isAdding ? 'Create Details' : 'Edit Details'}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-[#002a32] font-serif tracking-tight">Update Event Details</h1>
                <p className="text-gray-500 font-medium text-xs mt-1.5 leading-relaxed">
                  Modify the core information, schedule, and category-specific parameters for this legal program.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
                {currentProgram.status === 'Draft' ? 'DRAFT MODE' : 'LIVE MODE'}
              </span>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-8 shadow-sm space-y-6">

              {/* Event Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentProgram.title}
                  onChange={handleChange}
                  placeholder="Advanced Corporate Law Seminar 2024"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="programType"
                    value={currentProgram.programType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] cursor-pointer"
                  >
                    <option value="summer">Summer Programs</option>
                    <option value="winter">Winter Programs</option>
                  </select>
                </div>

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
                    <option value="Enrolling">Enrolling</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Description & Rich-Style Container */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                <div className="bg-white rounded-md">
                  <style>{`
                    .custom-quill .ql-toolbar.ql-snow {
                      border: 1px solid #e5e7eb !important;
                      border-top-left-radius: 0.375rem;
                      border-top-right-radius: 0.375rem;
                    }
                    .custom-quill .ql-container.ql-snow {
                      border: 1px solid #e5e7eb !important;
                      border-top: none !important;
                      border-bottom-left-radius: 0.375rem;
                      border-bottom-right-radius: 0.375rem;
                    }
                    .custom-quill .ql-editor {
                      min-height: 220px;
                    }
                  `}</style>
                  <ReactQuill
                    value={currentProgram.description}
                    onChange={(content) => setCurrentProgram(prev => ({ ...prev, description: content }))}
                    placeholder="This intensive program covers..."
                    className="text-gray-800 custom-quill"
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              {/* Start Date & Time & End Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={currentProgram.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={currentProgram.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                    required
                  />
                </div>
              </div>

              {/* Optional Fields: Enrollment & Seats settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 p-4 rounded-xl border border-gray-150 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Enrollment Format</label>
                  <select
                    name="enrollmentType"
                    value={currentProgram.enrollmentType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                  >
                    <option value="Individual">Individual Enrollment</option>
                    <option value="Team">Team Enrollment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Capacity Limit</label>
                  <div className="flex gap-4">
                    <select
                      name="capacityType"
                      value={currentProgram.capacityType}
                      onChange={handleChange}
                      className="flex-grow px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                    >
                      <option value="Unlimited">Unlimited Seats</option>
                      <option value="Limited">Limited Seats</option>
                    </select>
                    {currentProgram.capacityType === 'Limited' && (
                      <input
                        type="number"
                        name="seatsAvailable"
                        value={currentProgram.seatsAvailable}
                        onChange={handleChange}
                        placeholder="e.g. 50"
                        className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* DYNAMIC CATEGORY PARAMETERS (IMAGE 2 VALUE-ADD) */}
              {currentProgram.programType === 'livesession' && (
                <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Live Session Link (Zoom/Google Meet)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="liveSessionLink"
                        value={currentProgram.liveSessionLink}
                        onChange={handleChange}
                        placeholder="https://zoom.us/j/8291048821"
                        className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(currentProgram.liveSessionLink || '');
                          toast.success("Link copied!");
                        }}
                        className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Speaker Name</label>
                      <input
                        type="text"
                        name="speakerName"
                        value={currentProgram.speakerName}
                        onChange={handleChange}
                        placeholder="Rahul Verma, Senior Advocate"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Max Capacity</label>
                      <input
                        type="number"
                        name="maxCapacity"
                        value={currentProgram.maxCapacity}
                        onChange={handleChange}
                        placeholder="500"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentProgram.programType === 'mootcourt' && (
                <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Court Venue / Virtual Platform</label>
                      <input
                        type="text"
                        name="courtVenue"
                        value={currentProgram.courtVenue}
                        onChange={handleChange}
                        placeholder="Supreme Court of India (Virtual)"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Prize Pool</label>
                      <input
                        type="text"
                        name="prizePool"
                        value={currentProgram.prizePool}
                        onChange={handleChange}
                        placeholder="₹ 1,50,000"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(currentProgram.programType === 'summer' || currentProgram.programType === 'winter') && (
                <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Institutional Host</label>
                      <input
                        type="text"
                        name="hostInstitution"
                        value={currentProgram.hostInstitution}
                        onChange={handleChange}
                        placeholder="LexScripta Academy"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Application / Program Fees</label>
                      <input
                        type="text"
                        name="programFee"
                        value={currentProgram.programFee}
                        onChange={handleChange}
                        placeholder="Free / ₹ 999"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentProgram.programType === 'internship' && (
                <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Stipend Amount</label>
                      <input
                        type="text"
                        name="stipend"
                        value={currentProgram.stipend}
                        onChange={handleChange}
                        placeholder="Unpaid / ₹ 5,000"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Internship Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={currentProgram.duration}
                        onChange={handleChange}
                        placeholder="6 Weeks"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsAdding(false);
                  }}
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

  // 2. MAIN EVENTS LISTING & PLACEHOLDER GRID VIEW
  return (
    <AdminLayout>
      <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 bg-[#F9FAFB]">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Events Hub</span>
              <span className="text-xs font-semibold text-gray-500">LexScripta Board</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002a32] font-serif tracking-tight">LexScripta Programs</h1>
            <p className="text-gray-500 font-medium max-w-4xl mt-4 leading-relaxed text-sm">
              Manage and organize legal events, moot courts, academic sessions, and summer/winter schools.
            </p>
          </div>
        </div>

        {/* Underlined Navigation Tabs */}
        <div className="flex gap-8 overflow-x-auto border-b border-gray-200 scrollbar-none pb-[1px]">
          {eventTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] ${activeTab === tab.id
                ? 'text-[#002a32] border-[#002a32]'
                : 'text-gray-400 hover:text-[#002a32] border-transparent'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const activePrograms = filteredPrograms.filter(program => program.status !== 'Completed' && new Date(program.endDate || program.startDate) >= today);
          const expiredPrograms = filteredPrograms.filter(program => program.status === 'Completed' || new Date(program.endDate || program.startDate) < today);

          const renderCard = (program, isActive) => {
            const year = program.startDate ? new Date(program.startDate).getFullYear() : 2024;
            const statusLabel = program.status || 'Active';
            const statusDotColor =
              !isActive ? 'bg-red-500' :
                statusLabel === 'Active' ? 'bg-green-500' :
                  statusLabel === 'Draft' ? 'bg-gray-400' :
                    statusLabel === 'Enrolling' ? 'bg-amber-500' :
                      'bg-gray-400';

            const badgeBg =
              program.programType === 'summer' ? 'bg-amber-50 text-amber-700' :
                program.programType === 'winter' ? 'bg-slate-100 text-slate-700' :
                  program.programType === 'mootcourt' ? 'bg-purple-50 text-purple-700' :
                    program.programType === 'internship' ? 'bg-green-50 text-green-700' :
                      'bg-indigo-50 text-indigo-700';

            const isDraftMode = statusLabel === 'Draft';

            return (
              <motion.div
                key={program._id}
                whileHover={{ y: -4 }}
                className={`bg-white p-5 rounded-xl shadow-sm border transition-all flex flex-col h-full text-left ${isDraftMode
                  ? 'border-amber-200 shadow-md ring-1 ring-amber-100'
                  : 'border-gray-150'
                  }`}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded ${badgeBg}`}>
                        {tabLabel(program.programType)} {year}
                      </span>
                      {program.status === 'Draft' && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-100 text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 select-none">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`}></span>
                      {isActive ? statusLabel : 'Completed / Expired'}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-lg font-bold font-serif text-[#002a32] tracking-tight leading-snug mt-3 mb-2">
                    {program.title}
                  </h3>
                  {/* Description */}
                  <div
                    className="text-xs text-gray-500 leading-relaxed font-sans mb-4 line-clamp-3 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: program.description ? program.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : '' }}
                  />
                </div>

                <div className="border-t border-gray-100 pt-3 mt-auto">
                  {/* Starts / Ends Side-by-side */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Starts</span>
                      <span className="text-xs font-bold text-gray-800">
                        {new Date(program.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ends</span>
                      <span className="text-xs font-bold text-gray-800">
                        {new Date(program.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => setViewingEnrollmentsEvent(program)}
                      className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center font-sans"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => startEditingProgram(program)}
                      className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center font-sans"
                    >
                      {statusLabel === 'Completed' ? 'View Archive' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteProgram(program._id)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-md border border-red-100 hover:bg-red-50 transition duration-200 cursor-pointer flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          };

          return (
            <div className="space-y-10 w-full col-span-full">
              {/* Active Section */}
              <div>
                <h2 className="text-xl font-bold font-serif text-[#002a32] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-left">
                  🟢 Active & Upcoming Programs
                  <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">{activePrograms.length} Active</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activePrograms.map(p => renderCard(p, true))}

                  {/* New Program dashed card */}
                  <div
                    onClick={startAddingProgram}
                    className="border-2 border-dashed border-gray-200 bg-gray-50/20 rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer min-h-[280px] hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                      <FiPlus className="text-xl" />
                    </div>
                    <h3 className="text-sm font-bold text-[#002a32] font-serif mb-1">New Program</h3>
                    <p className="text-[10px] text-gray-400 font-medium max-w-[160px] font-sans">
                      Draft a new curriculum for the upcoming semester.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expired Section */}
              {expiredPrograms.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#002a32] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-left">
                    🔴 Completed & Expired Programs
                    <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full">{expiredPrograms.length} Expired</span>
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                    {expiredPrograms.map(p => renderCard(p, false))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ENROLLMENT DETAILS MODAL VIEW */}
        {viewingEnrollmentsEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
                <div>
                  <span className="text-[9px] font-extrabold uppercase bg-[#002a32] text-white px-2 py-0.5 rounded tracking-wider mb-1.5 inline-block">
                    {tabLabel(viewingEnrollmentsEvent.programType)}
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
                {/* Event details */}
                <div className="bg-gray-50 border border-gray-250 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-[#002a32] uppercase tracking-wider border-b border-gray-200 pb-1.5 font-serif">
                    Event Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Institutional Host</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.hostInstitution || 'LexScripta Academy'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Program Fees</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.programFee || 'Free'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Start Date & Time</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.startDate ? new Date(viewingEnrollmentsEvent.startDate).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">End Date & Time</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.endDate ? new Date(viewingEnrollmentsEvent.endDate).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Seats Available</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.capacityType === 'Limited' ? `${viewingEnrollmentsEvent.seatsAvailable} Seats` : 'Unlimited'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Enrollment Format</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.enrollmentType || 'Individual'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-150">
                      <span className="block text-gray-400 font-bold uppercase text-[9px] mb-1">About Program</span>
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
                    {(viewingEnrollmentsEvent.applications || []).length} Enrolled Attendees
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1.5 block">Live Analytics</span>
                </div>

                {/* Enrolled lists block */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    {viewingEnrollmentsEvent.enrollmentType === 'Team' ? 'Registered Moot Teams' : 'Individual Attendees'}
                  </h4>
                  <div className="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {(!viewingEnrollmentsEvent.applications || viewingEnrollmentsEvent.applications.length === 0) ? (
                      <div className="p-6 text-center text-gray-500 bg-white italic text-xs">
                        No active registrations for this program yet.
                      </div>
                    ) : (
                      viewingEnrollmentsEvent.applications.map((candidate, idx) => (
                        <div key={idx} className="p-3 bg-white flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-gray-800">{candidate.name}</span>
                            <p className="text-[10px] text-gray-500 mt-0.5">{candidate.email} • {candidate.college}</p>
                          </div>
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${candidate.status === 'Confirmed'
                              ? 'bg-green-50 text-green-700'
                              : candidate.status === 'Rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                            {candidate.status}
                          </span>
                        </div>
                      ))
                    )}
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
        )}

      </main>
    </AdminLayout>
  );
};

// Helper utility to translate schema tag to readable label
const tabLabel = (type) => {
  switch (type) {
    case 'summer': return 'Summer';
    case 'winter': return 'Winter';
    case 'mootcourt': return 'Moot Court';
    case 'internship': return 'Internship';
    case 'livesession': return 'Live Session';
    default: return 'General Event';
  }
};

export default SWPrograms;