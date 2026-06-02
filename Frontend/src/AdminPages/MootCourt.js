import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminComponents/AdminLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaPlus,
  FaTrash,
  FaTimes
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const MootCourt = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    date: '',
    venue: '',
    description: '',
    registrationDeadline: '',
    contact: '',
    teams: '',
    prizes: '',
    rulesLink: '',
    schedule: [{ day: '', events: '' }]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingEnrollmentsEvent, setViewingEnrollmentsEvent] = useState(null);
  const { user, loading: authLoading, verifySession } = useAuth();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleUpdateStatus = async (eventId, regId, newStatus) => {
    try {
      const response = await fetch(`${baseUrl}/api/moot-courts/${eventId}/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to update status');
      }

      // Update events in local state
      const updatedEvents = events.map(e => {
        if (e._id === eventId) {
          return resData.data;
        }
        return e;
      });

      setEvents(updatedEvents);
      setViewingEnrollmentsEvent(resData.data);
      toast.success(`Registration status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetch = async () => {
      try {
        const isAuthenticated = await verifySession();
        const allowedRoles = ['admin', 'Chief Editor', 'Moot Coordinator'];

        if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
          if (isMounted) {
            navigate("/admin/login");
          }
          return;
        }

        if (isMounted) {
          setIsLoading(true);
        }

        await fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/moot-courts`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.data || []);
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...currentEvent.schedule];
    updatedSchedule[index][field] = value;
    setCurrentEvent(prev => ({ ...prev, schedule: updatedSchedule }));
  };

  const addScheduleItem = () => {
    setCurrentEvent(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', events: '' }]
    }));
  };

  const removeScheduleItem = (index) => {
    setCurrentEvent(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      const endpoint = !currentEvent._id
        ? `${baseUrl}/api/moot-courts`
        : `${baseUrl}/api/moot-courts/${currentEvent._id}`;

      const method = !currentEvent._id ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(currentEvent)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }

      const data = await response.json();

      if (!currentEvent._id) {
        setEvents([...events, data.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
        toast.success('Event added successfully');
      } else {
        setEvents(events.map(e => e._id === data.data._id ? data.data : e)
          .sort((a, b) => new Date(a.date) - new Date(b.date)));
        toast.success('Event updated successfully');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/moot-courts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      setEvents(events.filter(event => event._id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.message);
    }
  };

  const startAddingEvent = () => {
    setCurrentEvent({
      title: '',
      date: '',
      venue: '',
      description: '',
      registrationDeadline: '',
      contact: '',
      teams: '',
      prizes: '',
      rulesLink: '',
      schedule: [{ day: '', events: '' }]
    });
    setIsAdding(true);
    setIsEditing(true);
  };

  const startEditingEvent = (event) => {
    setCurrentEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      registrationDeadline: event.registrationDeadline ?
        new Date(event.registrationDeadline).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const resetForm = () => {
    setCurrentEvent({
      title: '',
      date: '',
      venue: '',
      description: '',
      registrationDeadline: '',
      contact: '',
      teams: '',
      prizes: '',
      rulesLink: '',
      schedule: [{ day: '', events: '' }]
    });
    setIsEditing(false);
    setIsAdding(false);
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#002a32]"></div>
          <span className="ml-3 text-xl font-bold text-gray-500">Loading moot courts...</span>
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
              <span>Moot Courts</span>
              <span>/</span>
              <span className="text-[#002a32]">{isAdding ? 'Create Details' : 'Edit Details'}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex justify-between items-start text-left">
              <div>
                <h1 className="text-3xl font-bold text-[#002a32] font-serif tracking-tight">{isAdding ? 'Post New Moot Court' : 'Update Moot Court Details'}</h1>
                <p className="text-gray-500 font-medium text-xs mt-1.5 leading-relaxed">
                  Modify the core curriculum, schedules, max team capacities, and cash pool details.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2.5 py-1 rounded tracking-widest uppercase">
                LIVE MODE
              </span>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-8 shadow-sm space-y-6 text-left">
              <form onSubmit={saveEvent} className="space-y-6">

                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Event Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={currentEvent.title}
                    onChange={handleChange}
                    placeholder="e.g. 5th National Moot Court Competition"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Event Date*</label>
                    <input
                      type="date"
                      name="date"
                      value={currentEvent.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Registration Deadline*</label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={currentEvent.registrationDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                      required
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Venue*</label>
                  <input
                    type="text"
                    name="venue"
                    value={currentEvent.venue}
                    onChange={handleChange}
                    placeholder="e.g. Campus Courtroom Auditorium"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description*</label>
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
                        min-height: 200px;
                      }
                    `}</style>
                    <ReactQuill
                      value={currentEvent.description}
                      onChange={(content) => setCurrentEvent(prev => ({ ...prev, description: content }))}
                      placeholder="Provide deep description of moot court topic, parameters, case study details..."
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

                {/* Capacity & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Max Teams*</label>
                    <input
                      type="number"
                      name="teams"
                      value={currentEvent.teams}
                      onChange={handleChange}
                      placeholder="e.g. 40"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Email*</label>
                    <input
                      type="email"
                      name="contact"
                      value={currentEvent.contact}
                      onChange={handleChange}
                      placeholder="moots@school.org"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                      required
                    />
                  </div>
                </div>

                {/* Prizes & Rules Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Prizes*</label>
                    <input
                      type="text"
                      name="prizes"
                      value={currentEvent.prizes}
                      onChange={handleChange}
                      placeholder="INR 1,50,000 Cash Pool"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Rules PDF Link</label>
                    <input
                      type="url"
                      name="rulesLink"
                      value={currentEvent.rulesLink}
                      onChange={handleChange}
                      placeholder="http://rules.pdf"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32]"
                    />
                  </div>
                </div>

                {/* Schedule Plans */}
                <div className="bg-gray-50/50 border border-gray-150 rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Schedule Plans</label>
                    <button
                      type="button"
                      onClick={addScheduleItem}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <FaPlus className="text-[10px]" />
                      <span>Add Day</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {currentEvent.schedule.map((item, index) => (
                      <div key={index} className="flex space-x-2 items-center">
                        <input
                          type="text"
                          value={item.day}
                          onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                          placeholder="Day 1"
                          className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                          required
                        />
                        <input
                          type="text"
                          value={item.events}
                          onChange={(e) => handleScheduleChange(index, 'events', e.target.value)}
                          placeholder="Opening Ceremony & Draws"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32]"
                          required
                        />
                        {currentEvent.schedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeScheduleItem(index)}
                            className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#002a32] text-white rounded-lg hover:bg-[#003d49] transition text-xs font-bold cursor-pointer"
                  >
                    {isAdding ? 'Post Moot Event' : 'Save Changes'}
                  </button>
                </div>

              </form>
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
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Moots</span>
              <span className="text-xs font-semibold text-gray-500">Moot Court Administration Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002a32] font-serif tracking-tight">Moot Court Events</h1>
            <p className="text-gray-500 font-medium max-w-4xl mt-3 leading-relaxed text-sm">
              Manage platform moot court competitions, post schedules, specify registration limits, and coordinate participant registration details.
            </p>
          </div>
        </div>

        {/* Separate Active and Expired Events */}
        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const activeEvents = events.filter(event => new Date(event.date) >= today);
          const expiredEvents = events.filter(event => new Date(event.date) < today);

          const renderCard = (event, isActive) => {
            const year = event.date ? new Date(event.date).getFullYear() : 2024;
            return (
              <motion.div
                key={event._id}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-150 transition-all flex flex-col h-full text-left"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-green-50 text-green-700">
                      MOOT {year}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center gap-1.5 select-none ${isActive ? 'text-gray-500' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {isActive ? 'Active' : 'Completed / Expired'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-[#002a32] tracking-tight leading-snug mt-3 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4 line-clamp-3 overflow-hidden">
                    {event.description ? event.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : ''}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400 text-[8px]" /> {event.venue}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200/60 flex items-center gap-1">
                      <FaUsers className="text-gray-400 text-[8px]" /> {event.teams} Max Teams
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-auto flex gap-2">
                  <button
                    onClick={() => setViewingEnrollmentsEvent(event)}
                    className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => startEditingEvent(event)}
                    className="flex-grow border border-gray-200 hover:border-[#002a32] text-gray-700 hover:text-[#002a32] font-bold text-xs py-2 rounded-md transition duration-200 cursor-pointer text-center"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-md border border-red-100 hover:bg-red-50 transition duration-200 cursor-pointer flex items-center justify-center"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
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
                  🟢 Active & Upcoming Moot Courts
                  <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">{activeEvents.length} Active</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeEvents.map(event => renderCard(event, true))}
                  
                  {/* New Event dashed card */}
                  <div
                    onClick={startAddingEvent}
                    className="border-2 border-dashed border-gray-200 bg-gray-50/20 rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer min-h-[280px] hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                      <FaPlus className="text-xl" />
                    </div>
                    <h3 className="text-sm font-bold text-[#002a32] font-serif mb-1">New Moot Court</h3>
                    <p className="text-[10px] text-gray-400 font-medium max-w-[160px]">
                      Post a new national or international moot court event.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expired Section */}
              {expiredEvents.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#002a32] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                    🔴 Completed & Expired Moot Courts
                    <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full">{expiredEvents.length} Expired</span>
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                    {expiredEvents.map(event => renderCard(event, false))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </main>

      {/* ENROLLMENT DETAILS MODAL VIEW */}
      {viewingEnrollmentsEvent && (() => {
        const mockTeams = viewingEnrollmentsEvent.registrations || [];
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
                <div>
                  <span className="text-[9px] font-extrabold uppercase bg-[#002a32] text-white px-2 py-0.5 rounded tracking-wider mb-1.5 inline-block">
                    Moot Court Competition
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
                {/* Moot details */}
                <div className="bg-gray-50 border border-gray-250 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-[#002a32] uppercase tracking-wider border-b border-gray-200 pb-1.5 font-serif">
                    Moot Court Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Event Date</span>
                      <span className="font-semibold text-gray-800">
                        {viewingEnrollmentsEvent.date ? new Date(viewingEnrollmentsEvent.date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Registration Deadline</span>
                      <span className="font-semibold text-red-700">
                        {viewingEnrollmentsEvent.registrationDeadline ? new Date(viewingEnrollmentsEvent.registrationDeadline).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Venue</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.venue || 'TBD'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Max Teams Limit</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.teams || 'Unlimited'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Contact Email</span>
                      <span className="font-semibold text-gray-800">{viewingEnrollmentsEvent.contact || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Prizes & Rewards</span>
                      <span className="font-semibold text-amber-700">{viewingEnrollmentsEvent.prizes || 'N/A'}</span>
                    </div>
                    {viewingEnrollmentsEvent.rulesLink && (
                      <div className="col-span-2">
                        <span className="block text-gray-400 font-bold uppercase text-[9px]">Official Rules Link</span>
                        <a
                          href={viewingEnrollmentsEvent.rulesLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-650 hover:underline font-semibold"
                        >
                          📁 Open Official Rules PDF →
                        </a>
                      </div>
                    )}
                    <div className="col-span-2 pt-1 border-t border-gray-150">
                      <span className="block text-gray-400 font-bold uppercase text-[9px] mb-1">About Competition</span>
                      <div
                        className="text-gray-700 font-sans leading-relaxed font-normal mb-3"
                        dangerouslySetInnerHTML={{ __html: viewingEnrollmentsEvent.description || 'No description provided.' }}
                      />
                    </div>
                    {viewingEnrollmentsEvent.schedule && viewingEnrollmentsEvent.schedule.length > 0 && (
                      <div className="col-span-2 pt-2.5 border-t border-gray-150">
                        <span className="block text-gray-400 font-bold uppercase text-[9px] mb-1.5">Tournament Schedule</span>
                        <div className="border border-gray-150 rounded-lg p-3 bg-white space-y-2 divide-y divide-gray-100">
                          {viewingEnrollmentsEvent.schedule.map((sched, idx) => (
                            <div key={idx} className={`pt-2 ${idx === 0 ? 'pt-0' : ''} text-xs`}>
                              <span className="font-bold text-[#002a32] block md:inline md:mr-2">{sched.day || `Day ${idx}`}:</span>
                              <span className="text-gray-700 leading-relaxed font-sans">{sched.events}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric stats cards */}
                <div className="bg-[#E0F2F1]/30 border border-[#B2DFDB]/30 rounded-xl p-5 text-center">
                  <span className="block text-3xl font-extrabold text-[#004D40]">
                    {mockTeams.length} Registered Teams
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1.5 block">Live Analytics</span>
                </div>

                {/* Enrolled lists block */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Registered Moot Teams / Applicants
                  </h4>
                  <div className="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {mockTeams.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400 italic bg-white">
                        No team registrations found for this moot court event yet.
                      </div>
                    ) : (
                      mockTeams.map((team, idx) => (
                        <div key={team._id || idx} className="p-3.5 bg-white flex justify-between items-center text-xs hover:bg-gray-50/30 transition">
                          <div>
                            <span className="font-bold text-[#002a32]">{team.name} ({team.college})</span>
                            <p className="text-[10px] text-gray-600 mt-0.5">
                              Contact: <span className="font-semibold text-gray-750">{team.email}</span>
                              {team.leader && team.leader !== team.name && ` • Leader: ${team.leader}`}
                              {team.members && ` • Team Members: ${team.members}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {team.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(viewingEnrollmentsEvent._id, team._id, 'Confirmed')}
                                  className="px-2 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded text-[10px] border border-green-200 transition cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(viewingEnrollmentsEvent._id, team._id, 'Rejected')}
                                  className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded text-[10px] border border-red-200 transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${team.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {team.status || 'Confirmed'}
                              </span>
                            )}
                          </div>
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
        );
      })()}
    </AdminLayout>
  );
};

export default MootCourt;