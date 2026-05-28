import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminComponents/AdminLayout';
import { toast } from 'react-toastify';
import { 
  FaUserPlus, 
  FaEnvelope, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaClock, 
  FaTrashAlt, 
  FaUserShield, 
  FaPaperPlane 
} from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Chief Editor');
  const [isOpen, setIsOpen] = useState(false);
  
  const roles = [
    { value: 'Chief Editor', label: 'Chief Editor (All categories)' },
    { value: 'Blog Reviewer', label: 'Blog Reviewer (Articles only)' },
    { value: 'Moot Coordinator', label: 'Moot Coordinator (Moot Courts)' },
    { value: 'Academic Coordinator', label: 'Academic Coordinator (Summer/Winter Programs)' },
    { value: 'Events Coordinator', label: 'Events Coordinator (Live Events)' },
  ];

  const [subAdmins, setSubAdmins] = useState([
    { id: 1, email: 'pranav.sharma@lexscripta.org', role: 'Chief Editor', status: 'Active', invitedAt: '2026-05-10' },
    { id: 2, email: 'ananya.iyer@lexscripta.org', role: 'Blog Reviewer', status: 'Active', invitedAt: '2026-05-18' },
    { id: 3, email: 'karan.malhotra@lexscripta.org', role: 'Moot Coordinator', status: 'Pending Invite', invitedAt: '2026-05-27' },
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Dynamic UI-only simulation of sending invitation
    const newSubAdmin = {
      id: Date.now(),
      email: email.trim(),
      role: role,
      status: 'Pending Invite',
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setSubAdmins(prev => [newSubAdmin, ...prev]);
    toast.success(`Invitation successfully sent to ${email}! A secure registration link has been dispatched.`);
    setEmail('');
  };

  const handleDelete = (id, subAdminEmail) => {
    if (window.confirm(`Are you sure you want to revoke sub-admin access for ${subAdminEmail}?`)) {
      setSubAdmins(prev => prev.filter(sa => sa.id !== id));
      toast.success(`Access revoked for ${subAdminEmail}`);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-[#F9FAFB]">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Access Control</span>
              <span className="text-xs font-semibold text-gray-500">LexScripta Board Settings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002a32] font-serif tracking-tight">System Settings</h1>
            <p className="text-gray-500 font-medium max-w-4xl mt-3 leading-relaxed text-sm">
              Manage platform settings, sub-admin privileges, and grant administrative access to editors and coordinators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. LEFT SIDE: ADD SUB-ADMIN FORM */}
          <div className="lg:col-span-1 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] text-[#004D40] flex items-center justify-center text-lg">
                  <FaUserPlus />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#002a32] font-serif">Invite Sub-Admin</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Grant specialized reviewer permissions</p>
                </div>
              </div>

              {/* Informative Gold Box */}
              <div className="bg-[#8C6D23]/5 border border-[#8C6D23]/20 rounded-xl p-4.5 mb-6 text-left">
                <div className="flex gap-3 p-2">
                  <FaShieldAlt className="text-[#8C6D23] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider mb-1">Invitation Flow</h4>
                    <p className="text-[11px] text-[#8C6D23]/90 leading-relaxed font-medium">
                      Invited users will receive a secure registration email. They can set up a password and gain immediate system access matching the chosen role.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInvite} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                      <FaEnvelope className="text-sm" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="editor@lexscripta.org"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-all"
                      required
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Assigned Role</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] cursor-pointer text-left flex justify-between items-center"
                    >
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                        <FaUserShield className="text-sm" />
                      </span>
                      <span className="text-gray-800 font-medium">
                        {roles.find(r => r.value === role)?.label || role}
                      </span>
                      <span className="text-gray-400 text-xs transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▲
                      </span>
                    </button>

                    {isOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          {roles.map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => {
                                setRole(r.value);
                                setIsOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-xs md:text-sm font-semibold transition-all hover:bg-[#E0F2F1] hover:text-[#004D40] block ${
                                role === r.value 
                                  ? 'bg-[#E0F2F1]/50 text-[#004D40]' 
                                  : 'text-gray-600'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 bg-[#002a32] hover:bg-[#003d49] text-[#ecc260] font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow transition-all duration-200 cursor-pointer"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>Send Invitation</span>
                </button>
              </form>
            </div>
          </div>

          {/* 2. RIGHT SIDE: ACTIVE SUB-ADMINS LIST */}
          <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#002a32] font-serif">Active Administrators</h3>
                <p className="text-[11px] text-gray-400 font-medium">Currently registered team members</p>
              </div>
              <span className="bg-[#E0F2F1] text-[#004D40] text-xs font-extrabold px-3 py-1 rounded-full">
                {subAdmins.length} Members
              </span>
            </div>

            {/* List Table */}
            <div className="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100">
              {subAdmins.map((subAdmin) => (
                <div key={subAdmin.id} className="p-4 bg-white hover:bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center shadow-sm select-none ${
                      subAdmin.status === 'Active' 
                        ? 'bg-[#002a32] text-[#ecc260] border border-[#ecc260]/30' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {subAdmin.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-[#002a32] text-sm break-all">{subAdmin.email}</span>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-200/60">
                          {subAdmin.role}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Invited on {subAdmin.invitedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {/* Status Badge */}
                    {subAdmin.status === 'Active' ? (
                      <span className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full text-[10px] flex items-center gap-1">
                        <FaCheckCircle className="text-xs" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full text-[10px] flex items-center gap-1">
                        <FaClock className="text-xs animate-pulse" />
                        <span>Pending</span>
                      </span>
                    )}

                    {/* Revoke Action */}
                    <button
                      onClick={() => handleDelete(subAdmin.id, subAdmin.email)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200 cursor-pointer"
                      title="Revoke Access"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </AdminLayout>
  );
};

export default Settings;
