import React, { useState, useEffect } from 'react';
import AdminTopbar from './AdminComponents/AdminTopbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faCalendarAlt, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

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

  const saveEvent = async () => {
    try {
      const endpoint = isAdding 
        ? 'http://localhost:5000/api/moot-courts'
        : `http://localhost:5000/api/moot-courts/${currentEvent._id}`;
      
      const method = isAdding ? 'POST' : 'PUT';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentEvent),
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
  
      const data = await response.json();
      
      if (isAdding) {
        setEvents([...events, data.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      } else {
        setEvents(events.map(e => e._id === data.data._id ? data.data : e)
          .sort((a, b) => new Date(a.date) - new Date(b.date)));
      }
  
      // Reset form
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
      
      setIsAdding(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event: ' + error.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/moot-courts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/moot-courts');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

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
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-gray-200 min-h-screen">
        <AdminTopbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-amber-50 to-gray-200 min-h-screen'>
      <AdminTopbar />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Moot Court Competition Admin</h1>
            <button 
              onClick={startAddingEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Event
            </button>
          </div>

          {/* Events List */}
          {events.length > 0 ? (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                      <span>Max Teams: {event.teams}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => startEditingEvent(event)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faEdit} size="sm" />
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteEvent(event._id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                      Event Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 text-lg">No events available. Add a new event.</p>
            </div>
          )}

          {/* Add/Edit Form */}
          {(isEditing || isAdding) && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isAdding ? 'Add New Event' : 'Edit Event'}
                  </h2>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setIsAdding(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={currentEvent.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                    <input
                      type="date"
                      name="date"
                      value={currentEvent.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue*</label>
                  <input
                    type="text"
                    name="venue"
                    value={currentEvent.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={currentEvent.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline*</label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={currentEvent.registrationDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Teams*</label>
                    <input
                      type="number"
                      name="teams"
                      value={currentEvent.teams}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email*</label>
                    <input
                      type="email"
                      name="contact"
                      value={currentEvent.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prizes*</label>
                  <input
                    type="text"
                    name="prizes"
                    value={currentEvent.prizes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rules Link</label>
                  <input
                    type="url"
                    name="rulesLink"
                    value={currentEvent.rulesLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Event Schedule*</label>
                    <button 
                      type="button"
                      onClick={addScheduleItem}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                      Add Day
                    </button>
                  </div>
                  <div className="space-y-3">
                    {currentEvent.schedule.map((item, index) => (
                      <div key={index} className="flex space-x-3 items-center">
                        <input
                          type="text"
                          value={item.day}
                          onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                          placeholder="Day (e.g., Day 1)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <input
                          type="text"
                          value={item.events}
                          onChange={(e) => handleScheduleChange(index, 'events', e.target.value)}
                          placeholder="Events"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {currentEvent.schedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeScheduleItem(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}
                      </div>
                    ))}
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
                    onClick={saveEvent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {isAdding ? 'Add Event' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MootCourt;