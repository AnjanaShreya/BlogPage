import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import HelpModal from './HelpModal';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaGavel, 
  FaCheckCircle, 
  FaEdit, 
  FaCalendarAlt, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaBell, 
  FaQuestionCircle,
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const [showHelp, setShowHelp] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isSubAdmin = location.pathname.includes('subadmin') || location.pathname.includes('onlyblogreview');

  // Sidebar Links Navigation Items
  const sidebarLinks = isSubAdmin ? [
    { label: 'Dashboard', icon: <FaChartLine />, path: '/admin/onlyblogreview' },
    { label: 'First Submission', icon: <FaCheckCircle />, path: '/admin/subadminaprroval' },
    { label: 'Blog Reviews', icon: <FaEdit />, path: '/admin/subadminreviews' },
  ] : [
    { label: 'Dashboard', icon: <FaChartLine />, path: '/admin/dashboard' },
    { label: 'Approvals', icon: <FaCheckCircle />, path: '/admin/approveblogs' },
    { label: 'Reviews', icon: <FaEdit />, path: '/admin/reviewblogs' },
    { label: 'Events', icon: <FaCalendarAlt />, path: '/admin/swprograms' },
    { label: 'Settings', icon: <FaCog />, path: '/admin/settings' },
  ];

  // Email First Letter setup
  const adminEmail = localStorage.getItem("adminEmail") || "Admin";
  const firstLetter = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="h-screen overflow-hidden flex bg-[#F4F6F8] text-gray-800 font-sans antialiased">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 min-w-[16rem] max-w-[16rem] flex-shrink-0 flex flex-col justify-between py-6 px-4 border-r bg-white border-gray-200 shadow-sm">
        <div>
          {/* Logo Heading */}
          <div className="flex items-center gap-2 px-3 mb-6">
            <FaGavel className="text-2xl text-[#8C6D23]" />
            <div>
              <h1 className="text-xl font-extrabold text-[#002a32] tracking-tight font-serif">LexScripta</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Legal Publishing Admin</p>
            </div>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              // We're on this path, or it's a subpath. For dashboard, exact match.
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-[#E0F2F1] text-[#004D40] shadow-sm' 
                      : 'text-gray-500 hover:text-[#002a32] hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-base ${isActive ? 'text-[#004D40]' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Items */}
        <div className="space-y-1">
          <button 
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-gray-500 hover:text-[#002a32] hover:bg-gray-50 cursor-pointer"
          >
            <FaQuestionCircle className="text-base text-gray-400" />
            <span>Help Center</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-red-500 hover:bg-red-50/50"
          >
            <FaSignOutAlt className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT WRAPPER */}
      <div className="flex-grow h-full min-h-0 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="py-4 px-6 md:px-8 border-b flex items-center justify-end bg-[#F4F6F8] border-gray-200">
          {/* Right Header items */}
          <div className="flex items-center gap-6">
            {/* Live date/time */}
            <span className="text-xs font-bold text-gray-500 font-mono tracking-wide">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            
            {/* Bell Icon with Red Dot */}
            <div className="relative cursor-pointer text-gray-500 hover:text-[#002a32]">
              <FaBell className="text-lg" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* Profile Avatar - Initial of login email */}
            <div className="w-8 h-8 rounded-full bg-[#002a32] text-[#ecc260] font-extrabold flex items-center justify-center border border-[#ecc260]/30 cursor-pointer shadow-sm text-xs select-none">
              {firstLetter}
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        {children}
        
      </div>

      {/* 3. HELP CENTER MODAL OVERLAY */}
      <HelpModal 
        showHelp={showHelp} 
        onClose={() => setShowHelp(false)} 
        activeHelpTab={activeHelpTab} 
        setActiveHelpTab={setActiveHelpTab} 
      />
    </div>
  );
};

export default AdminLayout;
